package com.simplicite.extobjects.ChatGPT;

import com.simplicite.commons.ChatGPT.AiMetrics;
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
		AppLog.info(AiMetrics.cleanJs("test.a.b.c;\ntest.a)\ntest.ABC.fdf.EE)"),getGrant());
		try {
			appendCSSInclude(HTMLTool.getResourceCSSURL(getGrant().getExternalObject("GptProcessResource"), "CHAT_BOT_CSS"));
			String moduleName = params.getParameter("module");
			if(Tool.isEmpty(moduleName) || Tool.isEmpty(ModuleDB.getModuleId(moduleName))){
				return javascript("$ui.alert("+Message.formatError("AI_MODULE_ERROR", null,null)+")");
			}
			JSONObject swagger = GptTools.getSimplifyedSwagger(moduleName, getGrant());
			return javascript(getName() + ".render(ctn,"+new JSONObject().put("components",new JSONObject().put("schemas",swagger.optJSONObject("components").optJSONObject("schemas"))).toString()+");");
		} catch (PlatformException e) {
			AppLog.error(e, getGrant());
		}
		return javascript(getName() + ".render(ctn);");
		
	}
}