package com.simplicite.extobjects.AIBySimplicite;

import java.util.*;

import com.simplicite.util.*;
import com.simplicite.util.tools.*;

import org.json.JSONArray;
import org.json.JSONObject;
/**
 * External object AIChatBot
 */
public class AIChatBot extends com.simplicite.util.ExternalObject {
	private static final long serialVersionUID = 1L;

	/**
	 * Display method
	 * @param params Request parameters
	 */
	@Override
	public Object display(Parameters params) {
		try {
			addMustache();
			addMarkdown();
			setTitle(false);
			String object  = params.getParameter("object");
			String rowId = params.getParameter("row_id"); //undefine or null with object context = list

			String specialisation;
			if(!Tool.isEmpty(object) &&!Tool.isEmpty(rowId) && !"undefined".equals(rowId)){
				specialisation = getContextFromObject(object,rowId).replaceAll("\\\\\"","\\\\\\\\\"").replaceAll("\"","\\\\\"");
			}else{
				specialisation = params.getParameter("specialisation");
			}
			if(!Tool.isEmpty(specialisation)) return javascript(getName() + ".render(ctn,\""+specialisation+"\");");
			
			return javascript(getName() + ".render(ctn,\"\");");
		}
		catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
	
	private String getContextFromObject(String object,String rowId){
		if(Tool.isEmpty(object) || Tool.isEmpty(rowId) || "0".equals(rowId)) return "";
		ArrayList<String> done = new ArrayList<>();
		done.add(object+":"+rowId);
	    JSONObject res = getObjectValueJSON(object,rowId,done);
	        
		return "```json "+res.toString()+"```";
	}
	
	private JSONObject getObjectValueJSON(String name,String rowId,ArrayList<String> done){
		JSONObject objectJSON = new JSONObject();
		Grant g = getGrant();
		ObjectDB obj = g.getTmpObject(name);
		synchronized(obj.getLock()){
			if(ModuleDB.isSystemModule(obj.getModuleName()) && !"User".equals(name)){//avoid technical object exept User whitch is frequently used
				//AppLog.info("System module "+obj.getModuleName()+" is not allowed.", g);
				return objectJSON;
			}
			obj.select(rowId);
			objectJSON.put("objectName", obj.getDisplay());
			objectJSON.put("Description",obj.getDesc());
			JSONObject fields = new JSONObject();
			JSONArray links = new JSONArray();
			for (ObjectField field : obj.getFields()) {
				if(!field.isTechnicalField() && !field.isReferenced() && Tool.isEmpty(field.getClassifications())){
					if(field.isForeignKey()){
						String refName=field.getRefObjectName();
						String refRowId = field.getValue();
						if(!done.contains(refName+":"+refRowId)){
							done.add(refName+":"+refRowId);
							JSONObject ref = getObjectValueJSON(refName,refRowId,done);
							if(!Tool.isEmpty(ref)) links.put(ref);
						}
					}else if(field.isDocument()){
						fields.put(field.getDisplay(), "Document");
					}else if(field.isImage()){
						fields.put(field.getDisplay(), "Image");
					
					}else{	
						fields.put(field.getDisplay(), field.getValue());
					}
					
				}
				
			}
			objectJSON.put("fields", fields);
			objectJSON.put("linkedObjects", links);
		}
		return objectJSON;
	}
}