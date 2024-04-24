package com.simplicite.extobjects.AIBySimplicite;

import com.simplicite.util.*;
import com.simplicite.util.tools.*;

/**
 * External object AIProcessResource
 */
public class AIProcessResource extends ExternalObject { // or com.simplicite.webapp.web.ResponsiveExternalObject for a custom UI component
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
			// ctn is the "div.extern-content" to fill on UI
			return javascript(getName() + ".render(ctn);");
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
}