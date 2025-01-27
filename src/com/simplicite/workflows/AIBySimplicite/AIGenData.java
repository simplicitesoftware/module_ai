package com.simplicite.workflows.AIBySimplicite;
import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AIData;
import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;
import com.simplicite.util.tools.HTMLTool;
import com.simplicite.webapp.ObjectContextWeb;


import org.json.JSONObject;
/**
 * Process AIGenData
 */
public class AIGenData extends Processus {
	private static final String AI_SETTING_NEED = "AI_SETTING_NEED";
	private static final String ACTIVITY_SELECT_MODULE = "GGD_0100";
	private static final String ACTIVITY_CONFIRM = "GGD_0150";
	private static final String ACTIVITY_GEN_DATA = "GGD_0200";
	private static final String ACTIVITY_IS_PARAM = "GGD_0050";
	private static final String DATA_JSON = "json_return" ;
	private static final String DATA_FIELD = "Field";
	private static final String MODULE_NAME_FIELD = "mdl_name";
	private static final String ERROR = "error";
	private static final long serialVersionUID = 1L;
	@Override
	public Message preValidate(ActivityFile context) {
		String step = context.getActivity().getStep();
		switch (step) {
			case ACTIVITY_IS_PARAM:
				context.setDataFile("Return","Code", AITools.isAIParam()?"1":"0");
				if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info(context.getDataValue("Return","Code"), getGrant());
				break;
			case ACTIVITY_CONFIRM:
				Message check = AITools.checkJson(context.getDataValue("Data", DATA_JSON));
				if(!Tool.isEmpty(check)) return check;
				break;
			default:
				break;
		}

		return super.preValidate(context);
	}
	@Override
	public void postValidate(ActivityFile context) {
		String step = context.getActivity().getStep();
		String moduleName;
		switch (step) {
			case ACTIVITY_SELECT_MODULE:
				moduleName = context.getDataValue(DATA_FIELD, MODULE_NAME_FIELD);
				aiGenerateData(moduleName);
				break;
			case ACTIVITY_CONFIRM:
				moduleName = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(DATA_FIELD, MODULE_NAME_FIELD);
				JSONObject json = new JSONObject( context.getDataValue("Data", DATA_JSON));
				getContext(getActivity(ACTIVITY_GEN_DATA)).setDataFile("Data","generate", AIData.createDataFromJSON(moduleName,json,getGrant()));
				break;
			default:
			
				break;
		}
		super.postValidate(context);
	}
	public String noParam(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		String js = HTMLTool.JS_START_TAG+"$('.btn-validate').hide();$('.btn-AIStartParam').css('border-radius', '.25rem');"+HTMLTool.JS_END_TAG;
		return js+getGrant().T(AI_SETTING_NEED);
	}
	public String genData(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		if(!AITools.isAIParam(true)) return  g.T(AI_SETTING_NEED);
		String js ="function refactorButtons(){\r\n" + //
						"\tconsole.log(\"test refactorButtons\");\r\n" + //
						"\tlet deletebutton = $(\".btn[data-action='AI_GENDATA_RETRY']\");\r\n" + //
						"\tlet nextbutton = $(\".btn[data-action='validate']\");\r\n" + //
						"\tdeletebutton.removeClass(\"btn-action\");\r\n" + //
						"\tdeletebutton.addClass(\"btn-secondary\");\r\n" + //
						"\tlet parentDiv = $(\".btn[data-action='AI_GENDATA_RETRY']\").parent();\r\n" + //
						"\tparentDiv.css(\"flex-direction\", \"row-reverse\");\r\n" + //
						"\tdeletebutton.css(\"border-top-right-radius\", \"0px\");\r\n" + //
						"\tdeletebutton.css(\"border-bottom-right-radius\", \"0px\");\r\n" + //
						"\tnextbutton.css(\"border-top-right-radius\", \".25rem\");\r\n" + //
						"\tnextbutton.css(\"border-bottom-right-radius\", \".25rem\");\r\n" + //
						"}\r\n" + //
						"refactorButtons();";
	
		return context.getDataValue("Data", "generate")+HTMLTool.jsBlock(js);
		
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
		String dataJson = context.getDataValue("Data", DATA_JSON);
		String error = context.getDataValue("Data", ERROR);
		if(!Tool.isEmpty(error)){
			return "<div class=\"alert alert-danger\" role=\"alert\">"+error+"</div>";
		}
		if(!Tool.isEmpty(dataJson)){
			return "<div id=\"ace_json_return\"></div><textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\" name=\"json_return\">"+dataJson+"</textarea>"+HTMLTool.jsBlock(aceEditor);
		}
		return "<div id=\"ace_json_return\"></div><textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\" name=\"json_return\"></textarea>"+HTMLTool.jsBlock(aceEditor);
		
	}
	public String testFucntion(){
		return "test1";
	}
	private void aiGenerateData(String moduleName){
		if(Tool.isEmpty(moduleName)) return;
		JSONObject response = AIData.genDataForModule(moduleName,getGrant());
		if(response.has(ERROR)){
			getContext(getActivity(ACTIVITY_CONFIRM)).setDataFile("Data", ERROR, response.getString(ERROR));
		}else{
			getContext(getActivity(ACTIVITY_CONFIRM)).setDataFile("Data", DATA_JSON, response.toString(1));
		}
	}
	public void relaunchingGeneration(ActivityFile context){
		AppLog.info("Relaunching generation", getGrant());
		String moduleName = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(DATA_FIELD, MODULE_NAME_FIELD);
		aiGenerateData(moduleName);
	}
	
	
}