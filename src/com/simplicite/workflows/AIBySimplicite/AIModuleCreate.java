package com.simplicite.workflows.AIBySimplicite;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;
import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AIModel;
import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.ObjectContextWeb;



/**
 * Process AIModuleCreate
 */
public class AIModuleCreate extends Processus {
	private static final long serialVersionUID = 1L;
	private static final String PROCESS_RESOURCE_EXTERNAL_OBJECT ="AIProcessResource";
	private static final String FIELD ="Field";
	private static final String ROW_ID ="row_id";
	private static final String EMPTY_TEXTAREA ="<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"json_return\" name=\"json_return\"></textarea>";
	private static final String ACTIVITY_CREATE_MODULE ="AIC_0010";
	private static final String ACTIVITY_GRANT_USER ="AIC_0020";
	private static final String ACTIVITY_SELECT_MODULE ="AIC_0100";
	private static final String ACTIVITY_SELECT_GROUP ="AIC_0200";
	private static final String ACTIVITY_SELECT_DOMAIN ="AIC_0300";
	private static final String ACTIVITY_INTERACTION ="AIC_0350";
	private static final String ACTIVITY_PROMPT ="AIC_0400";
	private static final String ACTIVITY_AI ="AIC_0500";
	private static final String ACTIVITY_GEN ="AIC_0600";
	private static final String ACTIVITY_TRL_DOMAIN ="AIC_0015";
	
	@Override
	public void postLock(ActivityFile context) {
		AppLog.info("postLock: "+context.getActivity().getStep(), getGrant());
		// TODO Auto-generated method stub
		super.postLock(context);
	}
	@Override
	public void postInstantiate(Grant g) {
		AppLog.info("postInstantiate ", g);
		
		//getContext(getBegin()).setNextStep(ACTIVITY_SELECT_MODULE);
		super.postInstantiate(g);
	}
	/**
	 * This method is used to generate the HTML content for the chat bot.
	 * 
	 * @param p The processus object.
	 * @param context The activity file object.
	 * @param ctx The object context web object.
	 * @param g The grant object.
	 * @return The generated HTML content for the chat bot.
	 */
	public String chatBot(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() == ActivityFile.STATE_DONE)
			return null;
		List<String[]> objs = getModuleObjects(getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID),g);
		if (Tool.isEmpty(objs)) return getModuleChat("",g);
		JSONObject json = objectToJSON(objs,getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, "mdl_prefix"));

		getContext(getActivity(ACTIVITY_GEN)).setDataFile("Data","exisitingObject",getObjsIds(objs,g));
		String contextApp =AITools.AICaller(g, "you help to describe UML for non technical person","Describes the application defined by this JSON in a graphical way for non-technical users: "+json.toString() , null,false,true).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		contextApp = formatAnswerAI(contextApp);
		return getModuleChat(contextApp,g);

	}
	private String[] getObjsIds(List<String[]> objs,Grant g){
		String[] ids = new String[objs.size()];
		int idIndex = g.getTmpObject("ObjectInternal").getRowIdFieldIndex();
		for(int i=0;i<objs.size();i++){
			ids[i] = objs.get(i)[idIndex];
		}
		return ids;
	}
	private JSONObject objectToJSON(List<String[]> objs,String modulePrefix){
		JSONArray objects = new JSONArray();
		JSONArray relationship = new JSONArray();
		ObjectDB obj = getGrant().getTmpObject("ObjectInternal");
		for(String[] el : objs){
			JSONObject object = new JSONObject();
			String objName = el[obj.getFieldIndex("obo_name")];
			String regex = "^(?i)"+modulePrefix+"(.*)$";
			if(objName.matches(regex)){
				object.put("name", objName.replaceFirst(regex, "$1"));
			}else{
				object.put("name", objName);
			}
			
			object.put("comment", el[obj.getFieldIndex("obo_comment")]);
			object.put("attributes", getFieldArray(objName,relationship,modulePrefix));
			objects.put(object);
		}

		return new JSONObject().put("classes",objects).put("relationships",relationship);
	}
	private JSONArray getFieldArray(String objName, JSONArray relationship, String modulePrefix) {
		String regex = "^(?i)"+modulePrefix+"(.*)$";
		ObjectDB obj = getGrant().getTmpObject(objName);
		JSONArray array = new JSONArray();
		for (ObjectField field : obj.getFields()) {
			if(field.isForeignKey()){
				field.getRefObjectName();
				JSONObject relation = new JSONObject();
				String class1 = objName;
				if(class1.matches(regex)){
					class1 = class1.replaceFirst(regex, "$1");
				}
				
				String class2 = field.getRefObjectName();
				if(class2.matches(regex)){
					class2 = class2.replaceFirst(regex, "$1");
				}
				relation.put("class1", class1);
				relation.put("class2", class2);
				relation.put("type","ManyToOne");
				relationship.put(relation);
			}else if(!field.isTechnicalField()){
				JSONObject fieldJson = new JSONObject();
				fieldJson.put("name", field.getName().replace(modulePrefix, ""));
				fieldJson.put("type", ObjectField.getFieldTypeName(String.valueOf(field.getType())));
				fieldJson.put("key", field.isFunctId());
				fieldJson.put("required",field.isRequired());
				array.put(fieldJson);
			}
			
		}
		return array;
	}
	private List<String[]> getModuleObjects(String moduleId,Grant g){
		ObjectDB obj = getGrant().getTmpObject("ObjectInternal");
		obj.resetFilters();
		obj.setFieldFilter("row_module_id", moduleId);

		return obj.search();
	}
	private String getModuleChat(String response,Grant g){
		String script = g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("CHAT_BOT_SCRIPT");
		String css = HTMLTool.lessToCss(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceCSSContent("CHAT_BOT_CSS"));
		
		String html = g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceHTMLContent("CHAT_BOT_MODEL");
		
		html = html.replace("{{script}}", script);
		html = html.replace("{{css}}", css);
		html = html.replace("{{init}}", Globals.LANG_FRENCH.equals(g.getLang())?"Bonjour! Comment puis-je vous aider avec la conception d'applications? Voulez-vous que je vous aide a definir vos besoin ou avez-vous des questions spécifiques sur la conception?":"Hello! How can I help you with application design? Do you want me to help you define your needs or do you have specific questions about design?");
		html = html.replace("{{botMesage}}", Tool.isEmpty(response)?"":"<div class=\"bot-messages\" id=\"context\"><strong>{{botName}}: </strong><span class=\"msg\">"+response+"</span></div>");
		return html;
	}
	/**
	 * Generates a form element for capturing user input.
	 *
	 * @param p The process object.
	 * @param context The activity file object.
	 * @param ctx The web object context.
	 * @param g The grant object.
	 * @return The HTML code for the form element.
	 */
	public String form(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		return "<textarea  class=\"form-control autosize js-focusable\"  id=\"AI_prompt\" name=\"AI_prompt\" placeholder=\"Describe your needs here\"></textarea>";
	}

	/**
	 * This method is used to generate a response using the AI model.
	 * 
	 * @param p The process instance.
	 * @param context The activity file context.
	 * @param ctx The object context web.
	 * @param g The grant.
	 * @return The generated response as a String.
	 */
	public String ai(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() == ActivityFile.STATE_DONE)
			return null;
		List<String> listResult = getJsonAi( getPreviousContext(context).getActivity().getStep(), g);
		if(Tool.isEmpty(listResult)) return EMPTY_TEXTAREA;
		if(listResult.size()!=3)return Message.formatError("AI_ERROR_RETURN", listResult.get(0),null );
		return "<p>"+listResult.get(0)+"</p>"+"<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"json_return\" name=\"json_return\">"+listResult.get(1)+"</textarea>"+"<p>"+listResult.get(2)+"</p>";
		
		
	}
	private List<String> getJsonAi(String previousStep, Grant g){
		JSONArray historic = new JSONArray();
		String prompt = getPromptFromContext(previousStep, historic,g);
		JSONObject jsonres = new JSONObject();
		if(Tool.isEmpty(prompt)){//for test
			return new ArrayList<>();
		}
		String result = AITools.AICaller(g, "you help to create UML in json for application, your answers are automatically processed in java", prompt, historic,false,true).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		
		List<String> listResult = new ArrayList<>();
		jsonres = AITools.getValidJson(result);
		if(Tool.isEmpty(jsonres)){	
			listResult = AITools.getJSONBlock(result,getGrant());
			
			if(Tool.isEmpty(listResult)){
				jsonres = AITools.getValidJson(listResult.get(1));
				if(Tool.isEmpty(jsonres)){
					listResult = new ArrayList<>();
					listResult.add("Sorry AI do not return interpretable json: \n");
				}else{
					listResult.set(1,jsonres.toString());
				}
				
			}
		}else{
			listResult.add("");
			listResult.add(jsonres.toString());
			listResult.add("");	
		}
		return listResult;
	}
	
	/**
	 * Retrieves the prompt from the context based on the previous step.
	 * 
	 * @param previousStep The previous step in the workflow.
	 * @param historic The historic data in JSONArray format.
	 * @param g The grant object.
	 * @return The prompt retrieved from the context.
	 */
	private String getPromptFromContext(String previousStep, JSONArray historic,Grant g){
		String prompt = "";
		if(ACTIVITY_PROMPT.equals(previousStep)){
			prompt = getPromptFromPromptActivity(g);
		}else if(ACTIVITY_INTERACTION.equals(previousStep)){
			prompt =getPromptFromInteractionActivity(g, historic);
		}
		return prompt;
	} 

	private String getPromptFromPromptActivity(Grant g){
		String prompt = getContext(getActivity(ACTIVITY_PROMPT)).getDataValue("Data", "AI_prompt");
		if(Tool.isEmpty(prompt)){//for test
			return "";
		}
		JSONObject data = new JSONObject().put("prompt", prompt);
		byte[] template =g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceContent(Resource.TYPE_OTHER,"CONTEXT_DIRECT_PROMPT");
		String stringTemplate = template!=null?new String(template):"";
		return MustacheTool.apply(stringTemplate, data);
	}
	
	private String getPromptFromInteractionActivity(Grant g, JSONArray historic){
		int histDepth = Grant.getSystemAdmin().getJSONObjectParameter("AI_API_PARAM").getInt("hist_depth");
		String historicString = getContext(getActivity(ACTIVITY_INTERACTION)).getDataValue("Data", "AI_data");
			if(Tool.isEmpty(historicString)){//for test
				return "";
			}
			if (!Tool.isEmpty(historicString)){
				int i=0;
				JSONArray list = new JSONArray(historicString);
				int begin = list.length()-histDepth*2;
				for(Object hist : list){
					if(i>=begin)
						historic.put(AITools.formatMessageHistoric(new JSONObject((String) hist)));
					i++;
				}
			}
			byte[] template =g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceContent(Resource.TYPE_OTHER,"CONTEXT_INTERACTION_PROMPT");
			return template!=null?new String(template):"";
	}
	/**
	 * Generates a string based on the provided parameters.
	 * 
	 * @param p The Processus object.
	 * @param context The ActivityFile object.
	 * @param ctx The ObjectContextWeb object.
	 * @param g The Grant object.
	 * @return The generated string.
	 */
	public String gen(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		if(context.getStatus() == ActivityFile.STATE_DONE){
			return null;}
		String json = "";
		
		if (!getActivity(ACTIVITY_AI).isUserDialog()){
			List<String> result = getJsonAi(getPreviousContext(getPreviousContext(context)).getActivity().getStep(), g);
			if(!Tool.isEmpty(result) && result.size()==3) json = result.get(1); //isEmpty check null
		}else{
			json = getContext(getActivity(ACTIVITY_AI)).getDataValue("Data", "json_return");
		}
		
		if (Tool.isEmpty(json)){
			return g.getText("AI_ERROR");
		}
		String[] objs = null;
		String test = p.getPreviousContext(p.getPreviousContext(context)).getActivity().getStep();
		if(ACTIVITY_SELECT_DOMAIN.equals(test)){
			objs = getObjsIds(getModuleObjects(getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID),g),g);
		}else{
			DataFile data = context.getDataFile("Data", "exisitingObject",true);
			if(!Tool.isEmpty(data)){
				objs = context.getDataFile("Data", "exisitingObject",true).getValues();
			}	
		}
		
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		String[] groupIds = getContext(getActivity(ACTIVITY_SELECT_GROUP)).getDataFile(FIELD, ROW_ID,false).getValues();
		String domainId = getContext(getActivity(ACTIVITY_SELECT_DOMAIN)).getDataValue(FIELD, ROW_ID);
		try{
			JSONObject jsonObject = AITools.getValidJson(json);
			if(Tool.isEmpty(jsonObject)){
				return g.getText("AI_JSON_ERROR");
			}
			List<String> ids = AIModel.genModule(moduleId,	groupIds,domainId,jsonObject);
			context.setDataFile("Data", "createdIds", ids);
			context.setDataFile("Data", "moduleId", moduleId);
			context.setDataFile("Data", "moduleName", ModuleDB.getModuleName(moduleId));
			if(Tool.isEmpty(objs)){
				return "<p>"+g.getText("AI_SUCCESS")+"</p><script>" + g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("AI_GEN_MODEL")+"\n"+ "AINewModel();"+"</script>";
			}else{
				ids.addAll(Arrays.asList(objs));
				ids = new ArrayList<>(new HashSet<>(ids));
				context.setDataFile("Data", "allIds", ids);
				return "<p>"+g.getText("AI_COMPLETED")+"</p><script>" + g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("AI_GEN_MODEL")+"\n"+ "AINewModel();"+"</script>";
			}
			
			} catch (GetException | ValidateException | SaveException e) {
			AppLog.error(e, g);
			return "error";
		}
		
		
	}

	/**
	 * Deletes a module and returns the HTML code for displaying the module delete confirmation.
	 * 
	 * @param p The processus object.
	 * @param context The activity file context.
	 * @param ctx The object context web.
	 * @param g The grant object.
	 * @return The HTML code for displaying the module delete confirmation.
	 */
	public String deleteModule(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		return "<div id=\"deleteModule\"></div><script>$ui.displayModuleDelete($(\"#deleteModule\"),"+ moduleId +" )</script>";
	}
	private String formatAnswerAI(String answer){
		return answer.replaceAll("(\r\n|\n)", "<br>");
	}
	@Override
	public void postValidate(ActivityFile context) {
		String step = context.getActivity().getStep();
		if(ACTIVITY_CREATE_MODULE.equals(step)){
			AppLog.info("postValidate: "+ context.getDataValue(FIELD, ROW_ID), getGrant());
			getContext(getActivity(ACTIVITY_SELECT_MODULE)).setDataFile(FIELD,ROW_ID, context.getDataValue(FIELD, ROW_ID));
			String groupId = createGroup(context);
			if(!Tool.isEmpty(groupId)){
				getContext(getActivity(ACTIVITY_SELECT_GROUP)).setDataFile(FIELD, ROW_ID, groupId);
			}
			String domainId = createDomain(context);
			if(!Tool.isEmpty(domainId)){
				getContext(getActivity(ACTIVITY_SELECT_DOMAIN)).setDataFile(FIELD, ROW_ID, domainId);
			}
			grantGroupToDomain(domainId,groupId,context.getDataValue(FIELD, ROW_ID));

		}else if(ACTIVITY_GRANT_USER.equals(step)){
			AppLog.info("postValidate: "+ACTIVITY_GRANT_USER+" data: "+ context.getDataValue("Data", "AREA:1"), getGrant());
			boolean isGrantUser ="1".equals(context.getDataValue("Data", "AREA:1")); 
			if(isGrantUser){
				String groupName = getContext(getActivity(ACTIVITY_SELECT_GROUP)).getDataValue(FIELD, "grp_name");
				if(Tool.isEmpty(groupName)){
					groupName = SyntaxTool.join(SyntaxTool.UPPER, new String[]{getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD,"mdl_prefix"),"GROUP"});
				}
				String moduleName = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, "mdl_name");
				Grant.addResponsibility(Grant.getUserId(getGrant().getLogin()),groupName,null,null,true, moduleName);
			}
			
		}else if(ACTIVITY_TRL_DOMAIN.equals(step)){
			saveTranslate(context);
		}
		super.postValidate(context);
	}
	private void grantGroupToDomain(String domainId, String groupId, String moduleId){
		ObjectDB obj = getGrant().getTmpObject("Permission");
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				JSONObject permFlds = new JSONObject().put("prm_group_id", groupId).put("prm_object", "Domain:"+domainId);
				if(!objTool.selectForCreateOrUpdate(permFlds)){
					permFlds.put("row_module_id", moduleId);
					obj.setValuesFromJSONObject(permFlds, false, false);
					obj.populate(true);
					objTool.validateAndCreate();
				}
			}catch(Exception e){
				AppLog.error(e, getGrant());
			}
		}
	}
	private String createGroup(ActivityFile context){
		String moduleId =context.getDataValue(FIELD, ROW_ID);
		String groupName = SyntaxTool.join(SyntaxTool.UPPER, new String[]{context.getDataValue(FIELD,"mdl_prefix"),"GROUP"});
		JSONObject groupFlds = new JSONObject().put("grp_name", groupName);
		ObjectDB obj = getGrant().getTmpObject("Group");
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				if(!objTool.selectForCreateOrUpdate(groupFlds)){
					groupFlds.put("row_module_id", moduleId);
					obj.setValuesFromJSONObject(groupFlds, false, false);
					obj.populate(true);
					objTool.validateAndCreate();
				}
				return obj.getRowId();
			}catch(Exception e){
				AppLog.error(e, getGrant());
				return null;
			}
		}

	}
	private String createDomain(ActivityFile context){
		String moduleId =context.getDataValue(FIELD, ROW_ID);
		String domainName = SyntaxTool.join(SyntaxTool.PASCAL, new String[]{context.getDataValue(FIELD,"mdl_prefix"),"Domain"});
		JSONObject domainFlds = new JSONObject().put("obd_name", domainName);
		ObjectDB obj = getGrant().getTmpObject("Domain");
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				if(!objTool.selectForCreateOrUpdate(domainFlds)){
					domainFlds.put("row_module_id", moduleId);
					obj.setValuesFromJSONObject(domainFlds, false, false);
					obj.populate(true);
					objTool.validateAndCreate();
				}
				return obj.getRowId();
			}catch(Exception e){
				AppLog.error(e, getGrant());
				return null;
			}
		}

	}
	public String translateDomain(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		Activity a = p.getActivity(ACTIVITY_TRL_DOMAIN);
		ActivityFile af = getContext(a);
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);

		StringBuilder html = new StringBuilder();
		html.append("<table class=\"table table-striped workform\">");

		String[] langCodes = g.getLangsCodes();
		String[] langValues = g.getLangsValues();

		// Languages
		html.append("<tr>").append("<td>&nbsp;</td>");
		for (int i=0; i<langValues.length; i++)
			html.append(getTdField(langValues[i]));
		html.append("</tr>");

		// Domains translations
		ObjectDB dom = g.getTmpObject("Domain");
		dom.resetFilters();
		dom.setFieldFilter("row_module_id", moduleId);
		List<String[]> v = dom.search();
		for (int j=0; j<v.size(); j++)
		{
			dom.setValues(v.get(j), false);
			html.append("<tr>");
			html.append(getTdField(dom.getFieldValue("obd_name")));
			for (int i=0; i<langCodes.length; i++)
			{
				String lang = langCodes[i];
				String val = g.simpleQuery(
					"select tsl_value from m_translate " +
					"where tsl_object='Domain:"+dom.getRowId()+"' and tsl_lang='"+lang+"'");

				String name = "tsl"+lang+dom.getRowId();
				addDynamicData(af, name, val);
				html.append(getTdInput(name, val, 50, 100,1));
			}
			html.append("</tr>");
		}

		html.append("</table>");
		return html.toString();
	}
	private String getTdField(String value)
	{
		int colspan = 1;
		int rowspan = 1;
		return "<td"+(colspan>1 ? " colspan=\""+colspan+"\"" : "")+(rowspan>1 ? " rowspan=\""+rowspan+"\"" : "")+">" + Tool.toHTML(value) + "</td>";
	
	}
	public String getTdCell(String content, int colspan)
	{
		return "<td style=\"text-align: center;\""+(colspan>1 ? " colspan=\""+colspan+"\"" : "")+">" + content + "</td>";
	}
	public String getTdInput(String name, String value, int size, int maxSize, int colspan)
	{
		return getTdCell("<input class=\"form-control\" type=\"text\" size=\""+size+"\" maxsize=\""+maxSize+"\" name=\""+name+"\" value=\""+value+"\"/>", colspan);
	}
	public void saveTranslate(ActivityFile context){
		List<DataFile> vdf = context.getDataFiles("Data");
		ObjectDB tsl = getGrant().getTmpObject("TranslateDomain");
		for (int i=0; vdf!=null && i<vdf.size(); i++)
		{
			DataFile df = vdf.get(i);
			if (df==null) continue;
			String val = df.getValue(0);
			if (val==null || val.length()==0) continue;

			String name = df.getName();
			if (name.startsWith("tsl"))
			{
				String lang = name.substring(3,6);
				String id = name.substring(6);
				tsl.resetFilters();
				tsl.setFieldFilter("tsl_object", "Domain:"+id);
				tsl.setFieldFilter("tsl_lang", lang);
				List<String[]> v = tsl.search();
				if (!v.isEmpty())
				{
					tsl.setValues(v.get(0), true);
					tsl.setFieldValue("tsl_value", val);
					tsl.update();
				}
			}
		}
	}
}