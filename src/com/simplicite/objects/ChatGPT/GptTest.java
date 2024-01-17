package com.simplicite.objects.ChatGPT;

import com.simplicite.bpm.ActivityFile;
import com.simplicite.bpm.Processus;
import com.simplicite.util.*;
import com.simplicite.util.tools.*;

/**
 * Business object GptTest
 */
public class GptTest extends ObjectDB {
	private static final long serialVersionUID = 1L;
	
	public void clearHist(){

		setFieldValue("gptNotepad", "");
		save();
	}

	public String test(){
		String objName = getName();
		Grant g = getGrant();
		String id = getRowId();
		String pcs = "GptActionPrompt";
		Processus p = g.getProcessus(pcs, null);
		p.instantiate(); // generate a new PID
		Message m = p.activate(); // start activities
		if (m.isOk()){
			// Select presta automation
			try {
				ActivityFile act = (ActivityFile) m.get("Activity");
				m = p.lock(act.getActivity(), act.getAID());
				act.getDataFile("Data", "ObjectName",false).setValue(0,objName);
				act.getDataFile("Data", "ObjectRowId",false).setValue(0,id);
				m = p.validate(act,null);
			} catch (Exception e) {
				AppLog.error(e, g);
			}
		
			ActivityFile next = (ActivityFile)m.get("Activity");
			p.lock(next.getActivity(), next.getAID());
			
		}
		return sendRedirect(HTMLTool.getProcessStartURL(pcs));
	}
	
}