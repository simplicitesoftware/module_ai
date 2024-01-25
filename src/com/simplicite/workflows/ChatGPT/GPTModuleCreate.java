package com.simplicite.workflows.ChatGPT;

import java.util.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import com.simplicite.bpm.*;
import com.simplicite.commons.ChatGPT.GptModel;
import com.simplicite.commons.ChatGPT.GptTools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.ObjectContextWeb;


/**
 * Process GPTModuleCreate
 */
public class GPTModuleCreate extends Processus {
	private static final long serialVersionUID = 1L;
	private static final String PROCESS_RESOURCE_EXTERNAL_OBJECT ="GptProcessResource";
	private static final String FIELD ="Field";
	private static final String ROW_ID ="row_id";
	private static final String EMPTY_TEXTAREA ="<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"json_return\" name=\"json_return\"></textarea>";
	private static final String ACTIVITY_SELECT_MODULE ="GPTC_0100";
	private static final String ACTIVITY_SELECT_GROUP ="GPTC_0200";
	private static final String ACTIVITY_SELECT_DOMAIN ="GPTC_0300";
	private static final String ACTIVITY_INTERACTION ="GPTC_0350";
	private static final String ACTIVITY_PROMPT ="GPTC_0400";
	private static final String ACTIVITY_GPT ="GPTC_0500";
	//private static final String ACTIVITY_GENERATION ="GPTC_0600";
	//private static final String ACTIVITY_REMOVE_MODULE ="GPTC_0700";
	private static final String ACTIVITY_GEN_DATA ="GPTC_0800";
	

	/**
	 * This method is used to generate the HTML content for the chat bot.
	 * 
	 * @param p The processus object.
	 * @param context The activity file object.
	 * @param ctx The object context web object.
	 * @param g The grant object.
	 * @return The generated HTML content for the chat bot.
	 */
	public String chatBot(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		String script = g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("CHAT_BOT_SCRIPT");
		String css = HTMLTool.lessToCss(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceCSSContent("CHAT_BOT_CSS"));
		String html = g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceHTMLContent("CHAT_BOT_MODEL");
		html = html.replace("{{script}}", script);
		html = html.replace("{{css}}", css);
		html = html.replace("{{init}}", g.getLang().equals(Globals.LANG_FRENCH)?"Bonjour! Comment puis-je vous aider avec la conception d'applications? Voulez-vous que je vous aide a definir vos besoin ou avez-vous des questions spécifiques sur la conception?":"Hello! How can I help you with application design? Do you want me to help you define your needs or do you have specific questions about design?");
		return html;
	}
	/**
	 * Generates a form element for capturing user input.
	 *
	 * @param p The process object.
	 * @param context The activity file object.
	 * @param ctx The web object context.
	 * @param g The grant object.
	 * @return The HTML code for the form element.
	 */
	public String form(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		return "<textarea  class=\"form-control autosize js-focusable\"  id=\"gpt_prompt\" name=\"gpt_prompt\" placeholder=\"Describe your needs here\"></textarea>";
	}

	/**
	 * This method is used to generate a response using the GPT model.
	 * 
	 * @param p The process instance.
	 * @param context The activity file context.
	 * @param ctx The object context web.
	 * @param g The grant.
	 * @return The generated response as a String.
	 */
	public String gpt(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() == ActivityFile.STATE_DONE)
			return null;
		List<String> listResult = getJsonAi( getPreviousContext(context).getActivity().getStep(), g);
		if(Tool.isEmpty(listResult)) return EMPTY_TEXTAREA;
		if(listResult.size()!=3)return Message.formatError(null, listResult.get(0),null );
		return "<p>"+listResult.get(0)+"</p>"+"<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"json_return\" name=\"json_return\">"+listResult.get(1)+"</textarea>"+"<p>"+listResult.get(2)+"</p>";
		
		
	}
	private List<String> getJsonAi(String previousStep, Grant g){
		int histDepth = Grant.getSystemAdmin().getJSONObjectParameter("GPT_API_PARAM").getInt("hist_depth");
		
		
		JSONArray historic = new JSONArray();
		String prompt = "";
		if(previousStep.equals(ACTIVITY_PROMPT)){
			prompt = getContext(getActivity(ACTIVITY_PROMPT)).getDataValue("Data", "gpt_prompt");
			if(Tool.isEmpty(prompt)){//for test
				return null;
			}
			JSONObject data = new JSONObject().put("prompt", prompt);
			prompt = MustacheTool.apply(new String(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceContent(Resource.TYPE_OTHER,"CONTEXT_DIRECT_PROMPT")), data);
			
		}else if(previousStep.equals(ACTIVITY_INTERACTION)){
			String historicString = getContext(getActivity(ACTIVITY_INTERACTION)).getDataValue("Data", "gpt_data");
			if(Tool.isEmpty(historicString)){//for test
				return null;
			}
			if (!Tool.isEmpty(historicString)){
				
				int i=0;
				JSONArray list = new JSONArray(historicString);
				int begin = list.length()-histDepth*2;
				for(Object hist : list){
					if(i>=begin)
						historic.put(GptTools.formatMessageHistoric(new JSONObject((String) hist)));
					i++;
				}
			}
			prompt =new String(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceContent(Resource.TYPE_OTHER,"CONTEXT_INTERACTION_PROMPT"));
			
		}
		if(Tool.isEmpty(prompt)){//for test
			return null;
		}
		String result = GptTools.gptCaller(g, "you help to create UML in json for application, your answers are automatically processed in java", prompt, historic,false).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		List<String> listResult = new ArrayList<String>();
		if(!GptTools.isValidJson(result)){	
			listResult = GptTools.getJSONBlock(result,getGrant());
			if(Tool.isEmpty(listResult) || !GptTools.isValidJson(listResult.get(1))){
				listResult = new ArrayList<String>();
				listResult.add("Sorry GPT do not return interpretable json: \n");
				
			}
		}else{
			listResult.add("");
			listResult.add(result);
			listResult.add("");	
		}
		return listResult;
	}
	/**
	 * Generates a string based on the provided parameters.
	 * 
	 * @param p The Processus object.
	 * @param context The ActivityFile object.
	 * @param ctx The ObjectContextWeb object.
	 * @param g The Grant object.
	 * @return The generated string.
	 */
	public String gen(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() == ActivityFile.STATE_DONE){
			return null;}
		String json = "";
		if (!getActivity(ACTIVITY_GPT).isUserDialog()){
			List<String> result = getJsonAi(getPreviousContext(getPreviousContext(context)).getActivity().getStep(), g);
			if(!Tool.isEmpty(result) && result.size()==3) json = result.get(1); //isEmpty check null
			
		}else{
			json = getContext(getActivity(ACTIVITY_GPT)).getDataValue("Data", "json_return");
		}
		
		if (Tool.isEmpty(json)){
			return Message.formatError("GPT_ERROR",null,null );
		}
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		String[] groupIds = getContext(getActivity(ACTIVITY_SELECT_GROUP)).getDataFile(FIELD, ROW_ID,false).getValues();
		String domainId = getContext(getActivity(ACTIVITY_SELECT_DOMAIN)).getDataValue(FIELD, ROW_ID);
		try{
			List<String> ids = GptModel.genModule(moduleId,	groupIds,domainId,new JSONObject(json));
			DataFile dataFile = getContext(getActivity(ACTIVITY_GEN_DATA)).addDataFile("Data","ids");
			dataFile.setValues(ids);
			return "<p>SUCESS</p><script>" + g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("GPT_GEN_MODEL")+"\n"+ "gptNewModel("+ids.toString()+",\""+ModuleDB.getModuleName(moduleId)+"\",\""+moduleId+"\");"+"</script>";
		} catch (GetException | ValidateException | SaveException e) {
			AppLog.error(e, g);
			return "error";
		}
		
		
	}

	/**
	 * Deletes a module and returns the HTML code for displaying the module delete confirmation.
	 * 
	 * @param p The processus object.
	 * @param context The activity file context.
	 * @param ctx The object context web.
	 * @param g The grant object.
	 * @return The HTML code for displaying the module delete confirmation.
	 */
	public String deleteModule(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		return "<div id=\"deleteModule\"></div><script>$ui.displayModuleDelete($(\"#deleteModule\"),"+ moduleId +" )</script>";
	}
	public String genData(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() == ActivityFile.STATE_DONE)
			return null;
		return "todo";
		// AppLog.info(String.join(",",context.getDataFile("Data","ids",false).getValues()),g);
		// String[] ids = context.getDataFile("Data","ids",true).getValues();
		// //String json = getContext(getActivity(ACTIVITY_GPT)).getDataValue("Data", "json_return");
		// JSONObject data = new JSONObject();
		// for(String id : ids){
		// 	String name = ObjectDB.getObjectName(id);
		// 	data.put(name, new JSONArray().put(GPTData.formatObjectInJson(name, g)));
			
		// }
		// AppLog.info(": ```json "+data.toString(1)+"```", g);
		// String response = GptTools.gptCaller(g, /* "module uml: "+json */"", " generates test data according to the model: ```json "+data.toString(1)+"``` becarfull of the order for relationship",false).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		// AppLog.info("getdata: "+response, g);
		// if(!GptTools.isValidJson(response)){	
		// 	List<String> listResult = GptTools.getJSONBlock(response,getGrant());
		// 	if(Tool.isEmpty(listResult) || !GptTools.isValidJson(listResult.get(1))){
		// 		return Message.formatError(null, "Sorry GPT do not return interpretable json: \n"+response,null );
		// 	}else{
		// 		response = listResult.get(1);
		// 	}
		// }
		// /* try {
		// 	GPTData.createObjects(ids, new JSONObject(response), g);
		// } catch (SearchException | JSONException | GetException | ValidateException | SaveException e) {
		// 	AppLog.error(e, g);
		// } */
		// String html = "<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" >"+  response +"</textarea>";
		// return html;
		
	}

	

	
	
}