package com.simplicite.dispositions.AIBySimplicite;

import java.util.*;

import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.engine.PermaLinks;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.HTMLPage;
import com.simplicite.webapp.ResponsivePage;
/**
 * Disposition AiEnhancedSimplicite
 */
public class AiEnhancedSimplicite extends com.simplicite.dispositions.UI.Bootstrap {
	private static final long serialVersionUID = 1L;

	/**
	 * Display method
	 * @param params Request parameters
	 */
	@Override
	public String display(Parameters params) {
		Grant g = getGrant();
		try
		{
			String dl = params.getParameter("deeplink");

			// permalink to deeplink
			if (dl==null)
			{
				String pl = params.getParameter("permalink");
				if (pl!=null) try
				{
					dl = PermaLinks.deeplink(g, pl);
				}
				catch (GetException | GrantException e)
				{
					// Ignore the permalink
				}
			}

			ResponsivePage wp = new ResponsivePage(params.getRoot(), g.getWindowTitle(), g, dl);
			
			wp.appendJSInclude(HTMLPage.getResourceJSURL(g, "SCRIPT_AI"));
			return wp.toString();
		}
		catch (Exception e) // Catch any exception
		{
			AppLog.error(getClass(), "display", "Unexpected error while displaying dispositon " + getName(), e, g);
			return e.getMessage();
		}
	}
}