package com.simplicite.extobjects.AIBySimplicite;

import java.util.*;

import com.mysql.cj.x.protobuf.MysqlxDatatypes.Scalar.String;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.ActionException;
import com.simplicite.util.tools.*;
/**
 * External object AIExpTool
 */
public class AIExpTool extends ExternalObject { // or com.simplicite.webapp.web.ResponsiveExternalObject for a custom UI component
	                                                 // or com.simplicite.webapp.services.RESTServiceExternalObject for a custom API
	                                                 // etc.
	private static final long serialVersionUID = 1L;

		/**
	 * Display method (only relevant if extending the base ExternalObject)
	 * @param params Request parameters
	 */
	@Override
	public Object display(Parameters params) {
		ObjectDB cli = getGrant().getTmpObject("TnnClient");
		
		return javascript("let obj = $grant.getObject(null,'TnnClient');obj.displayList(null, obj, null, function(){$ui.doAction(obj.getAction('TnnOpenTv'),obj);});");
	
		//return javascript("alert(\"not front object\")");
	}
}

//JS

