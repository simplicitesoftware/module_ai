package com.simplicite.workflows.AIBySimplicite;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.*;

import org.json.JSONObject;

import com.simplicite.bpm.*;
import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;

import com.simplicite.webapp.ObjectContextWeb;
/**
 * Process AiSettingsProcess
 */
public class AiSettingsProcess extends Processus {
	private static final long serialVersionUID = 1L;
	private static final List<String> REQUIRED_FIELDS = new ArrayList<>(Arrays.asList("model","provider"));
	private static final String PROVIDER_OBJECT = "AIProvider";
	private static final String COMPLETION_URL_FLD = "aiPrvCompletionUrl";
	private static final String MODEL_URL_FLD = "aiPrvModelsUrl";
	private static final String FIELD_DATA = "Field";
	private static final String ROW_ID = "row_id";
	private static final String PROVIDER_ACT = "ASP-0100";
	private static final String AUTH_ACT = "ASP-0200";
	private static final String PARAM_ACT = "ASP-0400";
	private static final String AI_DEFAULT_PARAM = "AI_DEFAULT_PARAM";
	private static final String ERR_REQUIRED = "ERR_REQUIRED";

	public String setAuth(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g) throws MethodException{
		ObjectDB obj = g.getTmpObject(PROVIDER_OBJECT);
		String providerid = getContext(getActivity(PROVIDER_ACT)).getDataValue(FIELD_DATA, ROW_ID);
		obj.select(providerid);
		context.addDataFile("Data", "aiPrvPingUrl");
		context.addDataFile("Data", COMPLETION_URL_FLD);
		context.addDataFile("Data", MODEL_URL_FLD);
		return (String)obj.invokeMethod("getConfigurationPage", null, null);

	}
	public String setParams(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g) throws MethodException{
		ObjectDB obj = g.getTmpObject(PROVIDER_OBJECT);
		String providerid = getContext(getActivity(PROVIDER_ACT)).getDataValue(FIELD_DATA, ROW_ID);
		String[] models =getContext(getActivity(AUTH_ACT)).getDataFile("Data", "aiPrvModels",false).getValues();
		Class<?>[] paramTypes = {String[].class,List.class};
		Object[] paramValues = {models,REQUIRED_FIELDS};
		obj.select(providerid);
		synchronized(obj.getLock()){
			String text = g.T(AI_DEFAULT_PARAM);
			JSONObject model = AI_DEFAULT_PARAM.equals(text)?new JSONObject():new JSONObject(text);
			JSONObject speModel ;
			try{
				speModel = new JSONObject(obj.getFieldValue("aiPrvDataModel"));
			}catch(Exception e){
				AppLog.error(e, g);
				speModel = new JSONObject();
			}
			
			for(String d : speModel.keySet()){
				context.addDataFile("Data", d);
			}
			for ( String d : model.keySet()) {
				context.addDataFile("Data", d);
			}
			return (String)obj.invokeMethod("getParamPage", paramTypes , paramValues);
		}
	}
	private Message checkRequiredFields(ActivityFile context){
		Message m = null;
		for(DataFile d: context.getDataFiles("Data")){

			if(REQUIRED_FIELDS.contains(d.getName()) && (Tool.isEmpty(d.getValues()) || Tool.isEmpty(d.getValues()[0]))){
				if(m == null)
					m = new Message();
				m.raiseError(Message.formatError(ERR_REQUIRED, d.getName(), d.getName()));

			}
		}
		return m;
	}
	private Message formatURLError(boolean urlEmpty,boolean completionEmpty,Grant g){
		Message m = new Message();
		ObjectDB obj = g.getTmpObject(PROVIDER_OBJECT);
		String providerid = getContext(getActivity(PROVIDER_ACT)).getDataValue(FIELD_DATA, ROW_ID);
		synchronized(obj.getLock()){
			obj.select(providerid);
			if(urlEmpty)
				m.raiseError(Message.formatError(ERR_REQUIRED, obj.getField(MODEL_URL_FLD).getLabel(), MODEL_URL_FLD));
			if(completionEmpty)
				m.raiseError(Message.formatError(ERR_REQUIRED, obj.getField(COMPLETION_URL_FLD).getLabel(), COMPLETION_URL_FLD));
			
		}
		return m;
			
	} 
	@Override
	public Message preValidate(ActivityFile context) {
		Message m = checkRequiredFields(context);
		if (m != null)
			return m;
		if(AUTH_ACT.equals(context.getActivity().getStep())){
			Grant g = getGrant();
			String url = context.getDataValue("Data", MODEL_URL_FLD);
			String key = context.getDataValue("Data", "key");
			String completion =context.getDataValue("Data", COMPLETION_URL_FLD);
			if(Tool.isEmpty(url) || Tool.isEmpty(completion)) return formatURLError(Tool.isEmpty(url),Tool.isEmpty(completion),g);
			try {
				List<String> models = AITools.getModels(url, key, g);
				if("ERROR".equals(models.get(0))){
					m = new Message();
					m.raiseError(Message.formatError("ERROR_API_CALL", models.get(1), null));
					return m;
				}else{
					context.setDataFile("Data", "aiPrvModels", models);
					context.setDataFile("Data", "Code","1");
				}
				

			} catch (IOException | URISyntaxException e) {

				AppLog.error(e, g);
			}
		}
		return super.preValidate(context);
	}
	
	@Override
	public void postValidate(ActivityFile context) {
		if(PARAM_ACT.equals(context.getActivity().getStep())){
			for(DataFile d: context.getDataFiles("Data")){
				AppLog.info(d.getName()+": "+String.join(", ",d.getValues()), getGrant());
			}
			ObjectDB obj = getGrant().getTmpObject(PROVIDER_OBJECT);
			JSONObject param = new JSONObject();
			synchronized(obj.getLock()){
				String providerid = getContext(getActivity(PROVIDER_ACT)).getDataValue(FIELD_DATA, ROW_ID);
				obj.select(providerid);
				
				JSONObject defaultParam = new JSONObject(getGrant().T(AI_DEFAULT_PARAM));
				JSONObject sepParam = new JSONObject(obj.getFieldValue("aiPrvDataModel"));
				
				for(String k : defaultParam.keySet()){
					
					String val = context.getDataValue("Data", k);
					param.put(k, "showDataDisclaimer".equals(k)?("1".equals(val)):val);
				}
				for(String k : sepParam.keySet()){
					String val = context.getDataValue("Data", k);
					param.put(k, val);
				}
			}
			param.put("ping_url",getContext(getActivity(AUTH_ACT)).getDataValue("Data","aiPrvPingUrl"));
			String url = getContext(getActivity(AUTH_ACT)).getDataValue("Data", COMPLETION_URL_FLD);
			param.put("completion_url",url);
			String key = getContext(getActivity(AUTH_ACT)).getDataValue("Data", "key");
			param.put("api_key", key);
			AITools.setParameters(param);
			
			
		}
			
		super.postValidate(context);
	}

}