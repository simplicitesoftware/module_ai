package com.simplicite.commons.AIBySimplicite;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;

import com.simplicite.util.*;

import ch.simschla.minify.cli.App;

import org.json.JSONArray;




/**
 * Shared code AiMetrics
 */
public class AiMetrics implements java.io.Serializable {

	static final String EXEMPLE=" ```javascript\n"+ 
	"function(){//code exemple to do search on the object myObject witch has a field myField\n"+
		"const app = $ui.getApp();\n"+
		"const obj = app.getBusinessObject(\"MyObject\");\n"+
		"obj.search(function(items){\n"+
			"for(let i=0;i<items.length;i++){\n"+
				"//do something with items[i] \n"+
				"//you can access to myfield by items[i].myField \n"+
			"}\n"+
		"});\n"+
		"//be careful with var names with spaces in json use 'var'.\n"+
	"}\n"+
	"```\n";
	private static final long serialVersionUID = 1L;
	public static JSONObject getJavaScriptMetrics(String prompt, JSONObject swagger , String lang){
		AppLog.info("AI request: "+swagger, null);
		JSONArray arrayPrompts = new JSONArray();
		prompt = AITools.normalize(AITools.removeAcent(prompt),false);
		prompt =  "give me Script js to display: "+prompt+("FRA".equals(lang)?" in french":"")+" using chart.js, add to your answer a description of the charts in ```text ```for Business user"+("FRA".equals(lang)?" in french":"")+". Do not create data use search";

		arrayPrompts.put(AITools.getformatedContentByType(EXEMPLE, AITools.TYPE_TEXT, true));
		arrayPrompts.put(AITools.getformatedContentByType(prompt, AITools.TYPE_TEXT,true));

		JSONObject res = AITools.aiCaller(null, "\n ```OppenAPI "+swagger+"```",arrayPrompts,false,true,true);
		String result = res.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		JSONObject resultJS = splitRes(result,swagger.optJSONObject("components").getJSONObject("schemas"));
		AppLog.info("AI response: "+resultJS.toString(1), null);
		if (resultJS.has("error")) {
			res = AITools.aiCaller(null, "You help formulate a prompt for an graph-generating AI. You're called if the ia doesn't understand. ",prompt,false,true);
			result = res.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
			return new JSONObject().put("text",result);
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
			result.put("error", "No code or bad data call found in the response.");
		}
		result.put("js", regexJSResult);
		result.put("html", regexHTMLResult);
		result.put("text", textResult);
		result.put("function", getFunctionCall(regexJSResult));
		AppLog.info("AI response: "+result.toString(1), null);
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
		
		return js.replace(".createElement('canvas')",".getElementById('myChart')");
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
}