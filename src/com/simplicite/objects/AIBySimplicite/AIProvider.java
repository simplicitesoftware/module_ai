package com.simplicite.objects.AIBySimplicite;

import java.util.*;


import org.json.JSONArray;
import org.json.JSONObject;

import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;

import com.simplicite.util.tools.*;


/**
 * Business object AIProvider
 */
public class AIProvider extends ObjectDB {
	private static final long serialVersionUID = 1L;
	private JSONObject getDefaultFields(){
		return new JSONObject(getGrant().T("AI_DEFAULT_PARAM"));
	}
	public String getConfigurationPage(){
		JSONObject datas = new JSONObject();
		datas.put("fields", new JSONArray()
				.put(getUrlJSON("aiPrvPingUrl",false))
				.put(getUrlJSON("aiPrvCompletionUrl",true))
				.put(getUrlJSON("aiPrvModelsUrl",true))
		);
		datas.put("help",MarkdownTool.toHTML(getFieldValue("aiPrvHelp")));
		String html = HTMLTool.getResourceHTMLContent(this,"AISettingsKeyAndEPTemplate");
		return MustacheTool.apply(html, datas);
	}
	public String getParamPage(String[] models,List<String> requiredFields){
		JSONObject defaultFields = getDefaultFields();
		String htmlTemplate = HTMLTool.getResourceHTMLContent(this,"AISettingsParamTemplate");
		AppLog.info("default: "+defaultFields.toString(1), getGrant());
		JSONObject specificParam = new JSONObject(getFieldValue("aiPrvDataModel"));
		JSONObject param = AITools.getCurrentParams(defaultFields);
		specificParam = AITools.getCurrentParams(specificParam);
		param.put("provider", getFieldValue("aiPrvProvider"));
		JSONObject datas = new JSONObject();
		datas.put("DefFields", addFields(new String[]{"provider", "model","bot_name"}, param, models, requiredFields,null));
		
		datas.put("DetailsFields", addFields(new String[]{"hist_depth","showDataDisclaimer"}, param, null,requiredFields,null));

		datas.put("tokenCard",new JSONObject().put("Title", "Tokens").put("cardFields", addFields(new String[]{"code_max_token","default_max_token"}, param, null,requiredFields,null)));
		
		if("Open AI".equals(getFieldValue("aiPrvProvider"))){
			datas.put("speCard",new JSONObject().put("Title", "OpenAI parameters").put("cardFields", addFields(new String[]{"OpenAI-Project","OpenAI-Organization"}, specificParam, null,requiredFields,new JSONObject(getFieldValue("aiPrvDataModel")))));
		}
		
		return MustacheTool.apply(htmlTemplate, datas);
	}
	private JSONObject getUrlJSON(String field,boolean required){
		return new JSONObject().put("field", field).put("label", getField(field).getLabel()).put("value", getFieldValue(field)).put("required", required);
	}
	public JSONArray addFields(String[] fields,JSONObject param,String[] models, List<String> requiredFields,JSONObject fieldsParam){
		String fieldTemplate = HTMLTool.getResourceHTMLContent(this,"AISettingsFieldsTemplate");
		JSONArray fieldsHtml = new JSONArray();
		for (String field : fields) {
			JSONObject json = getFieldJSON(field,param,models,requiredFields,fieldsParam);
			AppLog.info("field: "+json.toString(1), getGrant());
			fieldsHtml.put(MustacheTool.apply(fieldTemplate, json));
		}
		return fieldsHtml;

	}
	public JSONObject getFieldJSON(String field,JSONObject param,String[] selectList, List<String> requiredFields, JSONObject fieldsParam){
		String help = optHelp(field,fieldsParam);
		if(Tool.isEmpty(fieldsParam)) fieldsParam = getDefaultFields();
		JSONObject fieldJSON = new JSONObject();
		fieldJSON.put("Field", field);

		fieldJSON.put("Default", param.optString(field));
		fieldJSON.put("mandatory", requiredFields.contains(field));
		fieldJSON.put("Label", AITools.optLabel(field,fieldsParam,getGrant().getLang()));
		if(!Tool.isEmpty(help)) fieldJSON.put("Help", help);
		switch (fieldsParam.optJSONObject(field,new JSONObject()).optString("type")) {
			case "select":
				fieldJSON.put("SelectField", true);
				JSONArray choices = new JSONArray();
				for (String item : selectList) {
					choices.put(new JSONObject().put("item", item).put("selected", item.equals(param.optString(field))));
				}
				fieldJSON.put("Choices", choices);
				break;
			case "boolean":
				fieldJSON.put("BoolField", true);
				fieldJSON.put("Default", param.optBoolean(field, true));
				break;
			default:
				fieldJSON.put("ClasicField", true);
				fieldJSON.put("Type", "text");
				break;
		}
		return fieldJSON;
	}
	
	private String optHelp(String key,JSONObject fieldsParam){
		if(Tool.isEmpty(fieldsParam)) fieldsParam = getDefaultFields();
		String help = fieldsParam.optJSONObject(key,new JSONObject()).optString("help");

		return MarkdownTool.toHTML(help).replaceAll("<a href=\"([^\"]*)\"", "<a target=\"_blank\" href=\"$1\"").replace("\n", "").replace("\"", "\\\"");
	}

		 
		
}