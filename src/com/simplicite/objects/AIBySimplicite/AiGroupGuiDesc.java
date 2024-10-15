package com.simplicite.objects.AIBySimplicite;

import java.util.*;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.json.JSONArray;

import com.simplicite.util.*;
import com.simplicite.util.exceptions.ActionException;
import com.simplicite.util.exceptions.CreateException;
import com.simplicite.util.exceptions.GetException;
import com.simplicite.util.exceptions.SaveException;
import com.simplicite.util.exceptions.ValidateException;
import com.simplicite.util.tools.*;

/**
 * Business object AiGroupGuiDesc
 */
public class AiGroupGuiDesc extends ObjectDB {
	private static final long serialVersionUID = 1L;
	private  String zoneTemplate;
	private  String domTemplate;
	private static final String COMMENT_KEY = "comment";
	
	@Override
	public String preCreate() {
		Grant g = getGrant();
		String userLang = g.getLang();
		g.setLang(getFieldValue("aiGgdLang")); 
		ObjectDB obj = g.getTmpObject("Group");
		List<String> groups = new ArrayList<>();
		synchronized(obj.getLock()){
			obj.resetFilters();
			obj.setFieldFilter("grp_home_id", getFieldValue("aiGgdViewhomeId"));
			for(String[] row : obj.search()){
				groups.add(row[obj.getFieldIndex("grp_name")]);
			}
		}
		setFieldValue("aiGgdDescription", getModuleDesc(groups,g));
		g.setLang(userLang);
		return null;
	}
	public void upbdateDescriptions(){
		try{
			ObjectDB obj = getGrant().getTmpObject("AiGroupGuiDesc");
			synchronized(obj.getLock()){
				for(String id : getSelectedIds()){
					obj.select(id);
					obj.invokeAction("AI_UPDATE_DESC");
				}
			}	
		}catch(ActionException e){
			AppLog.error(e, getGrant());
		}
	}
	public void updateDescription(){
		Grant g= getGrant();
		String userLang = g.getLang();
		g.setLang(getFieldValue("aiGgdLang")); 
		ObjectDB obj = g.getTmpObject("AiGroupView");
		List<String> groups = new ArrayList<>();
		synchronized(obj.getLock()){
			obj.resetFilters();
			obj.setFieldFilter("aiGroupGuiDescId", getRowId());
			obj.setFieldFilter("aiAigroupviewUsed", true);
			for(String[] row : obj.search()){
				groups.add(row[obj.getFieldIndex("grp_name")]);
			}
		}
		setFieldValue("aiGgdDescription", getModuleDesc(groups,g));
		try {
			getTool().validateAndSave();
		} catch (ValidateException | SaveException e) {
			AppLog.error(e, getGrant());
		}
		g.setLang(userLang);
	}
	@Override
	public String postCreate() {
		String id = getFieldValue("row_id");
		Grant g = getGrant();
		ObjectDB obj = g.getTmpObject("Group");
		ObjectDB nn = g.getTmpObject("AiGroupView");
		synchronized(obj.getLock()){
			obj.resetFilters();
			obj.setFieldFilter("grp_home_id", getFieldValue("aiGgdViewhomeId"));
			synchronized(nn.getLock()){
				BusinessObjectTool nnTool = nn.getTool();
				for(String[] row : obj.search()){
					try {
						nnTool.selectForCreate();
						JSONObject fields = new JSONObject().put("aiGroupGuiDescId",id).put("aiGroupId",row[obj.getRowIdFieldIndex()]);
						nn.setValuesFromJSONObject(fields,false,false);
						nn.populate(true);
						nnTool.validateAndCreate();

					} catch (CreateException | ValidateException | GetException e) {
						AppLog.error(e, g);
					}
				}
			}
			
		}
		return super.postCreate();
	}
	private String getModuleDesc(List<String> groups,Grant g){
		String l = g.getLang();
		byte[] template = getResource("AI_FORM_ZONE_DESC_"+l).getDocumentContent(g);
		if(!Tool.isEmpty(template))zoneTemplate=new String(template);
		template = getResource("AI_DOMAIN_TEMPLATE_DESC_"+l).getDocumentContent(g);
		if(!Tool.isEmpty(template))domTemplate= new String(template);
		JSONObject desc = new JSONObject();
		JSONArray menus = new JSONArray();
		List<String> domains = getDomains(groups,g);
		for(String dom : domains){
			JSONObject domJSON = getDomainDescription(dom,g);
			if(!Tool.isEmpty(domJSON))menus.put(domJSON);
		}
		
		desc.put("domains",menus);
		JSONArray objsJSON = new JSONArray();
		List<String> objs = getObjects(groups, g);
		for(String objName : objs){
			ObjectDB obj = g.getTmpObject(objName);
			if(Tool.isEmpty(obj))continue;
			if(obj.getName().matches("\\w+Historic")){
				objsJSON.put(new JSONObject().put("name",obj.getName()).put("hist",obj.getName().replace("Historic","")));
			}else{
				synchronized(obj){
					JSONObject objDesc = describeObject(obj,g);
					objsJSON.put(objDesc);
				}
			}
			
		}
		desc.put("forms",objsJSON);
		return MustacheTool.apply(domTemplate, desc);
	}
	private List<String> getDomains(List<String> groups,Grant g){
		
		List<String> domains = new ArrayList<>();
		for (String group : groups) {
			GroupDB grp = g.getGroup(group);
			if(Tool.isEmpty(grp))continue;
			domains.addAll(grp.getDomains());
			
		}
		Set<String> uniqueDomains = new HashSet<>(domains);
		return new ArrayList<>(uniqueDomains);
	}
	private List<String> getObjects(List<String> groups,Grant g){
		List<String> objects = new ArrayList<>();
		for (String group : groups) {
			GroupDB grp = g.getGroup(group);
			if(Tool.isEmpty(grp))continue;
			objects.addAll(grp.getObjects().keySet());
		}
		Set<String> uniqueObjects = new HashSet<>(objects);
		return new ArrayList<>(uniqueObjects);
	}
	private JSONObject getDomainDescription(String dom,Grant g) {
		List<MenuItem> menuItems = g.getMenuItems(dom);
		if(Tool.isEmpty(menuItems))return new JSONObject();
		JSONArray items = new JSONArray();
		for(MenuItem mi : menuItems){
			JSONObject item = getItemDesc(mi,g);
			if(!Tool.isEmpty(item))items.put(item);
		}
		return new JSONObject().put("name",menuItems.get(0).getDomainDisplay(g.getLang())).put("items",items);
	}
	private JSONObject getItemDesc(MenuItem mi,Grant g){
		JSONObject item = new JSONObject();
		item.put("name",mi.getObjectDisplay(g.getLang()));
		item.put("isExtended", mi.isExtended());
		String objName = mi.getObjectName();
		if(mi.isDomain()){
			item.put("type","submenu");
		}else if(mi.isExtern()){
			item.put("type","custom page");
			ExternalObject extobj = g.getExternalObject(objName);
			item.put(COMMENT_KEY,formatDesc(extobj.getDesc()));
		}else if(mi.isObject()){
			item.put("type","form");
			ObjectDB obj = g.getTmpObject(objName);
			synchronized(obj){
				String desc = obj.getDesc();
				if(!Tool.isEmpty(desc))item.put(COMMENT_KEY,formatDesc(desc));
			}
			
		}else if(mi.isProcess() || mi.isWorkflow()){
			item.put("type","proccess");
			ObjectDB process = g.getProcessObject(objName);
			synchronized(process){
				String desc = process.getDesc();
				if(!Tool.isEmpty(desc))item.put(COMMENT_KEY,formatDesc(desc));
			}
		}else if(mi.isView()){
			item.put("type","view");
		}else{
			
			AppLog.info("Unknown type for "+mi.getObjectDisplay(g.getLang())+" "+mi.getType(),g);
			item.put("type","unknown");
		}
		return item;
	}
	private String formatDesc(String desc){
		if(Tool.isEmpty(desc))return "";
		desc = MarkdownTool.toHTML(desc);
		return desc.replace("\n", " ");
	}
	public JSONObject describeObject(ObjectDB obj,Grant g){
		JSONObject objDesc = new JSONObject();
		objDesc.put("name",obj.getDisplay());
		String html = obj.getUITemplate();
		if(Tool.isEmpty(html))html = "";
		Document doc = Jsoup.parse(html);
		Elements areas = doc.select("div.area");
		JSONArray zones = new JSONArray();
		List<String> rules = new ArrayList<>();
        for (Element area : areas) {
            // Extraire la valeur de l'attribut "data-area"
            String dataArea = area.attr("data-area");
			if(!Tool.isEmpty(dataArea)){
				zones.put(describeZone(dataArea,obj,0,rules,g));
			}
		}
		objDesc.put("zones",zones);
		List<String> linkedObjects = new ArrayList<>();
		for(Link l : obj.getLinks()){
			if(!l.isVisible())continue;
			linkedObjects.add(l.getObjectDisplay());	
		}
		objDesc.put("linkedObjects",String.join(", ",linkedObjects));
		List<String> constraints = describeConstraints(obj,g);
		if(!Tool.isEmpty(constraints))rules.addAll(constraints);
		if(!Tool.isEmpty(rules))objDesc.put("rules",String.join("  \n* ",rules));
		
		return objDesc;
	}
	private String describeZone(String dataArea, ObjectDB obj,int level,List<String> rules,Grant g){
		JSONObject zoneJSON = new JSONObject();
		String tab = "\t".repeat(level);
		if(dataArea.matches("\\d?:.")){
			dataArea = dataArea.split(":")[0];
		}
		String[] areaIDs = dataArea.split(",");
		if(areaIDs.length>1){
			zoneJSON.put("isPanel",true);
			JSONArray panels = new JSONArray();
			for(String areaID : areaIDs){
				panels.put(describeFldArea(obj, areaID, level,rules, g));
			}
			zoneJSON.put("panels",panels);
		}else{
			zoneJSON = describeFldArea(obj,areaIDs[0],level,rules,g);
			zoneJSON.put("isZone",true);
			
		}
		zoneJSON.put("tabulation", tab);
		return MustacheTool.apply(zoneTemplate, zoneJSON);
	}
	private JSONObject describeFldArea(ObjectDB obj,String id,int level,List<String> rules,Grant g){
		JSONObject areaJSON = new JSONObject();
		FieldArea fldArea = obj.getFieldArea(obj.getName()+"-"+id);
		if(Tool.isEmpty(fldArea))return areaJSON;
		areaJSON.put("title",fldArea.getDisplay());
		List<String> visible = new ArrayList<>();
		List<String> more = new ArrayList<>();
		JSONArray zones = new JSONArray();
		String ui = fldArea.getUITemplate();
		if(Tool.isEmpty(ui))
			return areaJSON;
		Document doc = Jsoup.parse(ui);
		Elements areas = doc.select("div.area");
		for (Element area : areas) {
			String dataAreaChild = area.attr("data-area");
			if(!Tool.isEmpty(dataAreaChild)){
				zones.put(describeZone(dataAreaChild,obj,level+1,rules,g));
			}
		}
		Elements fields = doc.select("div.field");
		for (Element field : fields) {
			String dataField = field.attr("data-field");
			if(Tool.isEmpty(dataField))continue;
			ObjectField fld = obj.getField(dataField, false);
			describeField(obj,fld,visible,more,rules,dataField);
			
		}
		optPut(areaJSON, "visible", visible);
		optPut(areaJSON, "more", more);
		optPut(areaJSON, "zones", zones);
		return areaJSON;
	}
	private void describeField(ObjectDB obj,ObjectField fld,List<String> visible,List<String> more,List<String> rules,String dataField){
		if(!Tool.isEmpty(fld) && !fld.isForeignKey() && fld.isVisibleOnForm()){
			String name = fld.getLabel();
			formatAndSortField(name,visible,more,fld);
			if(ObjectField.TYPE_REGEXP == fld.getType()){
				String regex = fld.getRegExp();
				if(!Tool.isEmpty(regex)){
					rules.add("patterns field "+fld.getLabel()+": "+regex);
				}
			}
		}else if(Tool.isEmpty(fld) && dataField.contains("__")){
			String[] refField = dataField.split("__");
			fld = obj.getField(refField[refField.length-1],false);
			if(!Tool.isEmpty(fld) && !fld.isForeignKey() && fld.isVisibleOnForm()){
				String name = fld.getRefObjectDisplay()+":"+fld.getLabel(); 
				formatAndSortField(name,visible,more,fld);
			}
		}
	}
	private void formatAndSortField(String name,List<String> visible,List<String> more,ObjectField fld){
		if(fld.isFunctId())name = "**"+name+"(key)**";
		else if(fld.isRequired()) name = "**"+name+"**";
		else name = "*"+name+"*";
		if(fld.isMore())more.add(name);
		else visible.add(name);
	}
	private void optPut(JSONObject obj,String key,List<String> value){
		if(Tool.isEmpty(value))return;
		obj.put(key, String.join(", ", value));
	}
	private void optPut(JSONObject obj,String key,JSONArray value){
		if(Tool.isEmpty(value))return;
		obj.put(key, value);
	}
	private String getCond(ObjectDB constraintObj){
		String ctsType = constraintObj.getFieldDisplayValue("cst_type");
		switch (ctsType) {
			case "F":
				return constraintObj.getFieldDisplayValue("fld_name");
			case "M":
				return "back Method";
			default: //E
				return constraintObj.getFieldDisplayValue("cst_expr"); 
		}
	}
	private List<String> describeConstraints(ObjectDB obj,Grant g){
		String objName = obj.getName();
		List<String> constraints = new ArrayList<>();
		ObjectDB constraintObj = g.getTmpObject("ConstraintObject");
		synchronized(constraintObj.getLock()){
			String id = ObjectCore.getObjectId(objName);
			constraintObj.setFieldFilter("cst_object_id", id);
			
			for(String[] row : constraintObj.search()){
				String cstId = row[constraintObj.getRowIdFieldIndex()];
				constraintObj.select(cstId);
				String cst = constraintObj.getFieldValue("cst_name");
				String ctsDesc = constraintObj.getFieldValue("cst_desc");
				String ctsCond = getCond(constraintObj);
				List<String> impacts= new ArrayList<>();
				ObjectDB impactObj = g.getTmpObject("ConstraintImpact");
				synchronized(impactObj.getLock()){

					impactObj.setFieldFilter("csi_const_id", cstId);
					for(String[] rowImpact : impactObj.search()){
						String impact = getImpact(rowImpact,impactObj,obj,g);
						if(!Tool.isEmpty(impact))impacts.add(impact);
					}
				}
				if(!Tool.isEmpty(impacts))constraints.add(cst+" ("+ctsDesc+") si "+ ctsCond + " alors :\n\t\t* "+String.join(",\n\t\t* ",impacts));
			}
		}
		return constraints;
	}
	private String getImpact(String[] rowImpact,ObjectDB impactObj,ObjectDB obj,Grant g){
		String csiId = rowImpact[impactObj.getRowIdFieldIndex()];
		impactObj.select(csiId);
		String csiApply = impactObj.getFieldValue("csi_apply");
		String csiCond = impactObj.getFieldValue("csi_expr");
		String csiObj = "";
		switch (csiApply) {
			case "F":
				csiObj = impactObj.getFieldDisplayValue("csi_field_prop")+" of "+impactObj.getFieldValue("fld_name");
				return csiObj+" == "+csiCond;
			case "T":
				String[] csiTarget = impactObj.getFieldValue("csi_target").split(":");
				csiObj = "Visibility of ";
				// case Action;Link;ViewObject;ObjectFieldArea
				switch (csiTarget[0]) {
					case "Action":
						ObjectDB act = g.getTmpObject("Action");
						synchronized(act.getLock()){
							act.select(csiTarget[1]);
							csiObj += "Action "+act.getFieldValue("act_name");
							String desc = act.getFieldValue("act_comment");
							if(!Tool.isEmpty(desc))csiObj += " ("+desc+")";
						}
						
						return csiObj+" == "+csiCond;
					case "Link":
						ObjectDB linkObj = g.getTmpObject("Link");
						synchronized(linkObj.getLock()){
							linkObj.select(csiTarget[1]);
							csiObj += "Link to "+ linkObj.getField("obf_object_id").getRefObjectDisplay();
						}
						return csiObj+" == "+csiCond;
					case "ViewObject":
						ObjectDB vob = g.getTmpObject("ViewObject");
						synchronized(vob.getLock()){
							vob.select(csiTarget[1]);
							View v = g.getView(vob.getFieldValue("vob_name"));
							csiObj += "View "+v.getDisplay(g.getLang());
						}
						return csiObj+" == "+csiCond;
					case "ObjectFieldArea":
						ObjectDB area = g.getTmpObject("ObjectFieldArea");
						synchronized(area.getLock()){
							area.select(csiTarget[1]);
							FieldArea a = obj.getFieldArea(area.getFieldValue("ofa_name"));
							csiObj += "Field Area "+a.getDisplay();
						}
						return csiObj+" == "+csiCond;
					default:
						return "";
				}
				
			default: 
				return "";
		}

	}
}