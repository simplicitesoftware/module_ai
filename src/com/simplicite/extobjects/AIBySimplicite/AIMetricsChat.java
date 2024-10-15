package com.simplicite.extobjects.AIBySimplicite;

import com.simplicite.commons.AIBySimplicite.AITools;
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
		Grant g = getGrant();
		try {
			appendCSSInclude(HTMLTool.getResourceCSSURL(g, "AI_STYLE"));
			String moduleName = params.getParameter("module");
			if(Tool.isEmpty(moduleName) || Tool.isEmpty(ModuleDB.getModuleId(moduleName))){
				return javascript("$ui.alert("+Message.formatError("AI_MODULE_ERROR", null,null)+")");
			}
			JSONObject swagger = AITools.getSimplifyedSwagger(moduleName, g);
			String swaggerString = new JSONObject().put("components",new JSONObject().put("schemas",swagger.optJSONObject("components").optJSONObject("schemas"))).toString();
			swaggerString = swaggerString.replace("\\", "\\\\").replace("\"", "\\\"");
			return javascript(getName() + ".render(ctn,'"+ModuleDB.getModuleId(moduleName)+"','"+moduleName+"','"+swaggerString+"');");
		} catch (PlatformException e) {
			AppLog.error(e, g);
		}
		return javascript(getName() + ".render(ctn);");
		
	}
}