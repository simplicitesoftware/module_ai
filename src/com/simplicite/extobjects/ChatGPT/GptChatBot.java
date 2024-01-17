package com.simplicite.extobjects.ChatGPT;

import java.util.*;
import com.simplicite.util.*;
import com.simplicite.util.tools.*;

/**
 * External object GptChatBot
 */
public class GptChatBot extends com.simplicite.util.ExternalObject {
	private static final long serialVersionUID = 1L;

	/**
	 * Display method
	 * @param params Request parameters
	 */
	@Override
	public Object display(Parameters params) {
		try {
			addMustache();
			String objName = params.getParameter("object");
			String objId =params.getParameter("row_id");
			ObjectDB obj = getGrant().getTmpObject("ObjectInternal");
			ObjectDB contextObj = getGrant().getTmpObject(objName);
			String context="";
			if(!Tool.isEmpty(objId)){
				synchronized(obj.getLock()){
					synchronized(contextObj.getLock()){
						StringBuilder contextBuilder = new StringBuilder(context);
						contextObj.select(objId);

						obj.resetFilters();
						obj.setFieldFilter("obo_name", objName);
						List<String[]> res = obj.search();
						if (!Tool.isEmpty(res)) {
							String fieldList = res.get(getHTTPStatus())[obj.getFieldIndex("gptFieldsParam")];
							if (!Tool.isEmpty(fieldList)) {
								String[] fields = fieldList.split("[;\n]");
								contextBuilder.append("\n");
								for (String fld : fields) {
									ObjectField fieldObj = contextObj.getField(fld);
									if(!Tool.isEmpty(fieldObj)){
										contextBuilder.append(fieldObj.getDisplay()).append(": ").append(fieldObj.getValue()).append("\n");
								
									}else{
										AppLog.info(fld, getGrant());
									}
								}
							}
						}
						context = contextBuilder.toString();
					}
				}
			}
			
			AppLog.info("Debug objId: "+objId, getGrant());
			return javascript(getName() + ".render(ctn,\""+HTMLTool.toSafeTextHTML(context)+"\");");
		}
		catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
}