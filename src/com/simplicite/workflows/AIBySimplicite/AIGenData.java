package com.simplicite.workflows.AIBySimplicite;

import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AIData;
import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;
import com.simplicite.webapp.ObjectContextWeb;

import org.json.JSONObject;
/**
 * Process AIGenData
 */
public class AIGenData extends Processus {
	private static final String AI_SETTING_NEED = "AI_SETTING_NEED";
	private static final long serialVersionUID = 1L;
	@Override
	public Message preValidate(ActivityFile context) {


		if("GGD_0050".equals(context.getActivity().getStep())){
			context.setDataFile("Return","Code", AITools.isAIParam()?"1":"0");
			if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info(context.getDataValue("Return","Code"), getGrant());
		}

		return super.preValidate(context);
	}
	public String noParam(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		return getGrant().T(AI_SETTING_NEED);
	}
	public String genData(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		if(!AITools.isAIParam(true)) return  g.T(AI_SETTING_NEED);
		String moduleId = getContext(getActivity("GGD_0100")).getDataValue("Field", "mdl_name");
		JSONObject json = new JSONObject( getContext(getActivity("GGD_0150")).getDataValue("Data", "json_return"));
		return AIData.createDataFromJSON(moduleId,json,getGrant());
		
	}
	@Override
	public Message preAbandon() {
		Activity act = getActivity("GGD-END");
		if(!Tool.isEmpty(act)){
			getContext(act).setDataFile("Forward", "Page", "ui/AiMonitoring");
		}
		
		return super.preAbandon();
	}
	public String callIA(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		if(!AITools.isAIParam(true)) return  g.T(AI_SETTING_NEED);
		String divId = "ace_json_return";
		String aceEditor ="$ui.loadScript({url: $ui.getApp().dispositionResourceURL(\"AiJsTools\", \"JS\"),onload: function(){ AiJsTools.loadResultInAceEditor($('#json_return'),'"+divId+"');}});";
		String moduleId = getContext(getActivity("GGD_0100")).getDataValue("Field", "mdl_name");
		if(Tool.isEmpty(moduleId)) return "<div id=\"ace_json_return\"></div><textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\" name=\"json_return\"></textarea>"+"<script>"+aceEditor+"</script>";
		JSONObject response = AIData.genDataForModule(moduleId,getGrant());
		if(response.has("error")) return response.getString("error");
		
		return "<div id=\"ace_json_return\"></div><textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\" name=\"json_return\">"+response.toString(1)+"</textarea>"+"<script>"+aceEditor+"</script>";
		
	}
	public String testFucntion(){
		return "test1";
	}
	
}