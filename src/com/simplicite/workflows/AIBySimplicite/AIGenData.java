package com.simplicite.workflows.AIBySimplicite;

import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AIData;
import com.simplicite.util.*;
import com.simplicite.webapp.ObjectContextWeb;
/**
 * Process AIGenData
 */
public class AIGenData extends Processus {
	private static final long serialVersionUID = 1L;
	public String genData(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() != ActivityFile.STATE_RUNNING)
			return null;
		String moduleId = getContext(getActivity("GGD_0100")).getDataValue("Field", "mdl_name");
		return AIData.genDataForModule(moduleId,getGrant());
	}
}