package com.simplicite.commons.AIBySimplicite;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;
import java.util.*;


import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.Normalizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.simplicite.util.tools.*;


/**
 * Shared code AITools
 */
public class AITools implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
    
    public static final  Boolean AI_DEBUG_LOGS ="true".equals(Grant.getSystemAdmin().getParameter("AI_DEBUG_LOGS"));
    private static final String AI_PING_ERROR="AI_PING_ERROR";
    private static final String SYSPARAM_AI_API_PARAM="AI_API_PARAM";
    private static final String SYSPARAM_AI_CHAT_BOT_NAME="AI_CHAT_BOT_NAME";
    private static final String SYSPARAM_AI_API_KEY="AI_API_KEY";
    private static final String SYSPARAM_AI_API_URL="AI_API_URL";
    private static final String CLAUDE_LLM ="CLAUDE";
    private static final String HUGGINGFACE_LLM ="HUGGINGFACE";
    private static final String MISTRAL_LLM ="Mistral AI_";
    private static final String AUTH_PREFIX = "Bearer ";
    private static final String AUTH_PROPERTY = "Authorization";

    public static final String CONTENT_KEY = "content";
    private static final String MESSAGE_KEY = "message";
    private static final String MESSAGES_KEY = "messages";
    public static final String USAGE_KEY = "usage";
    private static final String PROVIDER_KEY = "provider";
    private static final String API_KEY = "api_key";
    private static final String MODEL_KEY = "model";
    public static final String ERROR_KEY = "error";
    private static final String LABEL_KEY = "label";
    private static final String BOT_NAME_KEY = "bot_name";
    private static final String COMPLETION_KEY = "completion_url";



    private static final String MAX_TOKEN_PARAM_KEY = "default_max_token";
    private static final String ASSISTANT_ROLE="assistant";
    private static final String SYSTEM_ROLE= "system";
    private static final String HTML_LEFT_COLUMN_ID = "left_column";
    private static final String CALLER_PARAM_SPE ="specialisation";
    private static final String CALLER_PARAM_HISTORIC = "historic";
    private static final String CALLER_PARAM_SECURE = "secure";
    private static final String CALLER_PARAM_SAFE_SPE ="isSafeSpe";
    private static final String CALLER_PARAM_TOKEN ="maxToken";
    
    private static final String MAX_TOKEN = "max_tokens";
    public static final String TYPE_TEXT = "text";
    public static final String TYPE_IMAGE_URL = "image_url";
   
    private static final String TRUSTED = "trusted";
    private static final String SWAGGER_COMPONENTS="components";
    private static final String SWAGGER_SHEMAS="schemas";

	private static final String SYS_CODE = "sys_code";
	private static final String SYS_VAL2 = "sys_value2";
    private static final String DEFAULT_MODULE = "Application";
    private static final String ROW_MLD_ID = "row_module_id";

    public static final String PING_SUCCESS = "200";
    private static final String STT_URL_ERROR = "STT url not set";

    private static  JSONObject aiApiParam =getOptAiApiParam();
    private static final boolean IS_ENV_SETUP =  !Tool.isEmpty(System.getenv(SYSPARAM_AI_API_PARAM));
    private static  int aiHistDepth = aiApiParam.optInt("hist_depth");
    private static  String aiChatBotName = getAIParam(BOT_NAME_KEY, "George");
    private static  String llm = getLLM();
    private static  boolean showDataDisclaimer = aiApiParam.optBoolean("showDataDisclaimer",true);
    private static  String aiProvider = getProvider();
    private static String apiKey = getAIParam(API_KEY);
    private static String completionUrl = getAIParam(COMPLETION_KEY);
    public static class AITypeException extends Exception {
        private static final long serialVersionUID = 1L;
        
        public AITypeException(String object, String classname, String needClass) {
            super("Invalid type for "+object+": "+classname+" need "+needClass);
        }
    }

    private static class AICallerParams {
        private String specialisation;
        private JSONArray prompt;
        private JSONArray historic;
        private JSONObject providerParams;
        private int maxToken = 1500;

        private AICallerParams(Object promptObject,JSONObject params) throws AITypeException{
            boolean secure = params.optBoolean(CALLER_PARAM_SECURE, false);
            boolean isSafeSpe = params.optBoolean(CALLER_PARAM_SAFE_SPE, false);
            setPrompt(promptObject, secure);
            setSpecialisation(params.optString(CALLER_PARAM_SPE),isSafeSpe);
            historic = params.optJSONArray(CALLER_PARAM_HISTORIC, new JSONArray());
            providerParams = params.optJSONObject("providerParams", new JSONObject());
            
            
            if(!Tool.isEmpty(aiApiParam)) {
                maxToken=aiApiParam.getInt(MAX_TOKEN_PARAM_KEY);
            }
            if(params.has(CALLER_PARAM_TOKEN)){
                Object token = params.get(CALLER_PARAM_TOKEN);
                if(token instanceof Integer){
                    maxToken = (int)token;
                }else if(token instanceof Boolean && !(boolean)token){
                    maxToken = 0;
                }
            }
        }
        private void setSpecialisation(String spe,boolean isSafe){
            spe = removeAcent(spe);
            if(!isSafe) spe = JSONObject.quote(normalize(spe,true));
            if("\"\"".equals(spe)) spe = "";
            specialisation = spe;
        }
        private void setPrompt(Object promptObject,boolean isSafe) throws AITypeException{
             //prompt to JSONArray
             if(promptObject instanceof String){
                prompt = new JSONArray();
                String strPrompt = normalize((String)promptObject,isSafe);
                prompt.put(getformatedContentByType(strPrompt,TYPE_TEXT,false));
                 
            }else if(promptObject instanceof JSONArray){
                prompt= (JSONArray)promptObject;
            }else{
               AppLog.info("Prompt must be a String or a JSONArray");
               throw new AITypeException("prompt", promptObject.getClass().getName(), "String or JSONArray");
            }
            prompt = parsedPrompts(prompt,isSafe);
        }
        
        /**
         * Function to format the call to chatAI API.
         * Need the api key parameter set up with your key.
         * Use the aiApiParam hist_depth parameter to limit the number of exchanges in the historic (useful to limit the number off token of requests).
         * @param g Grant
         * @return If API return code is 200: API answer else: error return.
        */
        public JSONObject aiCall(Grant g){
            return new JSONObject( aiCaller(g));
        }
        private String aiCaller(Grant g){
            String model =getAIParam(MODEL_KEY);
            boolean isClaudeAPI = CLAUDE_LLM.equals(llm);
            if(Tool.isEmpty(completionUrl)){
                AppLog.info("completion url not set", g);
                return "";
            }
            try {
                URI url = new URI(completionUrl);
                HttpURLConnection connection = (HttpURLConnection) url.toURL().openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setDoOutput(true);
                addSpecificHeaders(connection,apiKey);
                
                // format data
                JSONObject postData = new JSONObject();
                if(maxToken>0)
                    postData.put(MAX_TOKEN, maxToken);
                if(!Tool.isEmpty(providerParams)){
                    addProviderParamsToPost(postData);
                }
                if(!Tool.isEmpty(model))
                    postData.put(MODEL_KEY, model);
                JSONArray messages = new JSONArray();
                // format specialisation.
                if(!Tool.isEmpty(specialisation))
                    messages.put(new JSONObject().put("role",SYSTEM_ROLE).put(CONTENT_KEY,specialisation));
                // add historic (restrict to Param histDepth the number of messages )
                if(!Tool.isEmpty(historic)){
                    messages.putAll(getCleanHistoric(historic));
                }
                
                
                messages.put(new JSONObject().put("role","user").put(CONTENT_KEY,prompt));
                postData.put(MESSAGES_KEY, messages);
                
                if(HUGGINGFACE_LLM.equals(llm)){
                    postData = getHuggingFormatData(postData);
                }
                if(isClaudeAPI){
                    postData = getClaudeFormatData(postData);
                }
                if(Boolean.TRUE.equals(AI_DEBUG_LOGS)){
                    AppLog.info("post data :"+postData.toString(1),g);
                }
                try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
                    outputStream.writeBytes(postData.toString());
                    outputStream.flush();
                }
                
                int responseCode = connection.getResponseCode();
                if(responseCode!=200){
                    JSONObject error = readError(connection,responseCode,g);
                    return Tool.isEmpty(error)?"":error.toString();
                    
                }
               
               return readResponse(connection,g);
    
                
            } catch (IOException | URISyntaxException e) {
                AppLog.error(e,g);
            }
            return "";
    
        }
        private void addProviderParamsToPost(JSONObject postData){
            for(String key : providerParams.keySet()) {
                Object data = providerParams.get(key);
                if(!Tool.isEmpty(data)){
                    try{
                        float dataFloat = parseFloatParam(data);
                        postData.put(key,dataFloat);
                    }catch(AITypeException e){
                        AppLog.warning(e.getMessage());
                    }       
                }
                
            }
        }
        private static float parseFloatParam(Object param) throws AITypeException {
            if(param instanceof Number)
                return ((Number)param).floatValue();  
            if(param instanceof String)
                return Float.parseFloat((String)param);
            throw new AITypeException("provider parameters",param.getClass().getName(), "number");
    
        }
        private static JSONObject getClaudeFormatData(JSONObject postData){
            JSONArray messages = postData.getJSONArray(MESSAGES_KEY);
            int toremove = -1;
            
            for (int i = 0; i < messages.length(); i++) {
                JSONObject message = messages.getJSONObject(i);
                // Perform your condition here
                if (SYSTEM_ROLE.equals(message.optString("role"))) {
                    String content = message.optString(CONTENT_KEY);
                    postData.put(SYSTEM_ROLE, content);
                    toremove = i;
                    
                }else if("user".equals(message.optString("role")) && !Tool.isEmpty(message.optString(CONTENT_KEY))){// to clomplete
                    JSONArray contentArray = message.optJSONArray(CONTENT_KEY);
                    for(int j = 0; j < contentArray.length(); j++){
                        JSONObject contentJson = contentArray.getJSONObject(j);
                        if(TYPE_IMAGE_URL.equals(contentJson.optString("type"))){
                            refactorImageForClaudeAPI(contentJson);
                        }
                    }
                }
            }
            if(toremove>=0){
                messages.remove(toremove);
            }
            if(!postData.has(MAX_TOKEN)){
                postData.put(MAX_TOKEN,aiApiParam.getInt(MAX_TOKEN_PARAM_KEY));
            }
            return postData;
        }
        private static void refactorImageForClaudeAPI(JSONObject contentJson){
            contentJson.put("type","image");
            String url = contentJson.optJSONObject(TYPE_IMAGE_URL).optString("url");
            contentJson.remove(TYPE_IMAGE_URL);
            JSONObject source = new JSONObject();
            String regexUrl = "data:([\\w\\/]*);(\\w*),(.*)";
            Pattern pattern = Pattern.compile(regexUrl);
            Matcher matcher = pattern.matcher(url);
            if(matcher.matches()){
                source.put("type",matcher.group(2));
                source.put("media_type",matcher.group(1));
                source.put("data",matcher.group(3));
                
            }
            if(!Tool.isEmpty(source)){
                contentJson.put("source",source);
            }
    
        }
        private static JSONObject getHuggingFormatData(JSONObject postData){
            JSONObject newPostData = new JSONObject();
            StringBuilder dialogBuilder = new StringBuilder("");
            JSONObject params = new JSONObject();
            if(postData.has(MAX_TOKEN))
                params.put("max_length",postData.getInt(MAX_TOKEN));
            JSONArray messages = postData.getJSONArray(MESSAGES_KEY);
            for(int i = 0; i < messages.length(); i++){
                JSONObject message = messages.getJSONObject(i);
                String role = message.optString("role","user");
                String content = getContent(message.get(CONTENT_KEY));
                switch (role) {
                    case ASSISTANT_ROLE:
                        dialogBuilder.append("bot: "+content+"\n");
                        break;
                    case SYSTEM_ROLE:
                        if(Tool.isEmpty(content) || "\"\"".equals(content)) break;
                        dialogBuilder.append("context: "+ content+"\n");
                        break;
                    default:
                        dialogBuilder.append(content+"\n");
                        break;
                }
    
            }
            newPostData.put("inputs",dialogBuilder.toString());
            newPostData.put("parameters",params);
            return newPostData;
        }
        private static String getContent(Object contentObj){
            StringBuilder contentBuilder = new StringBuilder("");
            if(contentObj instanceof JSONArray){
                JSONArray arrayContent = (JSONArray)contentObj;
                for(int j = 0; j < arrayContent.length(); j++){
                    JSONObject contentJson = arrayContent.getJSONObject(j);
                    if(contentJson.has(TYPE_TEXT)){
                        contentBuilder.append(contentJson.getString(TYPE_TEXT)+"\n");
                    }
                }
                return contentBuilder.toString();
            }else if(contentObj instanceof String){
                return (String)contentObj;
            }
            return "";
        }
        private static JSONArray getCleanHistoric(JSONArray historic){
            int len = historic.length();
            if( len< aiHistDepth*2){
                return historic;
            }else{
                JSONArray newHistoric = new JSONArray();
                for(int i = len - 2*aiHistDepth; i < len;i++ )
                    newHistoric.put(historic.getJSONObject(i));
                return newHistoric;
            }
        }
        private static JSONArray parsedPrompts(JSONArray prompts, boolean secure){
            JSONArray newPrompts = new JSONArray();
            for(Object p : prompts){
                if(p instanceof JSONObject){
                    JSONObject contentJson = (JSONObject)p;
                    if(!contentJson.optBoolean(TRUSTED,false) && contentJson.has(TYPE_TEXT)){
                        contentJson.put(TYPE_TEXT,JSONObject.quote(normalize(contentJson.getString(TYPE_TEXT),secure)));
                    }
                    if(contentJson.has(TRUSTED)){
                        contentJson.remove(TRUSTED);
                    }
                    newPrompts.put(contentJson);
                }else{
                   newPrompts.put(JSONObject.quote(normalize((String)p)));
                }
            }
            return newPrompts;
        }    
    }
    private static JSONObject getOptAiApiParam(){
        String env = System.getenv(SYSPARAM_AI_API_PARAM);
        if(Tool.isEmpty(env)){
            return getOptAiApiParamByGrant();
        }
        //importDatasets(ModuleDB.getModuleId("AIBySimplicite"));
        return new JSONObject(env);
    }
    public static void importDatasets(String moduleID){
        Grant g = Grant.getSystemAdmin();
		g.addResponsibility("AI_ADMIN");
		ObjectDB obj = g.getTmpObject("AIProvider");
		obj.resetFilters();
		if(obj.search().isEmpty()){
			ObjectDB datasets = g.getTmpObject("Dataset");
			synchronized(datasets.getLock()){
				datasets.resetFilters();
				datasets.setFieldFilter(ROW_MLD_ID, moduleID);
				for(String[] row: datasets.search()){
					datasets.resetFilters();	
					datasets.select(row[datasets.getRowIdFieldIndex()]);
					try {
						datasets.invokeAction("Dataset-apply");
					} catch (ActionException e) {
						AppLog.error(e, g);
					}
				}
			}
		}
    }
    private static JSONObject getOptAiApiParamByGrant(){
        Grant g = Grant.getSystemAdmin();
        if (g.hasParameter(SYSPARAM_AI_API_PARAM)) {
            JSONObject param = new JSONObject(g.getParameter(SYSPARAM_AI_API_PARAM));
            if(g.hasParameter(SYSPARAM_AI_CHAT_BOT_NAME) || g.hasParameter(SYSPARAM_AI_API_KEY) || g.hasParameter(SYSPARAM_AI_API_URL)){
                patchSysParamMerged(param);
            }
            return param;
        }
        JSONObject param = new JSONObject();
        setParameters(param);
        return param;
    }
    private static String getProvider(){
        String provider = getAIParam(PROVIDER_KEY);
        if(Tool.isEmpty(provider)){
            String regex = "\\/\\/([\\w\\.]+)";
            Pattern pattern = Pattern.compile(regex);
            String url = getAIParam(COMPLETION_KEY);
            Matcher matcher = pattern.matcher(url);
            if(matcher.find()){
                provider = matcher.group(1);
            }
            if(!Tool.isEmpty(provider)){
                setParameters(aiApiParam.put(PROVIDER_KEY, provider));   
            }else{
                provider = Grant.getSystemAdmin().T("AI_DEFAULT_PROVIDER_NAME");
            }
        }
        return provider;
    }
    /**
     * This method is used to patch the merged system parameters.
     * It checks if the old AI sysparams style exists and if so, it patches the new AI sysparams.
     * If there are conflicting parameters, the new parameters are preserved.
     * 
     * @param None
     * @return None
     */
    private static boolean patchSysParamMerged(JSONObject param){
        Grant g = Grant.getSystemAdmin();
        if(!Tool.isEmpty(param)){
            //bot name
            checkOldSysParam(SYSPARAM_AI_CHAT_BOT_NAME,BOT_NAME_KEY,param,g);
            
            //api key
            checkOldSysParam(SYSPARAM_AI_API_KEY, API_KEY, param, g);
            //api completion url
            checkOldSysParam(SYSPARAM_AI_API_URL, COMPLETION_KEY, param, g);
            
            setParameters(param);
        }
        return true;
    }
    private static Boolean checkOldSysParam(String name,String paramKey,JSONObject param,Grant g){
        if(IS_ENV_SETUP){
            return false;
        }
        if(g.hasParameter(name)){
            String tmpVal= g.getParameter(name);
            if(!param.has(paramKey)){
                param.put(paramKey,tmpVal);
            }
            ObjectDB paramObj = g.getTmpObject("SystemParam");
            BusinessObjectTool paramTool = paramObj.getTool();
            synchronized(paramObj.getLock()){
                try{
                    List<String[]> parameters = paramTool.search(new JSONObject().put(SYS_CODE,name));
                    if(parameters.size()==1){
                        paramTool.selectForDelete(parameters.get(0)[paramObj.getRowIdFieldIndex()]);
                        paramTool.delete();

                    }
                }catch(GetException | DeleteException | SearchException | JSONException e){
                    AppLog.error(e,g);
                    return false;
                }
                
            }
        }
        return true;

    }
    private static String getLLM(){
        if(aiApiParam.optBoolean("ClaudeAPI", false)) return CLAUDE_LLM;
        if(aiApiParam.optBoolean("HuggingAPI", false)) return HUGGINGFACE_LLM;
        if(MISTRAL_LLM.equals(getAIParam(PROVIDER_KEY))) return MISTRAL_LLM;
        return "GPT";
    }
    private static void reloadAIParams(){
                aiApiParam =getOptAiApiParam();
        aiHistDepth = aiApiParam.optInt("hist_depth");
        aiChatBotName = getAIParam(BOT_NAME_KEY, "George");
        llm = getLLM();
        completionUrl = getAIParam(COMPLETION_KEY);
        showDataDisclaimer = aiApiParam.optBoolean("showDataDisclaimer",true);
        aiProvider = getAIParam(PROVIDER_KEY);
        apiKey = getAIParam(API_KEY);
    }
    private static void addSpecificHeaders(HttpURLConnection connection,String apiKey){
        String projet = getAIParam("OpenAI-Project");
        String org = getAIParam("OpenAI-Organization");
        switch (llm) {
            case CLAUDE_LLM:
                connection.setRequestProperty("x-api-key",apiKey);
                connection.setRequestProperty("anthropic-version","2023-06-01");
                break;
            case HUGGINGFACE_LLM:
                connection.setRequestProperty(AUTH_PROPERTY, AUTH_PREFIX + apiKey);
                break;
            default:
                connection.setRequestProperty(AUTH_PROPERTY, AUTH_PREFIX + apiKey);
                if(!Tool.isEmpty(projet) && !Tool.isEmpty(org)){
                    connection.setRequestProperty("OpenAI-Project", projet);
                    connection.setRequestProperty("OpenAI-Organization", org);
                }
                break;
        }
    }

    /**
     * Reads the error response from an HTTP connection and returns a formatted error message.
     *
     * @param connection The HttpURLConnection object representing the connection.
     * @param responseCode The HTTP response code.
     * @param g The Grant object.
     * @return A JSON-formatted error message containing the response code and error message.
     */
    private static JSONObject readError(HttpURLConnection connection,int responseCode,Grant g){
        try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getErrorStream()))) {
            String line;
            StringBuilder response = new StringBuilder();

            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            JSONObject errorMessage = formatErrorMsg(responseCode,response);
            AppLog.info("AI API error :["+responseCode+"]: "+errorMessage.getString(ERROR_KEY),g);
            connection.disconnect();
            
            return errorMessage;

        } catch (IOException e) {
            AppLog.error(e,g);
        }
        connection.disconnect();
        return null;
    }
    private static JSONObject formatErrorMsg(int responseCode,StringBuilder response ){
        String errorMessage;
        try{
            JSONObject error = new JSONObject(response.toString());

            errorMessage = error.optJSONObject(ERROR_KEY,new JSONObject()).optString(MESSAGE_KEY,response.toString());
        }catch(JSONException e){
            errorMessage = response.toString();
        }
        return new JSONObject().put("code",String.valueOf(responseCode)).put(ERROR_KEY,errorMessage);
    }
    /**
     * Reads the response from an HTTP connection and returns it as a string.
     *
     * @param connection the HTTP connection to read the response from
     * @param g the Grant object for logging errors
     * @return the response from the HTTP connection as a string
     */
    public static String readResponse(HttpURLConnection connection,Grant g){
        try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            String line;
            StringBuilder response = new StringBuilder();

            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            connection.disconnect();
            String res = response.toString();
            JSONObject resJson = refactorAiResponseInGPT(res);
            if(resJson.has(USAGE_KEY )){
                AppLog.info("AI used token :"+resJson.optJSONObject(USAGE_KEY).toString(1), g);
            }
            return resJson.toString();
        } catch (IOException e) {
            AppLog.error(e,g);
        }
        connection.disconnect();
        return "";
    }
    private static JSONArray optJSONArray(String array){
        try{
            return new JSONArray(array);
        }catch(Exception e){
            return new JSONArray();
        }
    }
    /**
     * call aiCaller with default value
     * @param g
     * @param specialisation
     * @param prompt
     * @return
     */
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, boolean maxToken){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                                .put(CALLER_PARAM_TOKEN,maxToken);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, boolean maxToken,boolean secure){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                                .put(CALLER_PARAM_TOKEN,maxToken)
                                                .put(CALLER_PARAM_SECURE, secure);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, boolean maxToken,boolean secure,boolean isSafeSpe){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                                .put(CALLER_PARAM_TOKEN,maxToken)
                                                .put(CALLER_PARAM_SECURE, secure)
                                                .put(CALLER_PARAM_SAFE_SPE,isSafeSpe);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                                .put(CALLER_PARAM_TOKEN,maxToken)
                                                .put(CALLER_PARAM_HISTORIC,historic);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken,boolean secure){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                                .put(CALLER_PARAM_TOKEN,maxToken)
                                                .put(CALLER_PARAM_HISTORIC,historic)
                                                .put(CALLER_PARAM_SECURE, secure);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken,boolean secure,boolean isSafeSpe){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                                .put(CALLER_PARAM_TOKEN,maxToken)
                                                .put(CALLER_PARAM_HISTORIC, historic)
                                                .put(CALLER_PARAM_SECURE,secure)
                                                .put(CALLER_PARAM_SAFE_SPE,isSafeSpe);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }

    }
    public static JSONObject aiCaller(Grant g, String specialisation, JSONArray historic, Object prompt){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                            .put(CALLER_PARAM_HISTORIC, historic);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }
    public static JSONObject aiCaller(Grant g, String specialisation, JSONArray historic,JSONObject providerParams ,Object prompt){
        AppLog.info("ai coller with provider: "+providerParams.toString(1));
        
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                            .put(CALLER_PARAM_HISTORIC, historic)
                                            .put("providerParams", providerParams);
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }

	/**
     * call aiCaller with specification for code usable in Simplicité.
	 * @param g
	 * @param prompt
	 * @param historic
	 * @return
	 */
	public static JSONObject aiCodeHelper(Grant g, String prompt,JSONArray historic){
        try{
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, "you are java expert, optimize your function, answer only function")
                                                .put(CALLER_PARAM_HISTORIC, historic)
                                                .put(CALLER_PARAM_TOKEN, aiApiParam.getInt("code_max_token"));
            AICallerParams caller = new AICallerParams(prompt,params);
            return caller.aiCall(g);
        }catch (AITypeException e){
            AppLog.error(e,g);
            return new JSONObject();
        }
    }

    /**
     * Format an exchange to AI API format.
     * @param prompt
     * @param response
     * @return JSONArray with both JSONObject of exchange
     */
    public static JSONArray formatMessageHistoric(String prompt, String response){
        JSONArray messages = new JSONArray();
        messages.put(new JSONObject().put("role","user").put(CONTENT_KEY,normalize(prompt)));
        messages.put(new JSONObject().put("role",ASSISTANT_ROLE).put(CONTENT_KEY,normalize(response)));
        return messages;

    }
    public static JSONObject formatMessageHistoric(JSONObject json){
        if(json.has(TRUSTED)){
            json.remove(TRUSTED);
            return json;
        } 

        JSONArray contentArray = json.optJSONArray(CONTENT_KEY);
        if(!Tool.isEmpty(contentArray)){
            JSONArray newContentArray = new JSONArray();
            for(Object o: contentArray){
                JSONObject contentJson = (JSONObject)o;
                if(contentJson.has(TYPE_TEXT)){
                    contentJson.put(TYPE_TEXT,normalize(contentJson.getString(TYPE_TEXT)));
                }
                newContentArray.put(contentJson);
            }
            json.put(CONTENT_KEY,newContentArray);
        }else{
            json.put(CONTENT_KEY,normalize( json.getString(CONTENT_KEY)));
        }
        
        return json;
    }
    public static Message checkJson(String json){
		if (Tool.isEmpty(json)){
			Message m = new Message();
			m.raiseError(Message.formatError("AI_JSON_EMPTY_ERROR",null, null));
			return m;
		}
		JSONObject jsonObject = AITools.getValidJson(json);
		if(Tool.isEmpty(jsonObject)){
			Message m = new Message();
			m.raiseError(Message.formatError("AI_JSON_ERROR",null, null));
			return m;
		}
		return null;
	}
    /**
     * Format a NotePad Field to a AI Format Historic Array
     * @param data notepad value (old value to not consider the actual ask)
     * @return
     */
    public static JSONArray formatMessageHistoricFromNotePad(String data, String trigger){
		Pattern p = Pattern.compile("\\[.{4}\\-.{2}\\-.{2} .{2}\\:.{2} - (.+)\\]");
		JSONArray notePad = new JSONArray();
		JSONObject text = new JSONObject();
		String note="";
		for(String l : data.split("\n")){
			Matcher m =p.matcher(l);
			if(m.matches()){
				
				if (text.has("role")){//if note first line
					parseText(note, trigger, text, notePad);
                    text= new JSONObject();
                        
					
				}
				note="";
                if("ChatAI".equals(m.group(1))){
				    text.put("role",ASSISTANT_ROLE);// see AI doc
                }else{
                    text.put("role","user");// see AI doc
                }


			}else{
				StringBuilder noteBuilder = new StringBuilder(note);
                noteBuilder.append(l).append("\n");
                note = noteBuilder.toString();
			}
				
		}
        if (text.has("role")){
            parseText(note,trigger,text,notePad);
		}
       
        
		return invertJsonArray(notePad);
	}
    private static void parseText(String note,String trigger,JSONObject text,JSONArray notePad){
        Pattern pTrigger=Pattern.compile("(?i)^"+trigger+"((?:.|\\s)+)");
        if("\n\n".equals(note.length()>2 ? note.substring(note.length() - 2):note))
            note = note.length()>2 ? note.substring(0,note.length() - 2):"";

        //if user role and trigger ignore msg without trigger.
        if("user".equals(text.getString("role")) && !Tool.isEmpty(trigger)){
            Matcher mTrigger = pTrigger.matcher(note);
            if (mTrigger.matches()){
                text.put(CONTENT_KEY, normalize(mTrigger.group(1)));
		        notePad.put(text);
            }
        }else{
            text.put(CONTENT_KEY, normalize(note));
		    notePad.put(text);
        }
    }
    private static String normalize(String text){
        text = removeAcent(text);
        text = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^\\w\\(\\),`{}.\\[\\]\"@\\/:-]", " ");
        text = replaceSymboleBySafeHTML(text);
        return  text;
    }
    public static String normalize(String text, boolean secure){
        text = removeAcent(text);
        return secure?Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^\\w\\(\\),`{}.\\[\\]\"@\\/:-]", " "):normalize(text);
    }
    public static String removeAcent(String text){
        text = text.replaceAll("(?u)[éèêë]", "e")
                .replaceAll("(?u)[àâä]","a" )
                .replaceAll("(?u)[îï]", "i")
                .replaceAll("(?u)[ôö]", "o")
                .replaceAll("(?u)[ùûü]", "u")
                .replaceAll("(?u)æ","ae")
                .replaceAll("(?u)œ","oe");
        text = Pattern.compile("(?u)ç",Pattern.CANON_EQ).matcher(text).replaceAll("c");
        text = Pattern.compile("(?u)ÿ",Pattern.CANON_EQ).matcher(text).replaceAll("y");
        return text;
                    
                    
    }
    private static String replaceSymboleBySafeHTML(String text){
        text = text.replace("\\n", "<br>")
            .replace("\\{", "&#123;")
            .replace("\\}", "&#125;")
            .replace("\\(", "&#40;")
            .replace("\\)", "&#41;")
            .replace("\\[", "&#91;")
            .replace("\\]", "&#93;")
            .replace("\\.", "&#46;")
            .replace("\\,", "&#44;")
            .replace("\\`", "&#96;")
            .replace("\\\"", "&#34;")
            .replace("\\@", "&#64;")
            .replace("\\/", "&#47;")
            .replace("\\-", "&#45;");
        return text;
    }
    /**
     * reverse the historic array to have the exchange in the correct order
     * @param arr
     * @return
     */
    private static JSONArray invertJsonArray(JSONArray arr){
        JSONArray result = new JSONArray();
        int len = arr.length();
        for(int i=0; i<len; i++){
            result.put(arr.get(len-(i+1)));
        }
        return result;
    } 
    public static JSONObject actionAiCaller(Grant g, String specialisation, String prompt){
        
        return aiCaller(g, specialisation,prompt);
    }
    public static JSONObject actionAiCaller(Grant g, String specialisation, String prompt,ObjectDB obj){
         try {
            String parsedPrompt = parseExpresion(prompt,obj);
            return aiCaller(g, specialisation,parsedPrompt);
         } catch (ScriptException e) {
            AppLog.error(e, g);
            return new JSONObject();
        }
        
    }
    //Call AI whith parsed expretion
    public static JSONObject expresionAiCaller(Grant g, String specialisation, String prompt,ObjectDB obj){
        try {
            String parsedPrompt = parseExpresion(prompt,obj);
            JSONObject params =  new JSONObject().put(CALLER_PARAM_SPE, specialisation)
                                            .put(CALLER_PARAM_TOKEN, 3500);
            AICallerParams caller = new AICallerParams(parsedPrompt,params);
            return caller.aiCall(g);
         } catch (ScriptException | AITypeException e) {
            AppLog.error(e, g);
            return new JSONObject();
        }
        
    }
    public static String parseExpresion(String prompt,ObjectDB obj) throws ScriptException{
        String regex="(\\[[^\\[\\]]*\\])";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(prompt);

        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String match = matcher.group();
            String replacement = match;
            Object evalExp=obj.prepareExpression(match, null, true, false);
    
            if(evalExp instanceof String){
                replacement = (String) evalExp;
            }
            
            matcher.appendReplacement(sb, replacement);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    public static List<String> getJSONBlock(String txt, Grant g){
		List<String> list = new ArrayList<>(); 
		String regex = "^([^{}]*)(?:```)?(?:json)?\\s*(\\{[^`]+\\})(?:```)?([^}]*)$";//To check
        if(!txt.matches("[\\s\\S]*\\{[\\s\\S]*\\}[\\s\\S]*")){
            return list;
        }
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(txt);
        

        try {
            if (matcher.find()) {
                
                list.add(matcher.group(1).replaceAll("(?:```)?(?:json)?",""));
                list.add(matcher.group(2));
                list.add(matcher.group(3).replaceAll("(?:```)?(?:json)?",""));
            }
        } catch (Exception e) {
            AppLog.error(e, g);
        }
                return list ;
	}
	public static boolean isValidJson(String json){
		try {
			new JSONObject(json);

		} catch (Exception e) {
            return false;
		}
		return true;
	}
    public static JSONObject getValidJson(String json){
        json =json.replace("...","");
        JSONObject res = null;
		try {
            res = new JSONObject(json);
		} catch (Exception e) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> map = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
                res = new JSONObject(map);
            } catch (Exception e2) {
                try {
                    json = removeComments(json);
                    res = new JSONObject(json);
                } catch (Exception e3) {
                    return null;
                }
            }
		}
		return res;
	}
    private static String removeComments(String json) {
        return json.replaceAll("\\/\\/[^\"]*?([\\]\"\\}\\n])", "$1");
    }
    /**
	 * Removes the elements from the given list that are not creatable based on the provided name index and grant.
	 * 
	 * @param list The list of elements to filter.
	 * @param nameIndex The index of the name field in each element of the list.
	 * @param g The grant object containing the creatable information.
	 * @return The filtered list containing only the creatable elements.
	 */
	private static List<String[]> removeNotCreatable(List<String[]> list,int nameIndex, Grant g){
		Map<String, String> creatables = g.getCreatable();
		List<String[]> res = new ArrayList<>();
		for(String[] row : list){
			if("Y".equals(creatables.getOrDefault(row[nameIndex],"N"))){
				res.add(row);
			}
		}
		return res;

	}
   /**
	 * Retrieves the object IDs for a given module.
	 * 
	 * @param moduleName the name of the module
	 * @param g the Grant object
	 * @return an array of object IDs
	 * @throws PlatformException if the module is unknown
	 */
	public static String[] getObjectIdsModule(String moduleName, Grant g) throws PlatformException{
		
		String mdlId = ModuleDB.getModuleId(moduleName);
		if(Tool.isEmpty(mdlId))throw new PlatformException("Unknow module: \n"+moduleName);
		ObjectDB objI = g.getTmpObject("ObjectInternal");
		int idIndex =objI.getRowIdFieldIndex();
		int nameIndex =objI.getFieldIndex("obo_name");
		String[]ids;
		synchronized(objI.getLock()){
			objI.resetFilters();
			objI.setFieldFilter(ROW_MLD_ID, mdlId);
			List<String[]> objIs = removeNotCreatable(objI.search(),nameIndex, g);
			ids = new String[objIs.size()];
			
			int begin = 0;
			int end = objIs.size()-1;
			for(String[] row : objIs){
				ObjectDB obj = g.getTmpObject(row[nameIndex]);
				
				if(Tool.isEmpty(obj.getRefObjects())){// process first the object without ref to empty ref
					ids[begin] = row[idIndex];
					begin++;
				}else{
					ids[end] = row[idIndex];
					end--;
				}
				
				
			}
		}
		return ids;
		
	}
    public static JSONObject getSimplifyedSwagger(String moduleName,Grant g) throws PlatformException {
        String[] ids = getObjectIdsModule(moduleName, Grant.getSystemAdmin());
		String mdlId = ModuleDB.getModuleId(moduleName);

		ObjectDB obj = g.getTmpObject("Module");
        synchronized(obj.getLock()){
            obj.resetFilters();
            obj.select(mdlId);
            ModuleDB module = new ModuleDB(obj);
            JSONObject swagger = new JSONObject(module.openAPI(JSONTool.OPENAPI_OAS3,true));
            JSONObject newSchemas = new JSONObject();
            JSONObject schemas = swagger.getJSONObject(SWAGGER_COMPONENTS).getJSONObject(SWAGGER_SHEMAS);
            for(String id : ids){
                String name = ObjectCore.getObjectName(id);
                newSchemas.put(name, checkFields(schemas.optJSONObject(name), name,g));
            }
            return new JSONObject().put(SWAGGER_COMPONENTS,new JSONObject().put(SWAGGER_SHEMAS,newSchemas)); 
        }
    }

    public static JSONObject checkFields(JSONObject obj, String name, Grant g) {
        if(Tool.isEmpty(obj)) return obj;
        ObjectDB objDB = g.getTmpObject(name);
        JSONObject properties = obj.getJSONObject("properties");
        for (String key : properties.keySet()) {
            JSONObject val = properties.getJSONObject(key);
            ObjectField fld;
            fld = objDB.getField(key.replace("__", "."));
            if (val.has("enum")) {
                JSONArray enumCodes = new JSONArray();
                for (EnumItem eItem : fld.getList().getAllItems()) {
                    enumCodes.put(new JSONObject().put("code",eItem.getCode()).put(LABEL_KEY, eItem.getValue().replace(" ", "_")));
                }
                val.put("enum", enumCodes);
            }
        }
        return obj;
    }
    public static JSONObject getSwagger(String moduleName,Grant g) throws PlatformException {
		String[] ids = getObjectIdsModule(moduleName, Grant.getSystemAdmin());
		String mdlId = ModuleDB.getModuleId(moduleName);
		ObjectDB obj = g.getTmpObject("Module");
		obj.select(mdlId);
		ModuleDB module = new ModuleDB(obj);
		JSONObject swagger = new JSONObject(module.openAPI(JSONTool.OPENAPI_OAS3,true));
		JSONObject newSchemas = new JSONObject();
		JSONObject schemas = swagger.getJSONObject(SWAGGER_COMPONENTS).getJSONObject(SWAGGER_SHEMAS);
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			newSchemas.put(name, new JSONObject(schemas.getJSONObject(name).toString()));
		}
        
		swagger.getJSONObject(SWAGGER_COMPONENTS).put(SWAGGER_SHEMAS, newSchemas);
		JSONObject paths = swagger.getJSONObject("paths");
		JSONObject newPaths = new JSONObject();
		for(String key : paths.keySet()){
			if(key.matches(".*\\{row_id\\}")) {
				Object get = paths.getJSONObject(key).get("get");
				newPaths.put(key, new JSONObject().put("get", get));
			}else{
				newPaths.put(key, paths.getJSONObject(key));
			}
		}
		swagger.put("paths", newPaths);
		return swagger;
	}	
    public static JSONObject getformatedContentByType(String content,String type,boolean trusted){
        return getformatedContentByType(content,type,trusted,null);
    }
    public static JSONObject getformatedContentByType(String content,String type,boolean trusted,String detail){
        JSONObject res = new JSONObject();
        switch (type) {
            case TYPE_TEXT:
                res.put("type",TYPE_TEXT);
                res.put(type,content);
                if(trusted) res.put(TRUSTED,trusted);
                break;
            case TYPE_IMAGE_URL:
                res.put("type",TYPE_IMAGE_URL);
                JSONObject image = new JSONObject().put("url",content);
                if(!Tool.isEmpty(detail)){
                    image.put("detail",detail);
                }
                res.put(type,image);
                break;
            default:
               return null;
        }
        return res;
    }
    public static String getDataDisclaimer(Grant g){
        if (showDataDisclaimer){
            return g.T("AI_DISCLAIMER_DATA").replace("[PROVIDER]", aiProvider);
        }
        return "";
    }
    public static String createOrUpdateWithJson(String objName,JSONObject fields, Grant g){
		JSONObject filters = getFKFilters(objName,fields, g);
		ObjectDB obj = g.getTmpObject(objName);
		try{
			synchronized(obj.getLock()){
				BusinessObjectTool objTool = obj.getTool();
				if(!objTool.selectForCreateOrUpdate(filters)){
					obj.setValuesFromJSONObject(fields, false, false,true);
					obj.populate(true);
					objTool.validateAndCreate();
				}
			}
			return obj.getRowId();
		}catch(GetException | ValidateException | SaveException e){
			AppLog.error(null, e, g);
		}
		
		return "0";
	}
	private static JSONObject getFKFilters(String objName,JSONObject fields, Grant g){
		JSONObject filters = new JSONObject();
		ObjectDB obj = g.getTmpObject(objName);
		synchronized(obj.getLock()){
			for(ObjectField fk : obj.getFunctId()){
				String name = fk.getName();
				if("map_order".equals(name)){//to avoid duplicate object in domain
					continue;
				}
				if(fields.has(name) && !fields.isNull(name)){
					filters.put(name, fields.get(name));
				}
			}
		}
		
		return filters;
	}
    private static JSONObject refactorAiResponseInGPT(String res){
        String resultText = "";
        switch (llm) {
            case "HUUGINGFACE":
                JSONArray resArray = optJSONArray(res);
                resultText = resArray.optJSONObject(0).getString("generated_text");
                return formatJsonOpenAIFormat(resultText);
            case CLAUDE_LLM:
                JSONObject resJson = new JSONObject(res);
                resultText = resJson.getJSONArray(CONTENT_KEY).getJSONObject(0).getString("text");
                JSONObject gptFormat = formatJsonOpenAIFormat(resultText);
                gptFormat.put(USAGE_KEY,resJson.optJSONObject(USAGE_KEY));
                return gptFormat;
        
            default:
                return new JSONObject(res);
        }
    }
    public static String parseJsonResponse(JSONObject res){
        if(Boolean.TRUE.equals(AI_DEBUG_LOGS))AppLog.info("AI response :"+res.toString(1),Grant.getSystemAdmin());
        return res.optJSONArray("choices",new JSONArray()).optJSONObject(0,new JSONObject()).optJSONObject(MESSAGE_KEY,new JSONObject()).optString(CONTENT_KEY,"");
    }
    public static JSONObject formatJsonOpenAIFormat(String result){
        return new JSONObject().put("choices",new JSONArray().put(new JSONObject().put(MESSAGE_KEY,new JSONObject().put(CONTENT_KEY,result))));
    }
    public static String pingAI(){
        Grant g = Grant.getSystemAdmin();
        String apiUrl = getAIParam("ping_url");
        if(Tool.isEmpty(apiUrl)){
            AppLog.info("ping url not set", g);
            return Message.formatWarning("AI_NO_PING_URL",null,null);
        }
        try {
            URI url = new URI(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.toURL().openConnection();
            connection.setRequestMethod("GET");
            addSpecificHeaders(connection,apiKey);
            connection.connect();
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                return PING_SUCCESS;
            }else{
                JSONObject error = readError(connection,responseCode,g);
                if(Tool.isEmpty(error))
                    return Message.formatError(AI_PING_ERROR,null,null);
                return Message.formatError(AI_PING_ERROR,error.optString("code")+": "+error.optString(ERROR_KEY),null);
            }
        } catch (IOException | URISyntaxException e) {
            AppLog.error(e,g);
            return Message.formatError(AI_PING_ERROR,e.getMessage(),null);
        }
       

        
    }
    public static List<String> getModels(String url,String apiKey,Grant g) throws IOException, URISyntaxException{
        URI apiUrl = new URI(url);
        HttpURLConnection connection = (HttpURLConnection) apiUrl.toURL().openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty(AUTH_PROPERTY, AUTH_PREFIX + apiKey);
        ArrayList<String> res = new ArrayList<>();
        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            JSONObject resJson = new JSONObject(response.toString());
            for(Object model : resJson.optJSONArray("data")){
                JSONObject jsonModel = (JSONObject)model;
                if(jsonModel.has("id") && MODEL_KEY.equals(jsonModel.optString("object"))){
                    res.add(jsonModel.getString("id"));
                }
            }

        } else {
            JSONObject error = readError(connection,responseCode,g);
        
            res.add(ERROR_KEY);
            if(Tool.isEmpty(error)) error = new JSONObject();
            res.add(error.optString("code")+": "+error.optString(ERROR_KEY));
            

        }
        connection.disconnect();
        return res;
    }
    public static void setParameters(JSONObject setting){
        if (IS_ENV_SETUP){
            return;
        }
        Grant g = Grant.getSystemAdmin();
        ObjectDB paramObj = g.getTmpObject("SystemParam");
		BusinessObjectTool paramTool = paramObj.getTool();
		synchronized(paramObj.getLock()){
			try {
				if(!paramTool.selectForUpsert(new JSONObject().put(SYS_CODE, SYSPARAM_AI_API_PARAM))){
					paramObj.setFieldValue(SYS_CODE, SYSPARAM_AI_API_PARAM);
					paramObj.setFieldValue("sys_value", "{}");
                    paramObj.setFieldValue("sys_type", "PRV");
					paramObj.setFieldValue(ROW_MLD_ID,ModuleDB.getModuleId(DEFAULT_MODULE));
				}
                if(!Tool.isEmpty(setting)) paramObj.setFieldValue(SYS_VAL2, setting.toString(1));
				paramTool.validateAndSave();
			} catch (GetException | JSONException | ValidateException | SaveException e) {
				AppLog.error( e, g);

			}
		}
        SystemParameters.clearCache();
        if(!Tool.isEmpty(setting)) reloadAIParams();
    }
    public static boolean isAIParam(){
        return isAIParam(true);
    }
    public static boolean isAIParam(boolean checkPing){
    	String ping = "";
        if(checkPing) ping = pingAI();
        return !(Tool.isEmpty(aiApiParam)|| Tool.isEmpty(completionUrl) || (checkPing && (!"/".equals(aiApiParam.optString("ping_url","/")) && !PING_SUCCESS.equals(ping))));
    }
    public static String getBotName(){
        return aiChatBotName;
    }
    public static int getHistDepth(){
        return aiHistDepth;
    }
    public static boolean checkSpeechRecognition(){
        if(Tool.isEmpty(getAIParam("stt_url"))){
            AppLog.info(STT_URL_ERROR,Grant.getSystemAdmin());
            AppLog.info(STT_URL_ERROR);
            return false;
        }
        return true;
    }
    public static String speechToText(String audioBase64){
        Grant g = Grant.getSystemAdmin();
        String apiUrl = getAIParam("stt_url");
        if(Tool.isEmpty(apiUrl)){
            AppLog.info(STT_URL_ERROR, g);
            return Message.formatWarning("Speach to text not set",null,null);
        }
        try{
            URI url = new URI(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.toURL().openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty(AUTH_PROPERTY, AUTH_PREFIX + apiKey);
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=---Boundary");
            connection.setDoOutput(true);

            // Convertir la chaîne Base64 en octets (décodage)
            byte[] audioBytes = Base64.getDecoder().decode(audioBase64);

            // Préparer le corps de la requête multipart/form-data
            try (DataOutputStream request = new DataOutputStream(connection.getOutputStream())) {
                String boundary = "---Boundary";

                // Ajout du fichier audio
                request.writeBytes("--" + boundary + "\r\n");
                request.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"audio.webm\"\r\n");
                request.writeBytes("Content-Type: audio/webm\r\n\r\n");
                request.write(audioBytes); // Écrire les octets du fichier audio
                request.writeBytes("\r\n");

                // Ajout du modèle "whisper-1"
                request.writeBytes("--" + boundary + "\r\n");
                request.writeBytes("Content-Disposition: form-data; name=\"model\"\r\n\r\n");
                request.writeBytes("whisper-1\r\n");

                // Ajout de la langue
                request.writeBytes("--" + boundary + "\r\n");
                request.writeBytes("Content-Disposition: form-data; name=\"language\"\r\n\r\n");
                request.writeBytes("fr\r\n");

                // Fin du multipart/form-data
                request.writeBytes("--" + boundary + "--\r\n");
                
                request.flush();
            }
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                return  readResponse(connection, g);
               
            }else{
                JSONObject error = readError(connection,responseCode,g);
                if(Tool.isEmpty(error))
                    return Message.formatError(AI_PING_ERROR,null,null);
                return Message.formatError(AI_PING_ERROR,error.optString("code")+": "+error.optString(ERROR_KEY),null);
            }
        }catch (IOException | URISyntaxException e) {
            AppLog.error(e,g);
            return Message.formatError(AI_PING_ERROR,e.getMessage(),null);
        }
    }
    public static JSONObject getParameters(boolean forDisplay,String lang){
        JSONObject params = new JSONObject(aiApiParam,JSONObject.getNames(aiApiParam));
        if(!forDisplay) return params;
        JSONObject defaultParam = new JSONObject(Grant.getSystemAdmin().T("AI_DEFAULT_PARAM"));
        JSONArray specificParam = new JSONArray();
        JSONObject newParam = new JSONObject();
        JSONArray leftColumn = new JSONArray();
        JSONArray rightColumn = new JSONArray();
        for(String key: params.keySet()){
            if(API_KEY.equals(key)) continue;
            if(defaultParam.has(key)){
                JSONObject data = new JSONObject().put("field", key).put("value", getDisplayField(key,params.get(key),defaultParam.optJSONObject(key))).put(LABEL_KEY, optLabel(key,defaultParam,lang));
                if(defaultParam.optJSONObject(key).optBoolean(HTML_LEFT_COLUMN_ID)){
                    leftColumn.put(data);
                }else{
                    rightColumn.put(data);
                }
            }else{

                specificParam.put(new JSONObject().put("key", key).put("value", checkPrivate(params,key)));
            }
        }
        newParam.put("columns", new JSONArray()
                                .put(new JSONObject().put("class",HTML_LEFT_COLUMN_ID).put("fields", leftColumn))
                                .put(new JSONObject().put("class","right_column").put("fields", rightColumn))
        );
        newParam.put(PROVIDER_KEY, aiProvider);
        newParam.put("providerFields", specificParam);
        newParam.put("isConfigurable",isConfigurable());
        return newParam;
    }
    private static Object checkPrivate(JSONObject params, String key){
        if(!params.has(PROVIDER_KEY)) return params.get(key);
        Grant g = Grant.getSystemAdmin();
		g.addResponsibility("AI_ADMIN");
		ObjectDB obj = g.getTmpObject("AIProvider");
        synchronized(obj.getLock()){
            obj.setFieldFilter("aiPrvProvider",params.getString(PROVIDER_KEY));
            List<String[]> res = obj.search();
            if(!res.isEmpty()){
                JSONObject defParams = new JSONObject(res.get(0)[obj.getFieldIndex("aiPrvDataModel")]);
                if(defParams.has(key) && defParams.getJSONObject(key).optBoolean("private",false)){
                    return "********";   
                }
            }
        }
        return params.has(key)?params.get(key):null;
    }
    public static String getAIParam(String key){
        return getAIParam(key,"");
    }
    public static String getAIParam(String key,String defaultValue){
        return aiApiParam.optString(key,defaultValue);
    }
    public static Object getAIParam(String key,Object defaultValue){
        return aiApiParam.has(key)?aiApiParam.get(key):defaultValue;
    }
    public static JSONObject getCurrentParams(JSONObject defaultParams){
        JSONObject params = new JSONObject();
        List<String> notCopyField= Arrays.asList(API_KEY,PROVIDER_KEY);
        for(String k : defaultParams.keySet()){
            Object field = defaultParams.get(k);
            String defaultValue = field instanceof JSONObject?((JSONObject)field).optString("defaultValue"):field.toString();
            if(!notCopyField.contains(k)){
                params.put(k,getAIParam(k,defaultValue));
            }else{
                params.put(k,defaultValue);
            }
        }
        return params;
    }
    private static String getDisplayField(String key, Object value,JSONObject defaultField){
        if(defaultField.optBoolean("private",false)) return "********";
        switch(defaultField.optString("type")){
            case "boolean":
                return (boolean)value?"Yes":"No";
            case "url":
                return "<a id=\""+key+"\" href=\""+value+"\">"+value+"</a>";
            default:
                return value.toString();

        }
    }
    public static String optLabel(String key,JSONObject defaultFields,String lang){
		JSONObject fieldDefLabel = defaultFields.optJSONObject(key,new JSONObject()).optJSONObject(LABEL_KEY);
		if(Tool.isEmpty(fieldDefLabel)) return key.replaceAll("[_-]", " ");
		if(!fieldDefLabel.has(lang)) lang = "ENU";
		String label = fieldDefLabel.optString(lang);
		return  (Tool.isEmpty(fieldDefLabel)?key.replaceAll("[_-]", " "):label);
	}
    public static boolean isConfigurable(){
        return !IS_ENV_SETUP;
    }

    public static String provider(){
        AppLog.info(aiProvider);
        return aiProvider;
    }
}