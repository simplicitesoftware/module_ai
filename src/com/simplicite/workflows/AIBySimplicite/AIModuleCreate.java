package com.simplicite.workflows.AIBySimplicite;

import java.util.*;

import org.json.JSONArray;
import org.json.JSONObject;

import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AIModel;
import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.CreateException;
import com.simplicite.util.exceptions.GetException;
import com.simplicite.util.exceptions.ValidateException;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.ObjectContextWeb;







/**
 * Process AIModuleCreate
 */
public class AIModuleCreate extends Processus {
	private static final long serialVersionUID = 1L;
	private static final String DEV_MODULE ="DevAIAddon";
	private static final String DEVOBJ_GENERATE_MLDS ="DaaGenerateMlds";
	private static final String DEVFIELD_MLD_ID ="daaGmlModuleId";
	private static final String DAA_ERROR_CREATE ="DAA_ERROR_CREATE";
	private static final String PROCESS_RESOURCE_EXTERNAL_OBJECT ="AIProcessResource";
	private static final String INTERNAL_OBJ ="ObjectInternal";
	private static final String FIELD ="Field";
	private static final String MDL_PREFIX_FIELD ="mdl_prefix";
	private static final String ROW_MODULE_ID_FIELD ="row_module_id";
	private static final String DOMAIN_NAME_FIELD ="obd_name";
	private static final String ROW_ID ="row_id";
	private static final String SCOPE_ID_FIELD = "vig_view_id";
	private static final String EMPTY_TEXTAREA ="<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\"  name=\"json_return\"></textarea>";
	private static final String ACE_DIV ="<div id=\"ace_json_return\"></div>";
	private static final String ACTIVITY_CREATE_MODULE ="AIC_0010";
	private static final String DATA_PRE ="preContext";
	private static final String DATA_JSON ="json_return";
	private static final String DATA_POST ="postContext";
	private static final String DATA_GROUP_RETURN ="Return";

	private static final String ACTIVITY_CHOICE ="AIC_0005";
	private static final String ACTIVITY_GRANT_USER ="AIC_0020";
	private static final String ACTIVITY_SELECT_MODULE ="AIC_0100";
	private static final String ACTIVITY_SELECT_GROUP ="AIC_0200";
	private static final String ACTIVITY_SELECT_DOMAIN ="AIC_0300";
	private static final String ACTIVITY_INTERACTION ="AIC_0350";
	private static final String ACTIVITY_PROMPT ="AIC_0400";
	private static final String ACTIVITY_AI ="AIC_0500";
	private static final String ACTIVITY_GEN ="AIC_0600";
	private static final String ACTIVITY_TRL_DOMAIN ="AIC_0015";
	private static final String ACTIVITY_NEW_SCOPE="AIC_0017";
	private static final String AI_SETTING_NEED="AI_SETTING_NEED";
	private static final String EXISTING_OBJECT="exisitingObject";
	private static final String DOMAIN="Domain";
	private static final String MODULE_NAME_FIELD="mdl_name";
	private static final String TSL_VALUE_FIELD="tsl_value";
	private static final String DAA_OBJECT_GENERATION="DaaObjectGeneration";
	private boolean displayPrefixWarning = false; 
	
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
		AppLog.info("chatBot", getGrant());
		if(!AITools.isAIParam(true)) return  g.T(AI_SETTING_NEED);
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		List<String[]> objs = getModuleObjects(getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID),g);
		if (Tool.isEmpty(objs)) return getModuleChat("",g,moduleId);
		JSONObject json = objectToJSON(objs,getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, MDL_PREFIX_FIELD));

		getContext(getActivity(ACTIVITY_GEN)).setDataFile("Data",EXISTING_OBJECT,getObjsIds(objs,g));
		JSONObject jsonResponse =AITools.aiCaller(g, "you help to describe UML for non technical person","Describes the application defined by this JSON in a graphical way for non-technical users: "+json.toString() , null,false,true);
		String contextApp =AITools.parseJsonResponse(jsonResponse);
		contextApp = formatAnswerAI(contextApp);
		return getModuleChat(contextApp,g,moduleId);

	}
	private String[] getObjsIds(List<String[]> objs,Grant g){
		String[] ids = new String[objs.size()];
		int idIndex = g.getTmpObject(INTERNAL_OBJ).getRowIdFieldIndex();
		for(int i=0;i<objs.size();i++){
			ids[i] = objs.get(i)[idIndex];
		}
		return ids;
	}
	private JSONObject objectToJSON(List<String[]> objs,String modulePrefix){
		JSONArray objects = new JSONArray();
		JSONArray relationship = new JSONArray();
		ObjectDB obj = getGrant().getTmpObject(INTERNAL_OBJ);
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
		ObjectDB obj = g.getTmpObject(INTERNAL_OBJ);
		obj.resetFilters();
		obj.setFieldFilter(ROW_MODULE_ID_FIELD, moduleId);

		return obj.search();
	}
	private String getModuleChat(String response,Grant g,String moduleId){

		String script =HTMLTool.jsBlock(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("CHAT_BOT_SCRIPT"));
		AppLog.info("moduleId: "+moduleId+(isAdaContext()?" true":" false"), g);
		if(!Tool.isEmpty(moduleId) && isAdaContext()){
			AppLog.info("before: "+script, g);
			script = script.replace("let isAdaContext=false;", "let isAdaContext = true;");
			script = script.replace("let moduleid;", "let moduleid = "+moduleId+";");
			AppLog.info("after: "+script, g);
		}
		String css = HTMLTool.lessToCss(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceCSSContent("CHAT_BOT_CSS"));
		String html = g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceHTMLContent("CHAT_BOT_MODEL");
		html = html.replace("{{{script}}}", script);
		html = html.replace("{{css}}", css);
		html = html.replace("{{botMesage}}", Tool.isEmpty(response)?"":"<div class=\"bot-messages\" id=\"context\"><strong>"+AITools.getBotName()+": </strong><span class=\"msg\">"+response+"</span></div>");
		return html;
	}
	private boolean isAdaContext(){
		return !Tool.isEmpty(ModuleDB.getModuleId​("AiDemonstrationAddon", false));
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
		AppLog.info("ai", getGrant());
		String divId = "ace_json_return";
		String aceEditor ="$ui.loadScript({url: $ui.getApp().dispositionResourceURL(\"AiJsTools\", \"JS\"),onload: function(){ AiJsTools.loadResultInAceEditor($('#json_return'),'"+divId+"');}});";
		if(!AITools.isAIParam(true)) return  g.T(AI_SETTING_NEED);
		List<String> listResult = new ArrayList<>();
		listResult.add(context.getDataValue("Data", DATA_PRE));
		listResult.add(context.getDataValue("Data", DATA_JSON));
		listResult.add(context.getDataValue("Data", DATA_POST));
		if(Tool.isEmpty(listResult)) return ACE_DIV+EMPTY_TEXTAREA+HTMLTool.jsBlock(aceEditor);
		
		return "<p>"+listResult.get(0)+"</p>"+ACE_DIV+"<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;display: none;\" id=\"json_return\"  name=\"json_return\">"+listResult.get(1)+"</textarea>"+"<p>"+listResult.get(2)+"</p>"+HTMLTool.jsBlock(aceEditor);
		
		
	}
	@Override
	public void postActivate() {
		List<String> stepToPassForAPI = Arrays.asList(ACTIVITY_CHOICE,ACTIVITY_TRL_DOMAIN, ACTIVITY_NEW_SCOPE, ACTIVITY_GRANT_USER);
		if(getGrant().isAPIEndpoint()){
			for(String step : stepToPassForAPI){
				getActivity(step).setUserDialog(false);
			}
		}

		super.postActivate();
	}
	private List<String> getJsonAi(String step, Grant g){
		JSONArray historic = new JSONArray();
		String prompt = getPromptFromContext(step, historic,g);
		
		if(Tool.isEmpty(prompt)){//for test
			return new ArrayList<>();
		}
		JSONObject jsonResponse = AITools.aiCaller(g, "you help to create UML in json for application, your answers are automatically processed in java", prompt, historic,false,true);
		String result = AITools.parseJsonResponse(jsonResponse);
		
		//for dev purpose
		String choiceAct = getContext(getActivity(ACTIVITY_CHOICE)).getDataValue("Data", "AREA:1");
		if(g.isAPIEndpoint()){
			choiceAct = "1";
		}
		AppLog.info("choice: "+choiceAct, g);
		devSaveGenerationCost(getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID),jsonResponse.optJSONObject(AITools.USAGE_KEY),"1".equals(choiceAct));
		List<String> listResult = new ArrayList<>();
		JSONObject jsonres = AITools.getValidJson(result);
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
		int histDepth = AITools.getHistDepth();
		String historicString = getContext(getActivity(ACTIVITY_INTERACTION)).getDataValue("Data", "AI_data");
		if (!Tool.isEmpty(historicString)){
			int i=0;
			JSONArray list = new JSONArray(historicString);
			int begin = list.length()-histDepth*2;
			for(Object hist : list){
				if(i>=begin){
					try{
						historic.put(getJSONForamtedHist(hist));
					}catch(Exception e){
						AppLog.info((String) hist,getGrant());
						AppLog.error(e, g);
					}
				}
					
				i++;
			}
		}
		byte[] template =g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceContent(Resource.TYPE_OTHER,"CONTEXT_INTERACTION_PROMPT");
		return template!=null?new String(template):"";
	}
	private JSONObject getJSONForamtedHist(Object hist) throws AITools.AITypeException{
		if(hist instanceof JSONObject)
			return AITools.formatMessageHistoric((JSONObject) hist);
		else if(hist instanceof String)
			return AITools.formatMessageHistoric(new JSONObject((String) hist));
		throw new AITools.AITypeException("historic",hist.getClass().getName(),"JSONObject or String");	
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
		AppLog.info("gen", getGrant());
		if(context.getStatus() == ActivityFile.STATE_DONE){
			return null;}
		if(!AITools.isAIParam(true)) return  g.T(AI_SETTING_NEED);
		DataFile error = context.getDataFile("Data", "error",false);
		if(!Tool.isEmpty(error)){
			return "<p>"+error.getValues()[0]+"</p>";
		}
		DataFile allids = context.getDataFile("Data", "allIds",false);
		if(Tool.isEmpty(allids)){
			return "<p>"+g.getText("AI_SUCCESS")+"</p>" + HTMLTool.jsBlock(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("AI_GEN_MODEL")+"\n"+ "aiGenModel.AINewModel();");
		}else{
			return "<p>"+g.getText("AI_COMPLETED")+"</p> "+HTMLTool.jsBlock(g.getExternalObject(PROCESS_RESOURCE_EXTERNAL_OBJECT).getResourceJSContent("AI_GEN_MODEL")+"\n"+ "aiGenModel.AINewModel();");
		}		
	}
	private void devSaveIACreatedModule(String mldId){
		if(!Tool.isEmpty(ModuleDB.getModuleId(DEV_MODULE, false))){
			Grant admin = Grant.getSystemAdmin();
			admin.addAccessCreate(DEVOBJ_GENERATE_MLDS);
			ObjectDB obj = admin.getTmpObject(DEVOBJ_GENERATE_MLDS);
			synchronized(obj.getLock()){
				BusinessObjectTool objT = obj.getTool();
				try {
					objT.selectForCreate();
					obj.setFieldValue(DEVFIELD_MLD_ID, mldId,false);
					obj.setFieldValue("daaGmlCreateBy", getGrant().getLogin());
					obj.setFieldValue("daaGmlApi",getGrant().isAPIEndpoint());
					obj.setFieldValue("daaGmlModuleName",ModuleDB.getModuleName(mldId));
					obj.setFieldValue("daaGmlCreationByIa",true);
					objT.validateAndCreate();
				} catch (GetException | CreateException | ValidateException e) {
					AppLog.warning(admin.getText(DAA_ERROR_CREATE),e);
				}
			}
		}
	}
	private void devSaveGenerationCost(String mldId, JSONObject cost,boolean isNew){
		if(!Tool.isEmpty(ModuleDB.getModuleId(DEV_MODULE, false))){
			Grant admin = Grant.getSystemAdmin();
			admin.addAccessRead(DEVOBJ_GENERATE_MLDS);
			admin.addAccessCreate(DEVOBJ_GENERATE_MLDS);
			admin.addAccessObject(DAA_OBJECT_GENERATION);
			admin.addAccessCreate(DAA_OBJECT_GENERATION);
			ObjectDB obj = admin.getTmpObject(DEVOBJ_GENERATE_MLDS);
			obj.resetFilters();
			obj.setFieldFilter(DEVFIELD_MLD_ID, mldId);
			List<String[]> r = obj.search();
			String glmId;
			if(Tool.isEmpty(r)){
				synchronized(obj.getLock()){
					BusinessObjectTool objT = obj.getTool();
					try {
						objT.selectForCreate();
						obj.setFieldValue(DEVFIELD_MLD_ID, mldId,false);
						obj.setFieldValue("daaGmlModuleName",ModuleDB.getModuleName(mldId));
						objT.validateAndCreate();
						glmId = obj.getRowId();
					} catch (GetException | CreateException | ValidateException e) {
						AppLog.warning(admin.getText(DAA_ERROR_CREATE),e);
						return;
					}
				}
			}else{
				glmId = r.get(0)[obj.getFieldIndex(ROW_ID)];
			}
			obj = admin.getTmpObject(DAA_OBJECT_GENERATION);
			synchronized(obj.getLock()){
				BusinessObjectTool objT = obj.getTool();
				try {
					objT.selectForCreate();
					obj.setFieldValue("daaOgGmlId", glmId,false);
					obj.setFieldValue("daaOgCost",cost);
					obj.setFieldValue("daaOgNew",isNew);
					objT.validateAndCreate();
				} catch (GetException | CreateException | ValidateException e) {
					AppLog.warning(admin.getText(DAA_ERROR_CREATE),e);
				}
			}
		}
	}
	
	private void devSaveError(Exception e,String[] groupIds,String json,String domainId, String moduleId,String userLogin,Grant admin){
		if(!Tool.isEmpty(ModuleDB.getModuleId(DEV_MODULE, false))){
			JSONObject jsonLog = new JSONObject();
			jsonLog.put("daaLmcUser", userLogin);
			jsonLog.put("daaLmcAiModuleJson",json);
			List<String> error = new ArrayList<>();
			error.add(e.getMessage());
			for(StackTraceElement trace : e.getStackTrace()){
				error.add(trace.toString());
			}

			jsonLog.put("daaLmcError",String.join("\n\t at ", error));
			jsonLog.put("daaLmcModuleId",moduleId);
			jsonLog.put("daaLmcDomainId",domainId);
			ObjectDB obj = admin.getTmpObject("DaaLogModuleCreate");
			try{
				synchronized(obj.getLock()){
					BusinessObjectTool objT = obj.getTool();
					objT.selectForCreate();
					obj.setValuesFromJSONObject(jsonLog, false, false,false);
					obj.populate(true);
					objT.validateAndCreate();
				}
				String id = obj.getRowId();
				obj = admin.getTmpObject("DaaLogModuleCreateGroup");
				synchronized(obj.getLock()){
					BusinessObjectTool objT = obj.getTool();
					for(String groupId : groupIds){
						objT.selectForCreate();
						obj.setFieldValue("groupId", groupId);
						obj.setFieldValue("daaLogModuleCreateId", id);
						obj.populate(true);
						objT.validateAndCreate();
					}
				}
			}catch(Exception ex){
				if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS)) AppLog.error(ex, admin);
			}
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
		AppLog.info("deleteModule", getGrant());
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		return "<div id=\"deleteModule\"></div><script>$ui.displayModuleDelete($(\"#deleteModule\"),"+ moduleId +" )</script>";
	}
	private String formatAnswerAI(String answer){
		return answer.replaceAll("(\r\n|\n)", "<br>");
	}
	@Override
	public Message preAbandon() {
		Activity act = getActivity("AIC-END");
		if(!Tool.isEmpty(act))
			getContext(act).setDataFile("Forward", "Page", "ui/AiMonitoring");
		return super.preAbandon();
	}
	public String noParam(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		String js = HTMLTool.JS_START_TAG+"$('.btn-validate').hide();$('.btn-AIStartParam').css('border-radius', '.25rem');"+HTMLTool.JS_END_TAG;
		return js+getGrant().T(AI_SETTING_NEED);
	}
	@Override
	public Message preValidate(ActivityFile context) {
		String step = context.getActivity().getStep();
		switch (step) {
			case "AIC_0050":
				context.setDataFile(DATA_GROUP_RETURN,"Code", AITools.isAIParam()?"1":"0");
				break;
			case ACTIVITY_CREATE_MODULE:
				if(!displayPrefixWarning){
					Object prefix = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, MDL_PREFIX_FIELD); 
					ObjectDB obj = getGrant().getTmpObject("Module");
					synchronized(obj.getLock()){
						obj.resetFilters();
						obj.setFieldFilter(MDL_PREFIX_FIELD, prefix);
						List<String[]> search = obj.search();
						if(!search.isEmpty()){
							List<String> modules = new ArrayList<>();
							for(String[] el : search){
								modules.add(el[obj.getFieldIndex(MODULE_NAME_FIELD)]);
							}
							Message m = new Message();
							m.raiseError(Message.formatWarning("AI_WARN_PREFIX", String.join(", ",modules), MDL_PREFIX_FIELD));
							displayPrefixWarning = true;
							return m;
						}

					}
				}
				break;
			case ACTIVITY_AI:
				Message check = AITools.checkJson(context.getDataValue("Data", DATA_JSON));
				if(!Tool.isEmpty(check)) return check;
				break;
			default:
				break;
		}
		if(!context.getActivity().isUserDialog()){
			automaticDataFile(context);
		}
		return super.preValidate(context);
	}
	
	private void automaticDataFile(ActivityFile context){
		String step = context.getActivity().getStep();
		switch (step) {
			case ACTIVITY_NEW_SCOPE:
				String moduleName = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, MODULE_NAME_FIELD);
				String moduleId = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, ROW_ID);
				context.setDataFile(FIELD, "viw_name", "Scope"+moduleName);
				context.setDataFile(FIELD, "viw_type", "H");
				context.setDataFile(FIELD, ROW_MODULE_ID_FIELD, moduleId);
				break;
		
			case ACTIVITY_TRL_DOMAIN:
				automaticTrlDom(context, getGrant());
				break;
			case ACTIVITY_CHOICE:
				context.setDataFile(DATA_GROUP_RETURN,"Code", "1");
				break;
			default:
				break;
		}
	}
	@Override
	public void postValidate(ActivityFile context) {
		String step = context.getActivity().getStep();		
		switch (step) {
			case ACTIVITY_CREATE_MODULE:
				addDataToSelectActsAndGrant(context);
				displayPrefixWarning = false;
				devSaveIACreatedModule(context.getDataValue(FIELD, ROW_ID));// add to a list for dev purpose
				break;
			case ACTIVITY_GRANT_USER:
				grantCurentUser(context);
				break;
			case ACTIVITY_TRL_DOMAIN:
				saveTranslate(context);
				break;
			case ACTIVITY_NEW_SCOPE:
				scopeGrant(context.getDataValue(FIELD, ROW_ID));
				if(!context.getActivity().isUserDialog()){
					String moduleName = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, MODULE_NAME_FIELD);
					trlScope(context.getDataValue(FIELD, ROW_ID),moduleName);
				}
			
				break;
			case ACTIVITY_INTERACTION:
			case ACTIVITY_PROMPT:
				List<String> listResult= getJsonAi(context.getActivity().getStep(), getGrant());
				setResultInDataFile(listResult);
				break;
			case ACTIVITY_AI:
				generateObjects(context,context.getProcessus());
				break;
			default:
				break;
		}
		super.postValidate(context);
	}
	private void setResultInDataFile(List<String> listResult){
		ActivityFile nextcontext = getContext(getActivity(ACTIVITY_AI));
		if(!Tool.isEmpty(listResult) && listResult.size()==3){
			nextcontext.setDataFile("Data", DATA_PRE, listResult.get(0));
			nextcontext.setDataFile("Data", DATA_JSON, listResult.get(1));
			nextcontext.setDataFile("Data", DATA_POST, listResult.get(2));
		}else {
			nextcontext.setDataFile("Data", DATA_PRE, (Tool.isEmpty(listResult)?"":listResult.get(0)));
			nextcontext.setDataFile("Data", DATA_JSON, "");
			nextcontext.setDataFile("Data", DATA_POST, "");
		}
	}
	private void addDataToSelectActsAndGrant(ActivityFile context){
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
		
	}
	private void grantCurentUser(ActivityFile context){
		Grant g = getGrant();
		boolean isGrantUser =true;
		if(context.getActivity().isUserDialog())isGrantUser = "1".equals(context.getDataValue("Data", "AREA:1")); 
		if(isGrantUser){
			String groupName = getContext(getActivity(ACTIVITY_SELECT_GROUP)).getDataValue(FIELD, "grp_name");
			if(Tool.isEmpty(groupName)){
				groupName = SyntaxTool.join(SyntaxTool.UPPER, new String[]{getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD,MDL_PREFIX_FIELD),"GROUP"});
			}
			String moduleName = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, MODULE_NAME_FIELD);
			Grant.addResponsibility(Grant.getUserId(g.getLogin()),groupName,null,null,true, moduleName);
			if(g.isAPIEndpoint()){
				g.getGroup("AIA_API_MODULE_CREATE").addProfile(g.getGroup(groupName));
				if(!"designer".equals(g.getLogin()))
					Grant.addResponsibility(Grant.getUserId("designer"),groupName,null,null,true, moduleName);
				
				
			}
		}
	}
	private void generateObjects(ActivityFile context, Processus p){
		Grant g = getGrant();
		ActivityFile genContext = getContext(getActivity(ACTIVITY_GEN));
		String json = getContext(getActivity(ACTIVITY_AI)).getDataValue("Data", DATA_JSON);
		String[] objs = null;
		String test = p.getPreviousContext(p.getPreviousContext(context)).getActivity().getStep();
		if(ACTIVITY_SELECT_DOMAIN.equals(test)){
			objs = getObjsIds(getModuleObjects(getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID),g),g);
		}else{
			DataFile data = getContext(getActivity(ACTIVITY_GEN)).getDataFile("Data", EXISTING_OBJECT,false);
			if(!Tool.isEmpty(data)){
				objs = data.getValues();
			}	
		}
		
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		DataFile dataGroup = getContext(getActivity(ACTIVITY_SELECT_GROUP)).getDataFile(FIELD, ROW_ID,false);
		String[] groupIds = Tool.isEmpty(dataGroup)?new String[]{}:dataGroup.getValues();
		String domainId = getContext(getActivity(ACTIVITY_SELECT_DOMAIN)).getDataValue(FIELD, ROW_ID);
		
		try{
			JSONObject jsonObject = AITools.getValidJson(json);
			List<String> ids = AIModel.genModule(moduleId,	groupIds,domainId,jsonObject);
			genContext.setDataFile("Data", "createdIds", ids);
			genContext.setDataFile("Data", "moduleId", moduleId);
			genContext.setDataFile("Data", "moduleName", ModuleDB.getModuleName(moduleId));
			if(!Tool.isEmpty(objs)){
				ids.addAll(Arrays.asList(objs));
				ids = new ArrayList<>(new HashSet<>(ids));
				genContext.setDataFile("Data", "allIds", ids);
			}
		} catch (Exception e) {
			AppLog.error(e, g);
			Grant admin = Grant.getSystemAdmin();
			devSaveError(e,groupIds,json,domainId, moduleId,g.getLogin(),admin);
			AppLog.error(e, admin);
			genContext.setDataFile("Data", "error", admin.T("AI_ERROR"));
		}
	}
	private void trlScope(String scopeId,String moduleName){
		
		ObjectDB obj = getGrant().getTmpObject("TranslateView");
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				obj.resetFilters();
				obj.setFieldFilter("tsl_object", "View:"+scopeId);
				for(String[] row : obj.search()){
					objTool.selectForUpdate(row[obj.getRowIdFieldIndex()]);
					if("FRA".equals(row[obj.getFieldIndex("tsl_lang")])){
						obj.setFieldValue(TSL_VALUE_FIELD, "Vue "+moduleName);
					}else{
						obj.setFieldValue(TSL_VALUE_FIELD, "Scope "+moduleName);
					}
				}
				objTool.validateAndUpdate();
			}catch(Exception e){
				AppLog.error(e, getGrant());
			}
		}
	}
	private void automaticTrlDom(ActivityFile af, Grant g){
		String moduleId = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, ROW_ID);
		String moduleName = getContext(getActivity(ACTIVITY_CREATE_MODULE)).getDataValue(FIELD, MODULE_NAME_FIELD);
		String[] langCodes = g.getLangsCodes();
		// Domains translations
		ObjectDB dom = g.getTmpObject(DOMAIN);
		dom.resetFilters();
		dom.setFieldFilter(ROW_MODULE_ID_FIELD, moduleId);
		List<String[]> v = dom.search();
		for (int j=0; j<v.size(); j++)
		{
			dom.setValues(v.get(j), false);
			for (int i=0; i<langCodes.length; i++)
			{
				String lang = langCodes[i];
				String val = g.simpleQuery(
					"select tsl_value from m_translate " +
					"where tsl_object='Domain:"+dom.getRowId()+"' and tsl_lang='"+lang+"'");
				val+= " "+moduleName;
				String name = "tsl"+lang+dom.getRowId();
				af.addDataFile("Data", name,val);
			}
		}
	}
	private void grantGroupToDomain(String domainId, String groupId, String moduleId){
		ObjectDB obj = getGrant().getTmpObject("Permission");
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				JSONObject permFlds = new JSONObject().put("prm_group_id", groupId).put("prm_object", "Domain:"+domainId);
				if(!objTool.selectForCreateOrUpdate(permFlds)){
					permFlds.put(ROW_MODULE_ID_FIELD, moduleId);
					obj.setValuesFromJSONObject(permFlds, false, false,false);
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
		String groupName = SyntaxTool.join(SyntaxTool.UPPER, new String[]{context.getDataValue(FIELD,MDL_PREFIX_FIELD),"GROUP"});
		JSONObject groupFlds = new JSONObject().put("grp_name", groupName);
		ObjectDB obj = getGrant().getTmpObject("Group");
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				if(!objTool.selectForCreateOrUpdate(groupFlds)){
					groupFlds.put(ROW_MODULE_ID_FIELD, moduleId);
					obj.setValuesFromJSONObject(groupFlds, false, false,false);
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
		String domainName = SyntaxTool.join(SyntaxTool.PASCAL, new String[]{context.getDataValue(FIELD,MDL_PREFIX_FIELD),DOMAIN});
		JSONObject domainFlds = new JSONObject().put(DOMAIN_NAME_FIELD, domainName);
		ObjectDB obj = getGrant().getTmpObject(DOMAIN);
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				int i=1;
				
				while(objTool.selectForCreateOrUpdate(domainFlds)){
					domainFlds.put(DOMAIN_NAME_FIELD, domainName+String.valueOf(i));
					i++;
				}
				domainFlds.put(ROW_MODULE_ID_FIELD, moduleId).put("obd_nohome",1);
				obj.setValuesFromJSONObject(domainFlds, false, false,false);
				obj.populate(true);
				objTool.validateAndCreate();
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
		ObjectDB dom = g.getTmpObject(DOMAIN);
		dom.resetFilters();
		dom.setFieldFilter(ROW_MODULE_ID_FIELD, moduleId);
		List<String[]> v = dom.search();
		for (int j=0; j<v.size(); j++)
		{
			dom.setValues(v.get(j), false);
			html.append("<tr>");
			html.append(getTdField(dom.getFieldValue(DOMAIN_NAME_FIELD)));
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
			String val="";
			if (df!=null) val = df.getValue(0);
			if (df == null || Tool.isEmpty(val)) continue;
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
					tsl.setFieldValue(TSL_VALUE_FIELD, val);
					tsl.update();
				}
			}
		}
	}
	private void scopeGrant(String scopeId){
		String moduleId = getContext(getActivity(ACTIVITY_SELECT_MODULE)).getDataValue(FIELD, ROW_ID);
		String groupeId = getContext(getActivity(ACTIVITY_SELECT_GROUP)).getDataValue(FIELD, ROW_ID);
		AppLog.info("scopeGrant module: "+moduleId+", groupe: "+groupeId, getGrant());

		ObjectDB obj = getGrant().getTmpObject("Group");
		synchronized(obj.getLock()){
			try{
				obj.select(groupeId);
				obj.setFieldValue("grp_home_id", scopeId,false);
				obj.save();
			}catch(Exception e){
				AppLog.error("Group save ",e, getGrant());
			}
		}
		obj = getGrant().getTmpObject("ViewGroup");
		
		synchronized(obj.getLock()){
			try{
				BusinessObjectTool objTool = obj.getTool();
				objTool.selectForCreate();
				obj.setFieldValue(ROW_MODULE_ID_FIELD, moduleId);
				AppLog.info("view group view id: "+scopeId +" name "+View.getViewName(scopeId)+" field "+obj.getFieldValue(SCOPE_ID_FIELD), getGrant());
				obj.setFieldValue(SCOPE_ID_FIELD, scopeId,false);
				obj.setFieldValue("vig_group_id", groupeId,false);
				AppLog.info("view group view id: "+scopeId +" name "+View.getViewName(scopeId)+" field "+obj.getFieldValue(SCOPE_ID_FIELD), getGrant());
				AppLog.info("view group group id: "+groupeId+ GroupDB.getGroupName(groupeId), getGrant());
				AppLog.info("view group: "+obj.toJSON(), getGrant()); 
				obj.populate(true);
				AppLog.info("view group: "+obj.toJSON(), getGrant());
				objTool.validateAndCreate();
			}catch(Exception e){
				AppLog.error("view group ",e, getGrant());
			}
		}
		
	}
	
}