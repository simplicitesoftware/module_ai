package com.simplicite.extobjects.ChatGPT;

import org.json.JSONObject;

import com.simplicite.util.*;
import com.simplicite.util.tools.*;

/**
 * External object GptShortcut
 */
public class GptShortcut extends ExternalObject { 
	private static final long serialVersionUID = 1L;

	/**
	 * Display method 
	 * @param params Request parameters
	 */
	@Override
	public Object display(Parameters params) {
		try {
			String id;
			getGrant().getLogin();
			ObjectDB obj = getGrant().getTmpObject("GptExemple");
			synchronized(obj){
				obj.getLock();
				BusinessObjectTool ot = obj.getTool();
				if(!ot.selectForCreateOrUpdate(new JSONObject().put("gptExName","shortcut_"+getGrant().getLogin()))){
					obj.setFieldValue("gptExName","shortcut_"+getGrant().getLogin());
					ot.validateAndCreate();
				}
				id=obj.getRowId();

			}
			return javascript(HTMLTool.redirectJS(HTMLTool.getFormURL("GptExemple",id,null)));
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
}