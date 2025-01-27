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
	private static final String MODELS_ENDPOINT = "aiPrvModelsUrl";
	private static final String COMPLETION_ENDPOINT = "aiPrvCompletionUrl";
	private static final String PING_ENDPOINT = "aiPrvPingUrl";
	private static final String STT_ENDPOINT = "aiPrvSttUrl";
	private static final Map<String, String> DEFAULT_EDNPOINT =   Map.of(MODELS_ENDPOINT, "v1/models", COMPLETION_ENDPOINT, "v1/chat/completions", PING_ENDPOINT, "v1/ping", STT_ENDPOINT, "v1/audio/transcriptions");
	
	@Override
	public boolean useForm() {
		AppLog.info("useform");
		if(!Tool.isEmpty(ModuleDB.getModuleId("AiDemonstrationAddon")) && !getGrant().hasResponsibility("AI_ADMIN")){
			return false;
		}
		return super.useForm();
	}
	private JSONObject getDefaultFields(){
		return new JSONObject(getGrant().T("AI_DEFAULT_PARAM"));
	}
	public String getConfigurationPage(){
		JSONObject datas = new JSONObject();
		datas.put("fields", new JSONArray()
				.put(getUrlJSON(PING_ENDPOINT,false))
				.put(getUrlJSON(COMPLETION_ENDPOINT,true))
				.put(getUrlJSON(MODELS_ENDPOINT,true))
				.put(getUrlJSON(STT_ENDPOINT, false))
		);
		datas.put("help",MarkdownTool.toHTML(getFieldValue("aiPrvHelp")));
		String html = HTMLTool.getResourceHTMLContent(this,"AISettingsKeyAndEPTemplate");
		return MustacheTool.apply(html, datas);
	}
	public String getParamPage(String[] models,List<String> requiredFields){
		JSONObject defaultFields = getDefaultFields();
		String htmlTemplate = HTMLTool.getResourceHTMLContent(this,"AISettingsParamTemplate");
				JSONObject specificParam = new JSONObject(getFieldValue("aiPrvDataModel"));
		JSONObject param = AITools.getCurrentParams(defaultFields);
		specificParam = AITools.getCurrentParams(specificParam);
		param.put("provider", getFieldValue("aiPrvProvider"));
		JSONObject datas = new JSONObject();
		datas.put("DefFields", addFields(new String[]{"provider", "model","bot_name","data_number"}, param, models, requiredFields,null));
		
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
				if(fieldsParam.optJSONObject(field,new JSONObject()).optBoolean("private")){
					fieldJSON.put("Type", "password");
				}else{
					fieldJSON.put("Type", "text");
				}
				
				break;
		}
		return fieldJSON;
	}
	
	private String optHelp(String key,JSONObject fieldsParam){
		if(Tool.isEmpty(fieldsParam)) fieldsParam = getDefaultFields();
		String help = fieldsParam.optJSONObject(key,new JSONObject()).optString("help");

		return MarkdownTool.toHTML(help).replaceAll("<a href=\"([^\"]*)\"", "<a target=\"_blank\" href=\"$1\"").replace("\n", "").replace("\"", "\\\"");
	}
	
	@Override
	public List<String> preValidate() {
		if(!"0".equals(getRowId()) || isBatchInstance()) return super.preValidate();
		String defaultUrl = getFieldValue("aiPrvDefaultUrl");
		for (Map.Entry<String, String> entry : DEFAULT_EDNPOINT.entrySet()) {
			String key = entry.getKey();
			if(Tool.isEmpty(getFieldValue(key))){
				setFieldValue(entry.getKey(), defaultUrl + entry.getValue());
			}
		}
		return super.preValidate();
	}
	public String reImportDataSet(){
		List<String> datasets = AITools.importDatasets(getModuleId(),true);
		if(Tool.isEmpty(datasets)) return Message.formatSimpleWarning("AI_NOTHING_IMPORT","");
		return Message.formatSimpleInfo("AI_CONFIRM_IMPORT",String.join(", ",datasets));
	}
	
	
}