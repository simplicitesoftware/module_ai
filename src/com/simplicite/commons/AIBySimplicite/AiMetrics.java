package com.simplicite.commons.AIBySimplicite;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;

import com.simplicite.util.*;
import com.simplicite.util.tools.BusinessObjectTool;


import com.simplicite.util.exceptions.*;

import org.json.JSONArray;




/**
 * Shared code AiMetrics
 */
public class AiMetrics implements java.io.Serializable {
	private static final String FR = " in french";
	private static final String MD_BALISE = "\n```";
	
	private static final JSONObject FUNCTIONS = new JSONObject("{" + //
				"  \"text\": \"T\"," + //
				"  \"sum\": \"S\"," + //
				"  \"product\": \"P\"," + //
				"  \"algebraic average\": \"A\"," + //
				"  \"geometric average\": \"G\"," + //
				"  \"min\": \"L\"," + //
				"  \"max\": \"H\"," + //
				"  \"formula\": \"F\"" + //
				"}");

	static final String EXEMPLE=" ```javascript\n"+ 
	"function(){//code exemple to do search on the object myObject witch has a field myField\n"+
		"const app = $ui.getApp();\n"+
		"const obj = app.getBusinessObject(\"MyObject\");\n"+
		"obj.resetFilters();\n"+//reset filters
		"obj.search(function(items){\n"+
			"for(let i=0;i<items.length;i++){\n"+
				"//do something with items[i] \n"+
				"//you can access to myfield by items[i].myField \n"+
			"}\n"+
		"});\n"+
		"//be careful with var names with spaces in json use 'var'.\n"+
	"}\n"+
	"```\n";
	private static final String FUNCTION_KEY = "function";
	private static final String MODULE_ID = "mldId";
	private static final long serialVersionUID = 1L;
	public static JSONObject getJavaScriptMetrics(String prompt, JSONObject swagger , String lang){
		JSONArray arrayPrompts = new JSONArray();
		prompt = AITools.normalize(AITools.removeAcent(prompt),false);
		prompt =  "give me Script js to display: "+prompt+("FRA".equals(lang)?FR:"")+" using chart.js, add to your answer a description of the charts in ```text ```for Business user"+("FRA".equals(lang)?FR:"")+". Do not create data use search";

		arrayPrompts.put(AITools.getformatedContentByType(EXEMPLE, AITools.TYPE_TEXT, true));
		arrayPrompts.put(AITools.getformatedContentByType(prompt, AITools.TYPE_TEXT,true));
		JSONObject res = AITools.aiCaller(null, "\n ```OpenAPI "+swagger+"```",arrayPrompts,false,true,true);
		if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info("AI response: "+res.toString(), null);
		JSONObject resultJS = splitRes(AITools.parseJsonResponse(res),swagger.optJSONObject("components").getJSONObject("schemas"));
		
		if (resultJS.has(AITools.ERROR_KEY)) {
			res = AITools.aiCaller(null, "You help formulate a prompt for an graph-generating AI. You're called if the ia doesn't understand. ",prompt,false,true);
			return new JSONObject().put("text",AITools.parseJsonResponse(res));
		}
		return resultJS;
	}
	private static JSONObject splitRes(String text, JSONObject schemas){
		String regexJS = "\\`\\`\\`javascript\\n([\\s\\S]*?)\\`\\`\\`";
		String regexHTML = "\\`\\`\\`html\\n([\\s\\S]*?)\\`\\`\\`";
		String regexDesc ="\\`\\`\\`text\\n([\\s\\S]*?)\\`\\`\\`";
		String regexJSResult = "";
		String regexHTMLResult = "";
		String textResult = "";
		// Extract JavaScript code
		Pattern patternJS = Pattern.compile(regexJS);
		Matcher matcherJS = patternJS.matcher(text);
		if (matcherJS.find()) {
			regexJSResult = matcherJS.group(1);
		}

		textResult = text.replace(regexJSResult, ""); 
		textResult = textResult.replaceAll("\\`\\`\\`javascript(?:\\n)?\\`\\`\\`",""); // Escape the dollar sign character
		regexJSResult = regexJSResult.replaceAll("^ui([;\\.])","\\$ui$1"); // Escape the dollar sign character
		regexJSResult = regexJSResult.replaceAll("([^$])ui([;\\.])","$1\\$ui$2"); // Escape the dollar sign character
		// Extract HTML code
		Pattern patternHTML = Pattern.compile(regexHTML);
		Matcher matcherHTML = patternHTML.matcher(text);
		if (matcherHTML.find()) {
			regexHTMLResult = matcherHTML.group(1);
		}

		textResult = textResult.replace(regexHTMLResult, "");
		textResult = textResult.replaceAll("\\`\\`\\`html(?:\\n)?\\`\\`\\`","");
		regexHTMLResult = regexHTMLResult.replaceAll("([^$])ui","$1\\$ui");
		// Extract description
		Pattern patternDesc = Pattern.compile(regexDesc);
		Matcher matcherDesc = patternDesc.matcher(textResult);
		if (matcherDesc.find()) {
			textResult = matcherDesc.group(1);
		}
		if(!regexHTMLResult.contains("<canvas")){
			regexHTMLResult += getCanvasHTML(regexJSResult);
		}else{
			regexHTMLResult = updateSize(regexHTMLResult);
			regexHTMLResult = cleanHtml(regexHTMLResult);
		}
		
		JSONObject result = new JSONObject();
		regexJSResult = cleanJs(regexJSResult);
		if (hasErrorOrDefaultCodeOrData(regexJSResult, regexHTMLResult, schemas)) {
			result.put(AITools.ERROR_KEY, "No code or bad data call found in the response.");
		}
		result.put("js", regexJSResult);
		result.put("html", regexHTMLResult);
		result.put("text", textResult);
		result.put(FUNCTION_KEY, getFunctionCall(regexJSResult));


		return result;
	}
	private static String getFunctionCall(String regexJSResult) {
		String functionName = "";
		Pattern pattern = Pattern.compile("function\\s+([a-zA-Z_$][a-zA-Z\\d_$]*)");
		Matcher matcher = pattern.matcher(regexJSResult);
		if (matcher.find()) {
			functionName = matcher.group(1);
		}
		return Tool.isEmpty(functionName)?"":functionName+"();";
	}
	public static JSONObject getReformulatePrompt(String prompt){
		JSONObject res = AITools.aiCaller(null, "You help formulate a prompt for an graph-generating AI. Responce in language of prompt. With an introductory sentence ",prompt,true,false);
		return new JSONObject().put("text",AITools.parseJsonResponse(res));
	}
	private static String getCanvasHTML(String js) {
		String regex = "getElementById\\(['\"]([a-zA-Z_$][a-zA-Z\\d_-]*)['\"]\\)\\.getContext\\(['\"].*['\"]\\)";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(js);
		if (matcher.find()) {
			return "<canvas id=\""+matcher.group(1)+"\" width=\"400\" height=\"400\"></canvas>";
		}
		return "<canvas id=\"myChart\" width=\"400\" height=\"400\"></canvas>";
	}
	private static String updateSize(String regexHTMLResult) {
		String regex = "(<canvas .* width=\")\\d*(\"\\s+height=\")\\d*(\")";
		
		return regexHTMLResult.replaceAll(regex,"$1400$2400$3");
	}
	private static String cleanHtml(String regexHTMLResult) {
		String regex = "^[\\s\\S]*<body>([\\s\\S]*)<\\/body>";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(regexHTMLResult);
		if (matcher.find()) {
			return matcher.group(1);
		}
		regexHTMLResult = regexHTMLResult.replace("<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>","");
		return regexHTMLResult;
	}
	public static String cleanJs(String js){
		String regex = "(\\.[\\w\\_-]*)((?:\\.[\\w\\_-]*)+)([;)])";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(js);
		while (matcher.find()) {
			String replacement = matcher.group(1)+matcher.group(2).replace(".","__")+matcher.group(3);
			js = js.replace(matcher.group(0),replacement);
		}
		// check if listener on Dom loaded
		regex = "document\\.addEventListener\\('DOMContentLoaded',\\s*function\\(\\)\\s*\\{((?:\\s*\\S*\\s*)*)\\}\\);";
		js = js.replaceAll(regex, "$1");
		
		regex = "(\\w*) ?=.*\\.createElement\\('canvas'\\)";
		pattern = Pattern.compile(regex);
		matcher = pattern.matcher(js);
		
		if (matcher.find()) {
			String varName = matcher.group(1);
			String regexAppend = "\\S*\\.appendChild\\("+varName+"\\);";
			js = js.replaceAll(regexAppend,"");
		}
		
		js = js.replace(".createElement('canvas')",".getElementById('myChart')");
		regex = "function\\(\\) ?\\{[\\w\\W]*\\}";
		pattern = Pattern.compile(regex);
		matcher = pattern.matcher(js);
		if (matcher.find()) {
			js = "("+matcher.group(0)+")();";
		}
		return js;
	}
	private static boolean hasErrorOrDefaultCodeOrData(String js, String html, JSONObject schemas){
		if(Tool.isEmpty(js)){
			String regex = "<script>([\\s\\S]*?)<\\/script>";
			Pattern pattern = Pattern.compile(regex);
			Matcher matcher = pattern.matcher(html);
			if (matcher.find()) {
				js = matcher.group(1);
			}else{
				//No script in response
				AppLog.info("AI null response: No script in response", null);
				return true;
			}
		}
		String regex = ".getBusinessObject\\(['\"]([\\w-]*)['\"]\\)";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(js);
		if (matcher.find()) {
			String objectName = matcher.group(1);
			if(schemas.has(objectName)){
				return false;
			}else{
				//Invalide object name
				AppLog.info("AI null response: Invalide object name", null);
				return true;
			}

		}
		//Data are invented
		AppLog.info("AI null response: Data are invented", null);
		return true;
	}
	// SAVE AS CROSS TABLE
	public static JSONObject iaConvert(String swagger, String js){
		Grant g = Grant.getSystemAdmin();
		byte[] prompt =g.getExternalObject("AIProcessResource").getResourceContent(Resource.TYPE_OTHER,"CROSSTABLE_PROMPT");
		String stringPrompt = prompt!=null?new String(prompt):"";
		JSONArray promptArray = new JSONArray();
		promptArray.put(AITools.getformatedContentByType(stringPrompt, AITools.TYPE_TEXT, true));
		StringBuilder spec = new StringBuilder();
		spec.append("Objects: ```openAPI\n");
		spec.append(swagger);
		spec.append(MD_BALISE);
		spec.append("\n\nchart.js script ```javascript\n");
		spec.append(js);
		spec.append(MD_BALISE);
		JSONObject res = AITools.aiCaller(g, spec.toString(), promptArray, false, true, true);
		String result = AITools.parseJsonResponse(res);
		JSONObject jsonRes = AITools.getValidJson(result);
		if(Tool.isEmpty(jsonRes)){	
			List<String> listResult = AITools.getJSONBlock(result,g);
			if(Tool.isEmpty(listResult) ){
				AppLog.error(new PlatformException("Sorry AI do not return interpretable json: \n"+result),g);
			}else{
				jsonRes =AITools.getValidJson(listResult.get(1));
				if(Tool.isEmpty(jsonRes)){
					AppLog.error(new PlatformException("Sorry AI do not return interpretable json: \n"+listResult.get(1)),g);
				}
			}
		}
		return jsonRes;
	}
	public  static JSONObject	createCrossTable(JSONObject def){
		String objName = def.optString("object");
		String ctName = def.optString("name");
		String mldId = def.optString(MODULE_ID);
		Grant g = Grant.getSystemAdmin();

		String ctId = createCt(def,ctName,objName,g);
		grantCt(ctId,mldId,g);
		String en = def.optString("en");
		String fr = def.optString("fr");
		try {
			updateTradField(Grant.getTranslateId("TranslateCrosstab",ctId, Globals.LANG_ENGLISH),en, g);
			updateTradField(Grant.getTranslateId("TranslateCrosstab",ctId, Globals.LANG_FRENCH), fr, g);
		} catch (Exception e) {
			AppLog.error(e, g);
		}
		int i = 1;
		for(Object clm : def.optJSONArray("column")){
			JSONObject axis = (JSONObject) clm;
			createAxis(axis,"C",ctId,mldId,i,g);
			i++;
		}
		i = 1;
		for(Object row : def.optJSONArray("line")){
			JSONObject axis = (JSONObject) row;
			createAxis(axis,"L",ctId,mldId,i,g);
			i++;
		}
		return new JSONObject().put("ctName", ctName).put("objName", objName);
	}
	private static void grantCt(String ctId,String mldId,Grant g){
		JSONObject perm = new JSONObject();
		perm.put("prm_group_id", GroupDB.getGroupId("AI_BUSINESS"));
		perm.put("row_mdl_id", mldId);
		perm.put("prm_object", "Crosstab:"+ctId);
		AITools.createOrUpdateWithJson("Permission", perm, g);
	}
	private static String createCt(JSONObject def,String ctName,String objName,Grant g){
		JSONObject ct = new JSONObject();
		ct.put("ctb_name", ctName);
		ct.put("ctb_function", FUNCTIONS.optString(def.optString(FUNCTION_KEY,"sum"),"S"));
		ct.put("ctb_object_id", ObjectCore.getObjectId(objName));
		ct.put("row_module_id",def.optString(MODULE_ID));
		return AITools.createOrUpdateWithJson("Crosstab", ct, g);
	}
	private static String createAxis(JSONObject def,String type,String ctId,String mldId,int defaultOrder,Grant g){
		String field = def.optString("field");
		if(Tool.isEmpty(field) || "row_id".equals(field)){
			return null;
		}
		JSONObject axis = new JSONObject();
		axis.put("cax_crosstab_id", ctId);
		axis.put("cax_type", type);
		String function =FUNCTIONS.optString(def.optString(FUNCTION_KEY,"sum"),"");
		if(!Tool.isEmpty(function)){
			axis.put("cax_function", function);
		}
		axis.put("row_module_id", mldId);
		String objFldId = getObjectFieldId(def.optString("object"), field,g);
		axis.put("cax_objfield_id", objFldId);
		axis.put("cax_order", def.optInt("order",defaultOrder));
		return AITools.createOrUpdateWithJson("CrosstabAxis", axis, g);

	}
	private static void updateTradField(String tradId,String val,Grant g) throws GetException, UpdateException, ValidateException{
		ObjectDB oTra = g.getTmpObject("Translate");
		synchronized(oTra.getLock()){
			BusinessObjectTool oTraT = oTra.getTool();
			if(!Tool.isEmpty(val) && !Tool.isEmpty(tradId)){
				oTraT.selectForUpdate(tradId);
				oTra.setFieldValue("tsl_value", val);
				oTraT.validateAndUpdate();
			}
		}
		
	}
	private static String getObjectFieldId(String object,String field,Grant g){
		ObjectDB obj = g.getTmpObject("ObjectFieldSystem");
		synchronized (obj) {
			obj.resetFilters();
				
			obj.setFieldFilter("obf_object_id", ObjectCore.getObjectId(object));
			obj.setFieldFilter("obf_field_id", ObjectField.getFieldId(field));
			List<String[]> res = obj.search();
			if (!Tool.isEmpty(res)){
				return res.get(0)[obj.getRowIdFieldIndex()];
			}
		}
		return null;
	}
	public static String recallWithError(String prompt, String lang,JSONObject swagger, String script, String html, String error){
		JSONArray hist = new JSONArray();
		
		JSONArray arrayPrompts = new JSONArray();
		prompt = AITools.normalize(AITools.removeAcent(prompt),false);
		prompt =  "give me Script js to display: "+prompt+("FRA".equals(lang)?FR:"")+" using chart.js, add to your answer a description of the charts in ```text ```for Business user"+("FRA".equals(lang)?FR:"")+". Do not create data use search";
		arrayPrompts.put(AITools.getformatedContentByType(EXEMPLE, AITools.TYPE_TEXT, true));
		arrayPrompts.put(AITools.getformatedContentByType(prompt, AITools.TYPE_TEXT,true));
		if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info(arrayPrompts.toString(1), null);
		hist.put(new JSONObject().put("role","user").put(AITools.CONTENT_KEY,arrayPrompts));
		String response = "```javascript\n"+script+MD_BALISE+"\n```html\n"+html+MD_BALISE;
		response = AITools.normalize(response,true);
		response = response.replace("\\", "\\\\").replace("\n", "\\n");
		hist.put(new JSONObject().put("role","assistant").put(AITools.CONTENT_KEY,response));
		String spe = " ```OpenAPI "+swagger+"```";
		prompt = "this script is not valid, please correct it.I got this error: "+error+"\n correct only the script response in ```javascript```";
		if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS)){
			AppLog.info("spe: "+spe, null);
			AppLog.info("prompt: "+prompt, null);
			AppLog.info("hist: "+hist.toString(1), null);
		}
		JSONObject res = AITools.aiCaller(null, spe,prompt,hist,false);
		if(res.has(AITools.ERROR_KEY)) return res.toString();
		JSONObject resultJS = splitRes(AITools.parseJsonResponse(res),swagger.optJSONObject("components").getJSONObject("schemas"));
		if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info("res recall: "+resultJS.toString(1), null);
		
		return resultJS.toString();
	}
	
}