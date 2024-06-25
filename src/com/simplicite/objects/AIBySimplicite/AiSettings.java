package com.simplicite.objects.AIBySimplicite;

import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;


import org.json.JSONException;
import org.json.JSONObject;

/**
 * Business object AiSettings
 */
public class AiSettings extends ObjectDB {
	private static final long serialVersionUID = 1L;
	private static final String AI_API_KEY = "AI_API_KEY";
	private static final String AI_API_PARAM = "AI_API_PARAM";
	private static final String AI_API_URL = "AI_API_URL";
	private static final String MODELE_FIELD = "aiSetModele";
	private static final String SYS_CODE = "sys_code";
	private static final String SYS_VAL2 = "sys_value2";
	
	@Override
	public String preCreate() {

		setFieldValue("aiSetConfig", getGrant().T("AI_CONFIG_"+getFieldValue(MODELE_FIELD)));
		return null;
	}
	public void active(Action action){
		String key = action.getConfirmField("aiApiKey").getValue();
		String setting = getFieldValue("aiSetConfig");
		String url = getFieldValue("aiSetUrl");
		ObjectDB paramObj = getGrant().getTmpObject("SystemParam");
		BusinessObjectTool paramTool = paramObj.getTool();
		synchronized(paramObj.getLock()){
			try {
				paramTool.selectForUpsert(new JSONObject().put(SYS_CODE, AI_API_KEY));
				paramObj.setFieldValue(SYS_VAL2, key);
				paramTool.validateAndSave();
				paramTool.selectForUpsert(new JSONObject().put(SYS_CODE, AI_API_PARAM));
				paramObj.setFieldValue(SYS_VAL2, setting);
				paramTool.validateAndSave();
				paramTool.selectForUpsert(new JSONObject().put(SYS_CODE, AI_API_URL));
				paramObj.setFieldValue(SYS_VAL2, url);
				paramTool.validateAndSave();
			} catch (GetException | JSONException | ValidateException | SaveException e) {
				AppLog.error( e, getGrant());

			}
		}
	}
	@Override
	public boolean isActionEnable(String[] arg0, String arg1) {
		if("AI_ACTIVE_SETTINGS".equals(arg1)){
			return "0".equals(arg0[getFieldIndex("aiSetActive")]);
		}
		return super.isActionEnable(arg0, arg1);
	}

}