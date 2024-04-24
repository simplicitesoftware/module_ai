package com.simplicite.extobjects.AIBySimplicite;

import org.json.JSONObject;

import com.simplicite.util.*;
import com.simplicite.util.tools.*;

/**
 * External object AIShortcut
 */
public class AIShortcut extends ExternalObject { 
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
			ObjectDB obj = getGrant().getTmpObject("AIExemple");
			synchronized(obj){
				obj.getLock();
				BusinessObjectTool ot = obj.getTool();
				if(!ot.selectForCreateOrUpdate(new JSONObject().put("aiExName","shortcut_"+getGrant().getLogin()))){
					obj.setFieldValue("aiExName","shortcut_"+getGrant().getLogin());
					ot.validateAndCreate();
				}
				id=obj.getRowId();

			}
			return javascript(HTMLTool.redirectJS(HTMLTool.getFormURL("AIExemple",id,null)));
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
}