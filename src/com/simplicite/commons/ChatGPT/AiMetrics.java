package com.simplicite.commons.ChatGPT;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;

import com.simplicite.util.*;


/**
 * Shared code AiMetrics
 */
public class AiMetrics implements java.io.Serializable {
	static final String EXEMPLE="```javascript\n"+
	"function(){//code exemple to do search on the object myObject witch has a field myField\n"+
	"	const app = $ui.getApp();\n"+
	"	const obj = app.getBusinessObject(\"MyObject\");\n"+
	"	obj.search(function(items){\n"+
	"		for(var i=0;i<items.length;i++){\n"+
	"			//do something with items[i] \n"+
	"			//you can access to myfield in link object by items[i].objectId__myField \n"+
	"		}\n"+
	"	}, {myField:\"myValue\"});\n"+
	"}\n"+
	"```";
	private static final long serialVersionUID = 1L;
	public static JSONObject getJavaScriptMetrics(String prompt, JSONObject swagger ){
		JSONObject res = GptTools.gptCaller(null, "\n ```OppenAPI "+swagger+"``` ",EXEMPLE+" give me Script js to display: "+prompt+" using chart.js, add to your answer a description of the charts in ```text ```for Business user. Do not create data use search",false,true);
		String result = res.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		/*String result = "To create a JavaScript function that displays a pie chart (in French, \"camembert\") of orders by status using the API example structure provided, you would need to adjust and integrate with a chart library to visualize the data, such as Chart.js or Google Charts. Below, I'll demonstrate how to structure the script to fetch data and then populate a pie chart using Chart.js. \n"+
		"First, make sure to include the Chart.js library in your HTML file:\n"+
		"Now, here's the JavaScript function:\n"+
		"```javascript\n"+
		"function displayCommandeByStatusChart() {\n"+
		"	const app = $ui.getApp();\n"+
		"	const obj = app.getBusinessObject(\"DemoOrder\");\n"+
		"\n"+
		"	obj.search(function(items) {\n"+
		"		// Count commandes by status\n"+
		"		const statusCount = {};\n"+
		"		items.forEach(function(item) {\n"+
		"			const status = item.demoOrdStatus;\n"+
		"			if (status in statusCount) {\n"+
		"				statusCount[status]++;\n"+
		"			} else {\n"+
		"				statusCount[status] = 1;\n"+
		"			}\n"+
		"		});\n"+
		"\n"+
		"		// Get chart canvas\n"+
		"		const canvas = document.createElement('canvas');\n"+
		"		document.body.appendChild(canvas);\n"+
		"\n"+
		"		// Create chart\n"+
		"		const ctx = canvas.getContext('2d');\n"+
		"		new Chart(ctx, {\n"+
		"			type: 'bar',\n"+
		"			data: {\n"+
		"				labels: Object.keys(statusCount),\n"+
		"				datasets: [{\n"+
		"					label: 'Commandes by Status',\n"+
		"					data: Object.values(statusCount),\n"+
		"					backgroundColor: [\n"+
		"						'rgba(255, 99, 132, 0.2)',\n"+
		"						'rgba(54, 162, 235, 0.2)',\n"+
		"						'rgba(255, 206, 86, 0.2)',\n"+
		"						'rgba(75, 192, 192, 0.2)',\n"+
		"					],\n"+
		"					borderColor: [\n"+
		"						'rgba(255, 99, 132, 1)',\n"+
		"						'rgba(54, 162, 235, 1)',\n"+
		"						'rgba(255, 206, 86, 1)',\n"+
		"						'rgba(75, 192, 192, 1)',\n"+
		"					],\n"+
		"					borderWidth: 1\n"+
		"				}]\n"+
		"			},\n"+
		"			options: {\n"+
		"				scales: {\n"+
		"					y: {\n"+
		"						beginAtZero: true\n"+
		"					}\n"+
		"				}\n"+
		"			}\n"+
		"		});\n"+
		"	}, {});\n"+
		"}\n"+
		""+
		"```\n"+
		"Make sure that the app and obj are correctly initialized as per your environment setup. This script assumes that you're fetching objects named \"TrnOrder\" and contains a state field possibly named `trnOrdState`.\n"+
		"This script counts the statuses of orders, groups them, and uses Chart.js to render a pie chart. It uses basic color coding—adjust colors to fit the visual guidelines of your application.";
		*/return splitRes(result);
	}
	private static JSONObject splitRes(String text){
		String regexJS = "\\`\\`\\`javascript(?:\\n)?([\\s\\S]*?)\\`\\`\\`";
		String regexHTML = "\\`\\`\\`html(?:\\n)([\\s\\S]*?)\\`\\`\\`";
		String regexDesc ="\\`\\`\\`text(?:\\n)([\\s\\S]*?)\\`\\`\\`";
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
		regexJSResult = regexJSResult.replaceAll("^ui","\\$ui"); // Escape the dollar sign character
		regexJSResult = regexJSResult.replaceAll("([^$])ui","$1\\$ui"); // Escape the dollar sign character
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
		result.put("js", cleanJs(regexJSResult));
		result.put("html", regexHTMLResult);
		result.put("text", textResult);
		result.put("function", getFunctionCall(regexJSResult));
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
			return /*"<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>*/"<canvas id=\""+matcher.group(1)+"\" width=\"400\" height=\"400\"></canvas>";
		}
		return /*"<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>*/"<canvas id=\"myChart\" width=\"400\" height=\"400\"></canvas>";
	}
	private static String updateSize(String regexHTMLResult) {
		String regex = "(<canvas .* width=\")[0-9]*(\"\\s+height=\")[0-9]*(\")";
		
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
	private static String cleanJs(String js){
		String regex = "(\\w*) ?=.*\\.createElement\\('canvas'\\)";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(js);
		
		if (matcher.find()) {
			String varName = matcher.group(1);
			String regexAppend = "\\S*\\.appendChild\\("+varName+"\\);";
			js = js.replaceAll(regexAppend,"");
		}
		return js.replace(".createElement('canvas')",".getElementById('myChart')");
	}
}