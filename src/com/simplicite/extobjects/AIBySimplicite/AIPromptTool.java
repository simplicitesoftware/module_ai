package com.simplicite.extobjects.AIBySimplicite;

import java.util.*;

import org.json.JSONObject;
import org.json.JSONArray;
import com.simplicite.util.*;
import com.simplicite.util.tools.*;



/**
 * External object AIPromptTool
 */
public class AIPromptTool extends ExternalObject { // or com.simplicite.webapp.web.ResponsiveExternalObject for a custom UI component
	                                                 // or com.simplicite.webapp.services.RESTServiceExternalObject for a custom API
	                                                 // etc.
	private static final long serialVersionUID = 1L;

	/**
	 * Display method (only relevant if extending the base ExternalObject)
	 * @param params Request parameters
	 */
	@Override
	public Object display(Parameters params) {
		try {
			addMustache();
			String id =params.getParameter("row_id");
			String obj = params.getParameter("object");
			List<ObjectField> fields = getGrant().getTmpObject(obj).getFields();
			JSONArray fieldJsonArray = new JSONArray();
			for(ObjectField fld : fields){
				if(fld.isVisibleOnForm() || fld.isVisibleOnList()){
					fieldJsonArray.put(new JSONObject()
											.put("value",fld.getName())
											.put("label",fld.getDisplay()));

				}
			}
			JSONObject data = new JSONObject().put("fields",fieldJsonArray)
												.put("objectName", obj)
												.put("objectID", id);
			return javascript(getName() + ".render(ctn,"+data.toString(0)+");");
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
}