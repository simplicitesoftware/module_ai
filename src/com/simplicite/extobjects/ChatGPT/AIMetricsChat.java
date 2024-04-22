package com.simplicite.extobjects.ChatGPT;

import com.simplicite.commons.ChatGPT.GptTools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;


import org.json.JSONObject;
/**
 * Basic external object AIMetricsChat
 */
public class AIMetricsChat extends com.simplicite.util.ExternalObject {
	private static final long serialVersionUID = 1L;

	// Note: instead of this basic external object, a specialized subclass should be used

	/**
	 * Display method
	 * @param params Request parameters
	 */
	@Override
	public Object display(Parameters params) {
		try {
			appendCSSInclude(HTMLTool.getResourceCSSURL(getGrant().getExternalObject("GptProcessResource"), "CHAT_BOT_CSS"));
			String moduleName = params.getParameter("module");
			AppLog.info("params: "+moduleName, getGrant());
			if(Tool.isEmpty(moduleName) || Tool.isEmpty(ModuleDB.getModuleId(moduleName))){
				return javascript("$ui.alert("+Message.formatError("AI_MODULE_ERROR", null,null)+")");
			}
			JSONObject swagger = GptTools.getSwagger(moduleName, getGrant());
			return javascript(getName() + ".render(ctn,"+swagger.toString()+");");
		} catch (PlatformException e) {
			AppLog.error(e, getGrant());
		}
		return javascript(getName() + ".render(ctn);");
		
	}
}