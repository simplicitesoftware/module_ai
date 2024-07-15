package com.simplicite.commons.AIBySimplicite;

import java.util.*;

import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;
/**
 * Shared code AIField
 */
public class AIField implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	private static final String AI_ERROR_RETURN = "AI_ERROR_RETURN";
	private static final String JSON_ERROR_KEY = "error";
	private static String aiApiParamTrigger = AITools.getAIParam("trigger");
	public static List<String> validateAIField(ObjectField fld,Grant g){
		return validateAIField(fld,null,g);
	}
	/**
	 * Format field value, send to AI API and update value with API response. 
	 * @param fld Field to parse for chat AI call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 * 
	 */
	public static List<String> validateAIField(ObjectField fld,ObjectDB obj,Grant g){
		
		switch(fld.getType()){
			case ObjectField.TYPE_NOTEPAD:
				return validateNotepadAIField(fld,obj,g);
				
			case ObjectField.TYPE_LONG_STRING:
				return validateLongStringAIField(fld,obj,g);
			default:
				List<String> msgs = new ArrayList<>();
				msgs.add(Message.formatInfo("NOT_AI_FIELD", null, null));
				return msgs;
		}
		
	}
	public static String calculAIField(ObjectField fld,Grant g){
		return calculAIField(fld, null,false,g);
	}
	public static String calculAIField(ObjectField fld,ObjectDB obj,Grant g){
		return calculAIField(fld, obj,false,g);
	}
	/**
	 * Format field value, send to AI API and update value with API response. 
	 * @param fld Field to parse for chat AI call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 * 
	 */
	public static String calculAIField(ObjectField fld,ObjectDB obj,boolean update,Grant g){
		List<String> msgs = new ArrayList<>();
		switch(fld.getType()){
			case ObjectField.TYPE_NOTEPAD:
				msgs.addAll(validateNotepadAIField(fld,obj,update,g));
				break;
				
			case ObjectField.TYPE_LONG_STRING:
				msgs.addAll(validateLongStringAIField(fld,obj,update,g));
				break;
			default:
				return Message.formatInfo("NOT_AI_FIELD", null, null);
		}
		if(!Tool.isEmpty(msgs)){
			AppLog.error(String.join(" \n", msgs), null, g);
			return Message.formatError("AI_ERROR", null, null);
		}
		return fld.getValue();
		
	}
	public static List<String> validateNotepadAIField(ObjectField fld,ObjectDB obj,Grant g){
		return validateNotepadAIField(fld,obj,false,g);
	}
	/**
	 * validateAIField for notepad use exchange to historic.
	 * @param fld Field to parse for chat AI call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 */
	public static List<String> validateNotepadAIField(ObjectField fld,ObjectDB obj,boolean update,Grant g){
		List<String> msgs = new ArrayList<>();
		if(Tool.isEmpty(fld)){
			msgs.add(Message.formatError("AI_EMPTY_FILE",null,null));
			return msgs;
		}
		String spe = "";
		ObjectDB fldObj = Grant.getSystemAdmin().getTmpObject("Field");
		synchronized(fldObj){
			fldObj.select(fld.getId());
			if(!(String.valueOf(ObjectField.TYPE_NOTEPAD).equals(fldObj.getFieldValue("fld_type")) && "AI".equals(fldObj.getFieldValue("fld_rendering")))){
				msgs.add(Message.formatError("AI_NO_NOTEPAD_AI",null,null));
				return msgs;
			}
			spe= fldObj.getFieldValue("aiFldSpe");
		}
		if (!Tool.isEmpty(fld.getValue()) && (fld.hasChanged() || update )){
			msgs.addAll(validateNotepadAIFieldInternal(fld, obj, g, spe));
		}
		return msgs;
	}

	/**
	 * Validates the Notepad AI field.
	 * 
	 * @param fld The ObjectField to validate.
	 * @param obj The ObjectDB object.
	 * @param g The Grant object.
	 * @param spe The specific parameter.
	 * @return A list of error messages, if any.
	 */
	private static List<String> validateNotepadAIFieldInternal(ObjectField fld, ObjectDB obj, Grant g, String spe) {
		List<String> msgs = new ArrayList<>();
		Pattern p = Pattern.compile("\\[.{4}\\-.{2}\\-.{2} .{2}\\:.{2} - (.+)\\]");
		JSONArray historic = AITools.formatMessageHistoricFromNotePad(fld.getOldValue(),aiApiParamTrigger);
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
		p = Pattern.compile("(?i)^" + aiApiParamTrigger + "((?:.|\\s)+)");
		Matcher m = p.matcher(prompt);

		if(m.matches()){
			String sentence = m.group(1);
			try {
				sentence = AITools.parseExpresion(sentence, obj);
			} catch (ScriptException e) {
				msgs.add(Message.formatError(AI_ERROR_RETURN,e.toString(),fld.getName()));
				return msgs;
			}
			JSONObject result= AITools.aiCaller(g, spe, historic, sentence );
			if(result.has(JSON_ERROR_KEY)){
				msgs.add(Message.formatError(AI_ERROR_RETURN,result.getString("code")+": "+result.getString(JSON_ERROR_KEY),"demoPrdDescription"));
				return msgs;
			}

			fld.addNotepad(g.getLogin(), sentence);
			fld.setOldValue(fld.getValue());
			fld.addNotepad("ChatAI",AITools.parseJsonResponse(result));
		}
		return msgs;
	}
	public static List<String> validateLongStringAIField(ObjectField fld,ObjectDB obj,Grant g){
		return validateLongStringAIField(fld,obj,false,g);
	}
	/**
	 * validateAIField for Long string send value as prompte with max length.
	 * @param fld Field to parse for chat AI call
	 * @param g Grant
	 * @return List of format Message (error, info, warning ...)
	 */
	public static List<String> validateLongStringAIField(ObjectField fld,ObjectDB obj,boolean update,Grant g){
		
		List<String> msgs = new ArrayList<>();
		if(Tool.isEmpty(fld)){
			msgs.add(Message.formatError("AI_EMPTY_FILE",null,null));
			return msgs;
		}
		String spe = "";
		ObjectDB fldObj = Grant.getSystemAdmin().getTmpObject("Field");
		synchronized(fldObj){
			fldObj.select(fld.getId());
			if(!isAILongStrField(fldObj)){
				msgs.add(Message.formatError("AI_NO_LONGSTRING_AI",null,null));
				return msgs;
			}
			spe= fldObj.getFieldValue("aiFldSpe");
		}
		if (!Tool.isEmpty(fld.getValue()) &&( fld.hasChanged() || update)){
			String length = String.valueOf(fld.getSize());
			String lengthDeclarasion = "FRA".equals(g.getLang())?("en maximum"+length+" caracteres"):("in maximum"+length+" characters");
			String prompt = fld.getValue() + " "+lengthDeclarasion;
			Pattern p = Pattern.compile("(?i)^"+aiApiParamTrigger+"((?:.|\\s)+)");
			Matcher m = p.matcher(prompt);
			
			if(m.matches()){
				String sentence =m.group(1);
				try {
					sentence = AITools.parseExpresion(sentence, obj);
				} catch (ScriptException e) {
					msgs.add(Message.formatError(AI_ERROR_RETURN,e.toString(),fld.getName()));
					return msgs;
				}
				JSONObject result= AITools.aiCaller(g, spe, null,  sentence);
				if(result.has(JSON_ERROR_KEY)){
					msgs.add(Message.formatError(AI_ERROR_RETURN,result.getString("code")+": "+result.getString(JSON_ERROR_KEY),"demoPrdDescription"));
					return msgs;
				}
				fld.setValue(AITools.parseJsonResponse(result));
			}
			
		}
		return msgs;
	}
	private static boolean isAILongStrField(ObjectDB fieldObject){
		return String.valueOf(ObjectField.TYPE_LONG_STRING).equals(fieldObject.getFieldValue("fld_type")) && "AI".equals(fieldObject.getFieldValue("fld_rendering"));

	}
	
}