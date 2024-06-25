package com.simplicite.commons.AIBySimplicite;

import org.json.JSONArray;
import org.json.JSONObject;
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
    private static final JSONObject AI_API_PARAM = Grant.getSystemAdmin().getJSONObjectParameter("AI_API_PARAM");
    private static final String CONTENT_KEY = "content";
    private static final String MAX_TOKEN_PARAM_KEY = "default_max_token";
    private static final String ASSISTANT_ROLE="assistant";
    private static final String MAX_TOKEN = "max_tokens";
    public static final String TYPE_TEXT = "text";
    public static final String TYPE_IMAGE_URL = "image_url";
    private static final boolean SHOW_DATA_DISCLAIMER = AI_API_PARAM.optBoolean("showDataDisclaimer",true);
    private static final String AI_PROVIDER = AI_API_PARAM.optString("provider");
    private static final String TRUSTED = "trusted";
    private static final String SWAGGER_COMPONENTS="components";
    private static final String SWAGGER_SHEMAS="schemas";
    
	/**
     * Function to format the call to chatAI API.
     * Need the AI_API_KEY parameter set up with your key.
     * Use the AI_API_PARAM hist_depth parameter to limit the number of exchanges in the historic (useful to limit the number off token of requests).
	 * @param g Grant
	 * @param specialisation Prompt to specialise chatbot (ex: You're a java developer).
	 * @param prompt 
	 * @param historic exchange historic for contextual response
	 * @param maxToken number of tokens allow in response
	 * @return If API return code is 200: API answer else: error return.
	 */
    private static String aiCaller(Grant g, String specialisation, Object prompt ,JSONArray historic, boolean secure, int maxToken){
        return aiCaller(g, specialisation, prompt,historic,secure,false,maxToken);
    }
    
    private static String aiCaller(Grant g, String specialisation, Object prompt ,JSONArray historic, boolean secure,boolean isSafeSpe, int maxToken){
        JSONArray arrayPrompt = new JSONArray();
       if(prompt instanceof String){
            String strPrompt = normalize((String)prompt,secure);
            arrayPrompt.put(getformatedContentByType(strPrompt,TYPE_TEXT,false));
            
        }else if(prompt instanceof JSONArray){
            arrayPrompt= (JSONArray)prompt;
        }else{
            AppLog.info("Prompt must be a String or a JSONArray",g);
            return "";
        }
        return aiCaller(g, specialisation,arrayPrompt,historic,secure,isSafeSpe,maxToken);
    }
	private static String aiCaller(Grant g, String specialisation, JSONArray prompt ,JSONArray historic, boolean secure,boolean isSafeSpe, int maxToken){
        specialisation = removeAcent(specialisation);
        if(!isSafeSpe) specialisation = JSONObject.quote(normalize(specialisation,true));

        prompt = parsedPrompts(prompt,secure);
        int histDepth = AI_API_PARAM.getInt("hist_depth");
		String apiKey = Grant.getSystemAdmin().getParameter("AI_API_KEY");
        String apiUrl = Grant.getSystemAdmin().getParameter("AI_API_URL");
        String model =AI_API_PARAM.optString("model","");
        String projet = AI_API_PARAM.optString("OpenAI-Project","");
        String org = AI_API_PARAM.optString("OpenAI-Organization","");
        if("/".equals(apiUrl)){
            AppLog.info("AI_API_URL not set", g);
            return "";
        }
        if("/".equals(apiKey))apiKey = "";
       
        try {
            URI url = new URI(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.toURL().openConnection();

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            if(!Tool.isEmpty(projet) && !Tool.isEmpty(org)){
                connection.setRequestProperty("OpenAI-Project", projet);
                connection.setRequestProperty("OpenAI-Organization", org);
            }
            connection.setDoOutput(true);
            // format data
            JSONObject postData = new JSONObject();
            if(maxToken>0)
                postData.put(MAX_TOKEN, maxToken);
            if(!Tool.isEmpty(model))
                postData.put("model", model);
            JSONArray messages = new JSONArray();
            // format specialisation.
            if(!Tool.isEmpty(specialisation))
                messages.put(new JSONObject().put("role","system").put(CONTENT_KEY,specialisation));
            // add historic (restrict to Param histDepth the number of messages )
            if(!Tool.isEmpty(historic)){
                messages.putAll(getCleanHistoric(historic,histDepth));
            }
            
            messages.put(new JSONObject().put("role","user").put(CONTENT_KEY,prompt));
            postData.put("messages", messages);
            AppLog.info("AI API call :"+postData.toString(1),g);
            if(AI_API_PARAM.optBoolean("huggingAPI", false)){
                postData = getHuggingFormatData(postData);
            }
            AppLog.info("AI API call :"+postData.toString(),g);
            try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
                outputStream.writeBytes(postData.toString());
                outputStream.flush();
            }
            
            int responseCode = connection.getResponseCode();
            AppLog.info("AI API response code :"+responseCode,g);

            if(responseCode!=200){
                
                return readError(connection,responseCode,g);
                
            }
           
           return readResponse(connection,g);

            
        } catch (IOException | URISyntaxException e) {
            AppLog.error(e,g);
        }
        return "";

    }
    private static JSONObject getHuggingFormatData(JSONObject postData){
        JSONObject newPostData = new JSONObject();
        StringBuilder dialogBuilder = new StringBuilder("");
        JSONObject params = new JSONObject();
        if(postData.has(MAX_TOKEN))
            params.put("max_length",postData.getInt(MAX_TOKEN));
        JSONArray messages = postData.getJSONArray("messages");
        for(int i = 0; i < messages.length(); i++){
            JSONObject message = messages.getJSONObject(i);
            String role = message.optString("role","user");
            String content = getContent(message.get(CONTENT_KEY));
            switch (role) {
                case ASSISTANT_ROLE:
                    AppLog.info("AI API assistant :"+content,Grant.getSystemAdmin());
                    dialogBuilder.append("bot: "+content+"\n");
                    break;
                case "system":
                    AppLog.info("AI API system :"+content,Grant.getSystemAdmin());
                    if(Tool.isEmpty(content) || "\"\"".equals(content)) break;
                    dialogBuilder.append("context: "+ content+"\n");
                    break;
                default:
                    AppLog.info("AI API user :"+content,Grant.getSystemAdmin());
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
    private static JSONArray getCleanHistoric(JSONArray historic,int histDepth){
        int len = historic.length();
        if( len< histDepth*2){
            return historic;
        }else{
            JSONArray newHistoric = new JSONArray();
            for(int i = len - 2*histDepth; i < len;i++ )
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
    /**
     * Reads the error response from an HTTP connection and returns a formatted error message.
     *
     * @param connection The HttpURLConnection object representing the connection.
     * @param responseCode The HTTP response code.
     * @param g The Grant object.
     * @return A JSON-formatted error message containing the response code and error message.
     */
    public static String readError(HttpURLConnection connection,int responseCode,Grant g){
        try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getErrorStream()))) {
            String line;
            StringBuilder response = new StringBuilder();

            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            AppLog.info("AI API error :["+responseCode+"]"+response.toString(),g);
            JSONObject error = new JSONObject(response.toString());
            String errorMessage = error.optJSONObject("error").optString("message","no message");
            AppLog.info("AI API error :["+responseCode+"]: "+errorMessage,g);
            connection.disconnect();
            
            return "{\"code\":\""+responseCode+"\",\"error\":\""+errorMessage+"\" }";

        } catch (IOException e) {
            AppLog.error(e,g);
        }
        connection.disconnect();
        return "";
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
            AppLog.info("AI API response :"+res,g);
            JSONArray resArray = optJSONArray(res);
            AppLog.info(resArray.toString(1), g);
            if(Tool.isEmpty(resArray)){
                AppLog.info("AI used token :"+new JSONObject(res).optJSONObject("usage").toString(1), g);
                
                return res;
            }
            String resultText = resArray.optJSONObject(0).getString("generated_text");
            JSONObject resJson =new JSONObject().put("choices",new JSONArray().put(new JSONObject().put("message",new JSONObject().put(CONTENT_KEY,resultText))));
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
        return aiCaller(g, specialisation,prompt,null,true,false);
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, boolean maxToken){
        return aiCaller(g, specialisation,prompt,null,maxToken,false);
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, boolean maxToken,boolean secure){
        return aiCaller(g, specialisation,prompt,maxToken,secure,false);
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, boolean maxToken,boolean secure,boolean isSafeSpe){
        return aiCaller(g, specialisation,prompt,null,maxToken,secure,isSafeSpe);
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken){
        return aiCaller(g, specialisation,prompt,historic,maxToken,false);
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken,boolean secure){
        return aiCaller(g, specialisation,prompt,historic,maxToken,secure,false);
    }
    public static JSONObject aiCaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken,boolean secure,boolean isSafeSpe){
        int tokens = 1500;
        if(!Tool.isEmpty(AI_API_PARAM)) {
            tokens = maxToken?AI_API_PARAM.getInt(MAX_TOKEN_PARAM_KEY):0;
        }
        return new JSONObject(aiCaller(g, specialisation,prompt,historic,secure,isSafeSpe,tokens));

    }
    public static JSONObject aiCaller(Grant g, String specialisation, JSONArray historic, Object prompt){
       return aiCaller(g, specialisation,prompt,historic,true,false);
    }
    private static String aiCaller(Grant g, String specialisation, Object prompt ,JSONArray historic, int maxToken){
        return aiCaller(g, specialisation,prompt,historic,false,maxToken);
    
    }
	/**
     * call aiCaller with specification for code usable in Simplicité.
	 * @param g
	 * @param prompt
	 * @param historic
	 * @return
	 */
	public static JSONObject aiCodeHelper(Grant g, String prompt,JSONArray historic){
        return new JSONObject(aiCaller(g, "you are java expert, optimize your function, answer only function",prompt,historic,AI_API_PARAM.getInt("code_max_token")));
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
        return  Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^a-zA-Z0-9@.-]", " ");
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
            String res = aiCaller(g, specialisation,parsedPrompt,null,3500);
            return new JSONObject(res);
         } catch (ScriptException e) {
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
			objI.setFieldFilter("row_module_id", mdlId);
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
		obj.select(mdlId);
		ModuleDB module = new ModuleDB(obj);
		JSONObject swagger = new JSONObject(module.openAPI(JSONTool.OPENAPI_OAS3,true));
		JSONObject newSchemas = new JSONObject();
		JSONObject schemas = swagger.getJSONObject(SWAGGER_COMPONENTS).getJSONObject(SWAGGER_SHEMAS);
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			newSchemas.put(name, checkFields(schemas.getJSONObject(name), name,g));
		}
        return new JSONObject().put(SWAGGER_COMPONENTS,new JSONObject().put(SWAGGER_SHEMAS,newSchemas)); 
    }

    public static JSONObject checkFields(JSONObject obj, String name, Grant g) {
        ObjectDB objDB = g.getTmpObject(name);
        JSONObject properties = obj.getJSONObject("properties");
        for (String key : properties.keySet()) {
            JSONObject val = properties.getJSONObject(key);
            ObjectField fld;
            fld = objDB.getField(key.replace("__", "."));
            if (val.has("enum")) {
                JSONArray enumCodes = new JSONArray();
                for (EnumItem eItem : fld.getList().getAllItems()) {
                    enumCodes.put(new JSONObject().put("code",eItem.getCode()).put("label", eItem.getValue().replace(" ", "_")));
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
        if (SHOW_DATA_DISCLAIMER){
            return g.T("AI_DISCLAIMER_DATA").replace("[PROVIDER]", AI_PROVIDER);
        }
        return "";
    }
    
}