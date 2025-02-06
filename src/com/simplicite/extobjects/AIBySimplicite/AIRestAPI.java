package com.simplicite.extobjects.AIBySimplicite;

import com.simplicite.commons.AIBySimplicite.AiMetrics;
import com.simplicite.commons.AIBySimplicite.AIField;
import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject; 

/**
 * External object AIRestAPI
 */
public class AIRestAPI extends com.simplicite.webapp.services.RESTServiceExternalObject {
	private static final String JSON_OBJECT_NAME_KEY = "objectName";
	private static final String JSON_OBJECT_ID_KEY = "objectID";
	private static final String PARAMS_PROMPT_KEY = "prompt";
	private static final String OBJ_FIELD_NAME = "fieldName";
	private static final String JSON_REQ_TYPE = "reqType";
	private static final String JSON_SWAGGER = "swagger";
	private static final String PARAMS_CONTENT_KEY = "content";
	@Override
	public Object get(Parameters params) throws HTTPException {
		return error(400, "Call me in POST please!");
	}

	@Override
	public Object post(Parameters params) throws HTTPException {
		try {
			AppLog.info("_____________________Test_________________");
			String prompt =params.getParameter(PARAMS_PROMPT_KEY);
			String objectName = params.getParameter(JSON_OBJECT_NAME_KEY);
			String type = params.getParameter(JSON_REQ_TYPE);
			String objectID = params.getParameter(JSON_OBJECT_ID_KEY);
			JSONObject req = params.getJSONObject();
			if (Tool.isEmpty(type)) type = "default";
			if (Tool.isEmpty(prompt) && !Tool.isEmpty(req) && req.has(PARAMS_PROMPT_KEY)) type = "requestField";
			else if (!Tool.isEmpty(objectName) && !Tool.isEmpty(objectID) ) type = Tool.isEmpty(prompt)?"frontAiCall":"paramField";

			
			AppLog.info(type);
			switch (type) { //use switch for future extension
				case "provider":
				 	return  new JSONObject().put("provider",AITools.provider());
				case "chatBot":
					return chatbotCaller(prompt,params);
				case "metrics":
					return metricsPost(params,prompt);
				case "saveMetrics":
					return saveMetrics(params);
				case "errorMetricsSolver":
					return recallWithError(params,prompt);
				case "reformulateMetrics":
					return AiMetrics.getReformulatePrompt(prompt);
				case "BOT_NAME":
					return new JSONObject().put("botName",AITools.getBotName());
				case "CHECK_SPEECH_RECOGNITION":
					return new JSONObject().put("isSpeechRecognitionSupported",AITools.checkSpeechRecognition());
				case "ping":
					return ping();
				case "audio":
					return audio(params);
				case "requestField":
					return updateFieldByRequest(req);
				case "paramField":
					return updateFieldByParam(prompt,params,objectID,objectName);
				case "frontAiCall":
					return frontAiCaller(objectName, objectID);
				case "commentCode":
					String content =params.getParameter(PARAMS_CONTENT_KEY);
					return commentCode(content);

				default:
					AppLog.info("AI API ERROR: "+type+params.toJSON());
					return error(400, "Call me with a predefined request type, prompt or a object param please!");
			}
			
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return error(e);
		}
		
	}
	private Object commentCode(String code){
		Grant g = Grant.getSystemAdmin();
		AppLog.info(code);
		JSONObject commentedCode = AITools.aiCodeCaller(g,"You add comment on the code provided.e",code);
		return commentedCode;
	}
	private Object metricsPost(Parameters params,String prompt){
		JSONObject swagger = params.has(JSON_SWAGGER)?new JSONObject(params.getParameter(JSON_SWAGGER)):null;
		String lang = params.getParameter("lang");
		return AiMetrics.getJavaScriptMetrics(prompt, swagger,lang).toString(1);
	}
	private Object saveMetrics(Parameters params){
		JSONObject swagger = params.has(JSON_SWAGGER)?new JSONObject(params.getParameter(JSON_SWAGGER)):null;
		if(Tool.isEmpty(swagger)) return error(400,"No swagger provided");
		String mdlName = params.getParameter("moduleName");
		String function = params.getParameter("function");
		String ctx = params.getParameter("ctx");
		return saveMetricsAsCrosstable(ctx,swagger,function,mdlName);	
	}
	private Object recallWithError(Parameters params,String prompt){
		JSONObject swagger = params.has(JSON_SWAGGER)?new JSONObject(params.getParameter(JSON_SWAGGER)):null;
		String error = params.getParameter("error");
		String lang = params.getParameter("lang");
		String script = params.getParameter("script");
		String html = params.getParameter("html");
		return AiMetrics.recallWithError(prompt, lang, swagger,script,html, error);
	}
	private Object ping(){
		String ping = AITools.pingAI();
		boolean isSuccess = AITools.PING_SUCCESS.equals(ping);
		if(isSuccess){
			ping = Message.formatInfo("AI_SUCCESS_PING",null,null);
		}
		return new JSONObject().put("msg",ping);
	}
	private Object audio(Parameters params){
		String audio64 = params.getParameter("file");
		String text = AITools.speechToText(audio64);
		return new JSONObject().put("msg",text);
	}
	private Object frontAiCaller(String objectName, String objectID){
		ObjectDB obj = Grant.getSystemAdmin().getTmpObject(objectName);
		JSONArray res = new JSONArray();
		synchronized(obj.getLock()){
			obj.select(objectID);
			for(ObjectField fld : obj.getFields()){
				if(isAIField(fld)){
					String response = AIField.calculAIField(fld, obj,true, getGrant());
					res.put(new JSONObject()
						.put(OBJ_FIELD_NAME, fld.getName())
						.put("value", response)
					);
					fld.setValue(response);
				
				}
			}
		}
		obj.save();

		return res;
	}
	private boolean isAIField(ObjectField fld){
		return "AI".equals(fld.getRendering());
	}
	private Object updateFieldByRequest(JSONObject req){
		// Update the prompt value based on the request parameters
		 String prompt = req.getString(PARAMS_PROMPT_KEY);
		// Check if the request contains the necessary parameters for updating a field value
		if (req.has(OBJ_FIELD_NAME) && req.has(JSON_OBJECT_NAME_KEY) && req.has(JSON_OBJECT_ID_KEY)){
			String fieldName = req.getString(OBJ_FIELD_NAME);
			String objectName = req.getString(JSON_OBJECT_NAME_KEY);
			String objectID = req.getString(JSON_OBJECT_ID_KEY);
			ObjectDB obj = Grant.getSystemAdmin().getTmpObject(objectName);
			synchronized(obj.getLock()){
				obj.select(objectID);
				ObjectField fld = obj.getField(fieldName);
				fld.setValue(prompt);
				AIField.validateAIField(fld, obj, getGrant());
				return fld.getValue();
			}
		}
		return prompt;
	}
	private Object updateFieldByParam(String prompt, Parameters params,String objectID,String objectName ){
		Grant g = getGrant();
		boolean isJsonPrompt = true;
		JSONArray jsonPrompt = optJSONArray(prompt);
		if(Tool.isEmpty(jsonPrompt)){
			isJsonPrompt = false;
		}
		int histDepth = AITools.getHistDepth();
		JSONObject res;
		String specialisation = params.getParameter("specialisation");
		String historicString = params.getParameter("historic");
		ObjectDB obj = null;
		
		if(!isJsonPrompt){
			obj = Grant.getSystemAdmin().getTmpObject(objectName);
			synchronized(obj.getLock()){
				obj.select(objectID);
				res = AITools.expresionAiCaller(g, specialisation, prompt, obj);
			}
			
		}else{
			JSONArray historic = optHistoric(historicString, histDepth);
			res = AITools.aiCaller(g, specialisation, historic, jsonPrompt);
		}

		return new JSONObject()
			.put("request", prompt)
			.put("response", res);
	}
	private Object chatbotCaller(String prompt, Parameters params){
		Grant g = getGrant();
		boolean isJsonPrompt = true;
		JSONArray jsonPrompt = optJSONArray(prompt);
		if(Tool.isEmpty(jsonPrompt)){
			isJsonPrompt = false;
		}
		int histDepth = AITools.getHistDepth();
		JSONObject res;
		String specialisation = params.getParameter("specialisation");
		String historicString = params.getParameter("historic");
		String providerParamsString = params.getParameter("providerParams");
		AppLog.info(providerParamsString);
		JSONArray historic = optHistoric(historicString, histDepth);
		JSONObject providerParams = optJSONObject(providerParamsString);
		res = AITools.aiCaller(g, specialisation, historic, providerParams, isJsonPrompt ? jsonPrompt : prompt);
		return new JSONObject()
			.put("request", prompt)
			.put("response", res);
	}
	private JSONArray optJSONArray(String prompt){
		try {
			return new JSONArray(prompt);
		}catch(Exception e){
		 	return new JSONArray();
		}
	}
	private JSONObject optJSONObject(String object){
		if(Tool.isEmpty(object)) return new JSONObject();
		try{
			return new JSONObject(object);
		}catch(JSONException e){
			return new JSONObject();
		}
		
	}
	private JSONArray optHistoric(String historicString, int histDepth){
		if (Tool.isEmpty(historicString)) return null;
		JSONArray historic = new JSONArray();
		int i=0;
		JSONArray list = new JSONArray(historicString);
		int begin = list.length()-histDepth*2;
		for(Object hist : list){
			if(i>=begin)
				historic.put(AITools.formatMessageHistoric(new JSONObject((String) hist)));
			i++;
		}
		return historic;
	}
	private String saveMetricsAsCrosstable(String ctx,JSONObject swagger, String function, String mdlName){
		
		String mldId = ModuleDB.getModuleId(mdlName);
		JSONObject jsonRes = AiMetrics.iaConvert(swagger.toString(), function);
		if (Tool.isEmpty(jsonRes)) {
			return "Error:No valid json response from AI, see logs for more details.";
		}
		jsonRes.put("mldId", mldId);
		JSONObject ct = AiMetrics.createCrossTable(jsonRes);

		return displayCrossTable(ctx,ct.optString("objName"),ct.optString("ctName"),jsonRes.optString("type","bar"));
	}
	private static String displayCrossTable(String ctx,String objName, String tableName, String type){
		String js ="$ui.displayCrosstab("+ctx+", \""+objName+"\", \""+tableName+"\", {\"options\":{\r\n" + //
				" \"zwidth\": \"100%\",\r\n" + //
				" \"zheight\": \"30rem\",\r\n" + //
				" \"zcaption\": \"no\",\r\n" + //
				" \"zcontrol\": \"yes\",\r\n" + //
				" \"zstotal\": \"no\",\r\n" + //
				" \"ztable\": \"no\",\r\n" + //
				" \"zgraph\": \""+type+"\",\r\n" + //
				" \"zstcolor\": \"#D9D2E9\"\r\n" + //
				"}},null);";
			return "javascript:"+js;
	}

		
}