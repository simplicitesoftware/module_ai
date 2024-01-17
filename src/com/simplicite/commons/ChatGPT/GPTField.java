package com.simplicite.commons.ChatGPT;

import java.util.*;

import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;
/**
 * Shared code GPTField
 */
public class GPTField implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	private static final String GPT_ERROR_RETURN = "GPT_ERROR_RETURN";
	private static final String JSON_ERROR_KEY = "error";
	private static String gptApiParamTrigger = Grant.getSystemAdmin().getJSONObjectParameter("GPT_API_PARAM").getString("trigger");
	public static List<String> validateGPTField(ObjectField fld,Grant g){
		return validateGPTField(fld,null,g);
	}
	/**
	 * Format field value, send to GPT API and update value with API response. 
	 * @param fld Field to parse for chat gpt call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 * 
	 */
	public static List<String> validateGPTField(ObjectField fld,ObjectDB obj,Grant g){
		
		switch(fld.getType()){
			case ObjectField.TYPE_NOTEPAD:
				return validateNotepadGPTField(fld,obj,g);
				
			case ObjectField.TYPE_LONG_STRING:
				return validateLongStringGPTField(fld,obj,g);
			default:
				List<String> msgs = new ArrayList<>();
				msgs.add(Message.formatInfo("NOT_GPT_FIELD", null, null));
				return msgs;
		}
		
	}
	public static String calculGPTField(ObjectField fld,Grant g){
		return calculGPTField(fld, null,false,g);
	}
	public static String calculGPTField(ObjectField fld,ObjectDB obj,Grant g){
		return calculGPTField(fld, obj,false,g);
	}
	/**
	 * Format field value, send to GPT API and update value with API response. 
	 * @param fld Field to parse for chat gpt call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 * 
	 */
	public static String calculGPTField(ObjectField fld,ObjectDB obj,boolean update,Grant g){
		AppLog.info("DEBUG IN CALCUL: "+Tool.isEmpty(fld),g);
		List<String> msgs = new ArrayList<>();
		switch(fld.getType()){
			case ObjectField.TYPE_NOTEPAD:
				msgs.addAll(validateNotepadGPTField(fld,obj,update,g));
				break;
				
			case ObjectField.TYPE_LONG_STRING:
				msgs.addAll(validateLongStringGPTField(fld,obj,update,g));
				break;
			default:
				return Message.formatInfo("NOT_GPT_FIELD", null, null);
		}
		if(!Tool.isEmpty(msgs)){
			AppLog.error(String.join(" \n", msgs), null, g);
			return Message.formatError("GPT_ERROR", null, null);
		}
		return fld.getValue();
		
	}
	public static List<String> validateNotepadGPTField(ObjectField fld,ObjectDB obj,Grant g){
		return validateNotepadGPTField(fld,obj,false,g);
	}
	/**
	 * validateGPTField for notepad use exchange to historic.
	 * @param fld Field to parse for chat gpt call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 */
	public static List<String> validateNotepadGPTField(ObjectField fld,ObjectDB obj,boolean update,Grant g){
		List<String> msgs = new ArrayList<>();
		if(Tool.isEmpty(fld)){
			msgs.add(Message.formatError("GPT_EMPTY_FILE",null,null));
			return msgs;
		}
		String spe = "";
		ObjectDB fldObj = Grant.getSystemAdmin().getTmpObject("Field");
		synchronized(fldObj){
			fldObj.select(fld.getId());
			if(!(fldObj.getFieldValue("fld_type").equals(String.valueOf(ObjectField.TYPE_NOTEPAD)) && fldObj.getFieldValue("fld_rendering").equals("GPT"))){
				msgs.add(Message.formatError("GPT_NO_NOTEPAD_GPT",null,null));
				return msgs;
			}
			spe= fldObj.getFieldValue("gptFldSpe");
		}
		if (!Tool.isEmpty(fld.getValue()) && (fld.hasChanged() || update )){
			msgs.addAll(validateNotepadGPTFieldInternal(fld, obj, g, spe));
		}
		return msgs;
	}

	/**
	 * Validates the Notepad GPT field.
	 * 
	 * @param fld The ObjectField to validate.
	 * @param obj The ObjectDB object.
	 * @param g The Grant object.
	 * @param spe The specific parameter.
	 * @return A list of error messages, if any.
	 */
	private static List<String> validateNotepadGPTFieldInternal(ObjectField fld, ObjectDB obj, Grant g, String spe) {
		List<String> msgs = new ArrayList<>();
		Pattern p = Pattern.compile("\\[.{4}\\-.{2}\\-.{2} .{2}\\:.{2} - (.+)\\]");
		JSONArray historic = GptTools.formatMessageHistoricFromNotePad(fld.getOldValue(),gptApiParamTrigger);
		String prompt ="";
		boolean begin = true;
		StringBuilder promptBuilder = new StringBuilder();
		for (String l : fld.getValue().split("\n")) {
			Matcher m = p.matcher(l);
			if (m.matches()) {
				if (begin) {
					begin = false;
				} else {
					break;
				}
			} else {
				promptBuilder.append(l).append("\n");
			}
		}
		prompt = promptBuilder.toString();
		p = Pattern.compile("(?i)^" + gptApiParamTrigger + "((?:.|\\s)+)");
		Matcher m = p.matcher(prompt);

		if(m.matches()){
			String sentence = m.group(1);
			try {
				sentence = GptTools.parseExpresion(sentence, obj);
				AppLog.info("parsed = "+sentence,g );
			} catch (ScriptException e) {
				msgs.add(Message.formatError(GPT_ERROR_RETURN,e.toString(),fld.getName()));
				return msgs;
			}
			JSONObject result= GptTools.gptCaller(g, spe, historic, sentence );
			if(result.has(JSON_ERROR_KEY)){
				msgs.add(Message.formatError(GPT_ERROR_RETURN,result.getString("code")+": "+result.getString(JSON_ERROR_KEY),"demoPrdDescription"));
				return msgs;
			}

			fld.addNotepad(g.getLogin(), sentence);
			AppLog.info(fld.getValue(), g);
			fld.setOldValue(fld.getValue());
			fld.addNotepad("ChatGPT",result.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content"));
			AppLog.info(fld.getValue(), g);
		}
		return msgs;
	}
	public static List<String> validateLongStringGPTField(ObjectField fld,ObjectDB obj,Grant g){
		return validateLongStringGPTField(fld,obj,false,g);
	}
	/**
	 * validateGPTField for Long string send value as prompte with max length.
	 * @param fld Field to parse for chat gpt call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 */
	public static List<String> validateLongStringGPTField(ObjectField fld,ObjectDB obj,boolean update,Grant g){
		
		List<String> msgs = new ArrayList<>();
		if(Tool.isEmpty(fld)){
			msgs.add(Message.formatError("GPT_EMPTY_FILE",null,null));
			return msgs;
		}
		String spe = "";
		ObjectDB fldObj = Grant.getSystemAdmin().getTmpObject("Field");
		synchronized(fldObj){
			fldObj.select(fld.getId());
			if(!(fldObj.getFieldValue("fld_type").equals(String.valueOf(ObjectField.TYPE_LONG_STRING)) && fldObj.getFieldValue("fld_rendering").equals("GPT"))){
				msgs.add(Message.formatError("GPT_NO_LONGSTRING_GPT",null,null));
				return msgs;
			}
			spe= fldObj.getFieldValue("gptFldSpe");
		}
		if (!Tool.isEmpty(fld.getValue()) &&( fld.hasChanged() || update)){
			String length = String.valueOf(fld.getSize());
			String lengthDeclarasion = "FRA".equals(g.getLang())?("en maximum"+length+" caracteres"):("in maximum"+length+" characters");
			String prompt = fld.getValue() + " "+lengthDeclarasion;
			Pattern p = Pattern.compile("(?i)^"+gptApiParamTrigger+"((?:.|\\s)+)");
			Matcher m = p.matcher(prompt);
			
			if(m.matches()){
				String sentence =m.group(1);
				try {
					sentence = GptTools.parseExpresion(sentence, obj);
					AppLog.info("parsed = "+prompt,g );
				} catch (ScriptException e) {
					msgs.add(Message.formatError(GPT_ERROR_RETURN,e.toString(),fld.getName()));
					return msgs;
				}
				JSONObject result= GptTools.gptCaller(g, spe, null,  sentence);
				if(result.has(JSON_ERROR_KEY)){
					msgs.add(Message.formatError(GPT_ERROR_RETURN,result.getString("code")+": "+result.getString(JSON_ERROR_KEY),"demoPrdDescription"));
					return msgs;
				}
				fld.setValue(result.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content"));
			}
			
		}
		return msgs;
	}
	
}