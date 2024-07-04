package com.simplicite.workflows.AIBySimplicite;

import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AIData;
import com.simplicite.util.*;
import com.simplicite.webapp.ObjectContextWeb;

import org.json.JSONObject;
/**
 * Process AIGenData
 */
public class AIGenData extends Processus {
	private static final long serialVersionUID = 1L;
	public String genData(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		String pSetting = Grant.getSystemAdmin().hasParameter("AI_API_PARAM")?Grant.getSystemAdmin().getParameter("AI_API_PARAM"):"/";
		String pUrl = Grant.getSystemAdmin().hasParameter("AI_API_URL")?Grant.getSystemAdmin().getParameter("AI_API_URL"):"/";
			
		if("/".equals(pSetting) || "/".equals(pUrl)) return  g.T("AI_SETTING_NEED");
		String moduleId = getContext(getActivity("GGD_0100")).getDataValue("Field", "mdl_name");
		JSONObject json = new JSONObject( getContext(getActivity("GGD_0150")).getDataValue("Data", "json_return"));
		return AIData.createDataFromJSON(moduleId,json,getGrant());
		
	}

	public String callIA(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		String pSetting = Grant.getSystemAdmin().getParameter("AI_API_PARAM");
		String pUrl = Grant.getSystemAdmin().getParameter("AI_API_URL");
		if("/".equals(pSetting) || "/".equals(pUrl)) return  g.T("AI_SETTING_NEED");
		String moduleId = getContext(getActivity("GGD_0100")).getDataValue("Field", "mdl_name");
		JSONObject response = AIData.genDataForModule(moduleId,getGrant());
		if(response.has("error")) return response.getString("error");
		String divId = "ace_json_return";
		String aceEditor ="$ui.loadAceEditor(function(){\n" + //
						"\t\t\tvar aceEditor = window.ace.edit('"+divId+"');\n" + //
						"\t\t\taceEditor.setOptions({\n" + //
						"\t\t\t   enableBasicAutocompletion: true, // the editor completes the statement when you hit Ctrl + Space\n" + //
						"\t\t\t   enableLiveAutocompletion: true, // the editor completes the statement while you are typing\n" + //
						"\t\t\t   showPrintMargin: false, // hides the vertical limiting strip\n" + //
						"\t\t\t   maxLines: 25,\n" + //
						"\t\t\t   fontSize: \"100%\" // ensures that the editor fits in the environment\n" + //
						"\t\t\t});\n" + //
						"\t\t\t\n" + //
						"\t\t\t// defines the style of the editor\n" + //
						"\t\t\taceEditor.setTheme(\"ace/theme/eclipse\");\n" + //
						"\t\t\t// hides line numbers (widens the area occupied by error and warning messages)\n" + //
						"\t\t\taceEditor.renderer.setOption(\"showLineNumbers\", true); \n" + //
						"\t\t\t// ensures proper autocomplete, validation and highlighting of JavaScript code\n" + //
						"\t\t\taceEditor.getSession().setMode(\"ace/mode/json\");\n" + //
						"\t\t\taceEditor.getSession().setValue($(\"#json_return\").val(), 0);\r\n" + //
						"\t\t\taceEditor.getSession().on('change', function() {\r\n" + //
						"\t\t\t\tlet val=aceEditor.getSession().getValue();\r\n" + //
						"\t\t\t\tconsole.log(val);\r\n" + //
						"\t\t\t\t$(\"#json_return\").val(val);\r\n" + //
						"\t\t\t});\n" + //
						"\t\t\t\n" + //
						"\t\t});";
		return "<div id=\"ace_json_return\"></div><textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\" name=\"json_return\">"+response.toString(1)+"</textarea>"+"<script>"+aceEditor+"</script>";
		
	}
	
}