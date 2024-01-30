package com.simplicite.workflows.ChatGPT;

import java.util.*;




import com.simplicite.bpm.*;
import com.simplicite.commons.ChatGPT.GPTData;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.ObjectContextWeb;
/**
 * Process GPTGenData
 */
public class GPTGenData extends Processus {
	private static final long serialVersionUID = 1L;
	public String genData(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		String moduleId = getContext(getActivity("GGD_0100")).getDataValue("Field", "mdl_name");
		return GPTData.genDataForModule(moduleId,getGrant());
	}
}