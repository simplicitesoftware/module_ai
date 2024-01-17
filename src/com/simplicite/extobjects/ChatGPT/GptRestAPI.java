package com.simplicite.extobjects.ChatGPT;

import com.simplicite.commons.ChatGPT.GPTField;
import com.simplicite.commons.ChatGPT.GptTools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * External object GptRestAPI
 */
public class GptRestAPI extends com.simplicite.webapp.services.RESTServiceExternalObject {
	private static final String JSON_OBJECT_NAME_KEY = "objectName";
	private static final String JSON_OBJECT_ID_KEY = "objectID";
	private static final String PARAMS_PROMPT_KEY = "prompt";
	@Override
	public Object get(Parameters params) throws HTTPException {
		return error(400, "Call me in POST please!");
	}

	@Override
	public Object post(Parameters params) throws HTTPException {
		try {
			AppLog.info("PARAMS: "+params, getGrant());
			AppLog.info("DEBUG API", getGrant());
			String prompt =params.getParameter(PARAMS_PROMPT_KEY);
			String objectName = params.getParameter(JSON_OBJECT_NAME_KEY);
			String objectID = params.getParameter(JSON_OBJECT_ID_KEY);
			JSONObject req = params.getJSONObject();
			
			if(Tool.isEmpty(prompt) && !Tool.isEmpty(req) && req.has(PARAMS_PROMPT_KEY)){
				return updateFieldByRequest(req);
			}else if (!Tool.isEmpty(prompt) ) {
				return updateFieldByParam(prompt,params);
			}else if(Tool.isEmpty(prompt) && !Tool.isEmpty(objectName) && !Tool.isEmpty(objectID)){
				return frontGptCaller(objectName, objectID);
			} else {
				return error(400, "Call me with a prompt or a object param please!");
			}
		} catch (Exception e) {
			return error(e);
		}
	}
	private Object frontGptCaller(String objectName, String objectID){
		ObjectDB obj = Grant.getSystemAdmin().getTmpObject(objectName);
		JSONArray res = new JSONArray();
		synchronized(obj.getLock()){
			obj.select(objectID);
			List<ObjectField> test = obj.getFields();
			for(ObjectField fld : obj.getFields()){
				if(isGPTField(fld)){
					String response = GPTField.calculGPTField(fld, obj,true, getGrant());
					res.put(new JSONObject()
						.put("fieldName", fld.getName())
						.put("value", response)
					);
					fld.setValue(response);
				
				}
			}
		}
		obj.save();

		return res;
	}
	private boolean isGPTField(ObjectField fld){
		return "GPT".equals(fld.getRendering());
	}
	private Object updateFieldByRequest(JSONObject req){
		// Update the prompt value based on the request parameters
		 String prompt = req.getString(PARAMS_PROMPT_KEY);
		// Check if the request contains the necessary parameters for updating a field value
		if (req.has("fieldName") && req.has(JSON_OBJECT_NAME_KEY) && req.has(JSON_OBJECT_ID_KEY)){
			String fieldName = req.getString("fieldName");
			String objectName = req.getString(JSON_OBJECT_NAME_KEY);
			String objectID = req.getString(JSON_OBJECT_ID_KEY);
			ObjectDB obj = Grant.getSystemAdmin().getTmpObject(objectName);
			synchronized(obj.getLock()){
				obj.select(objectID);
				ObjectField fld = obj.getField(fieldName);
				fld.setValue(prompt);
				GPTField.validateGPTField(fld, obj, getGrant());
				return fld.getValue();
			}
		}
		return prompt;
	}
	private Object updateFieldByParam(String prompt, Parameters params){
		int histDepth = Grant.getSystemAdmin().getJSONObjectParameter("GPT_API_PARAM").getInt("hist_depth");
		JSONObject res;
		String specialisation = params.getParameter("specialisation");
		AppLog.info("specialisation: "+specialisation, getGrant());
		String objectName = params.getParameter(JSON_OBJECT_NAME_KEY);
		String objectID = params.getParameter(JSON_OBJECT_ID_KEY);
		String historicString = params.getParameter("historic");
		AppLog.info("historicString: "+historicString, getGrant());
		if(!Tool.isEmpty(objectName) && !Tool.isEmpty(objectID)){
			ObjectDB obj = Grant.getSystemAdmin().getTmpObject(objectName);
			synchronized(obj.getLock()){
				obj.select(objectID);
				res = GptTools.expresionGptCaller(getGrant(), specialisation, prompt, obj);
			}
			
		}else if (!Tool.isEmpty(historicString)){
			JSONArray historic = new JSONArray();
			int i=0;
			JSONArray list = new JSONArray(historicString);
			int begin = list.length()-histDepth*2;
			for(Object hist : list){
				if(i>=begin)
					historic.put(GptTools.formatMessageHistoric(new JSONObject((String) hist)));
				i++;
			}
			AppLog.info(historic.toString(0), getGrant());
			res = GptTools.gptCaller(getGrant(), specialisation, historic, prompt);
			AppLog.info(res.toString(0),getGrant());
		}else{
			AppLog.info(specialisation+" "+prompt, getGrant());
			res = GptTools.gptCaller(getGrant(), specialisation, prompt);
		}

		return new JSONObject()
			.put("request", prompt)
			.put("response", res);
	}
	/* public void call(String url){
		var body = {"prompt":"","objectName":String([OBJNAME]),"fieldName":"gptNotepad","objectID":String([ROWID])};
		RESTTool.request(JSON.stringify(body),null,url, "POST", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJHUFRVc2VyV0VCU0VSVmljZSIsImlhdCI6MTcwMDgzODU2OCwiaXNzIjoiU2ltcGxpY2l0ZSIsImV4cCI6MTcwNjIxNjEwMH0.nT_gkiTPgIqitYu-j6fQaMsODyw5SDa7faFiqORkW70", null, null, 0);
	} */

		
}