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
		String pSetting = Grant.getSystemAdmin().getParameter("AI_API_PARAM");
		String pUrl = Grant.getSystemAdmin().getParameter("AI_API_URL");
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
		return "<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"json_return\" name=\"json_return\">"+response.toString(1)+"</textarea>";
		
	}
}