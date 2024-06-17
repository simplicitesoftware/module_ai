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
    private static JSONObject AIApiParam = Grant.getSystemAdmin().getJSONObjectParameter("AI_API_PARAM");
    private static final String CONTENT_KEY = "content";
    private static final String MAX_TOKEN_PARAM_KEY = "default_max_token";
    public static final String TYPE_TEXT = "text";
    public static final String TYPE_IMAGE_URL = "image_url";
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
    private static String AICaller(Grant g, String specialisation, Object prompt ,JSONArray historic, boolean secure, int maxToken){
        return AICaller(g, specialisation, prompt,historic,secure,false,maxToken);
    }
    
    private static String AICaller(Grant g, String specialisation, Object prompt ,JSONArray historic, boolean secure,boolean isSafeSpe, int maxToken){
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
        return AICaller(g, specialisation,arrayPrompt,historic,secure,isSafeSpe,maxToken);
    }
	private static String AICaller(Grant g, String specialisation, JSONArray prompt ,JSONArray historic, boolean secure,boolean isSafeSpe, int maxToken){
        specialisation = removeAcent(specialisation);
        if(!isSafeSpe) specialisation = JSONObject.quote(normalize(specialisation,true));

        for(Object p : prompt){
            if(p instanceof JSONObject){
                JSONObject contentJson = (JSONObject)p;
                if(!contentJson.optBoolean("trusted",false) && contentJson.has(TYPE_TEXT)){
                    contentJson.put(TYPE_TEXT,JSONObject.quote(normalize(contentJson.getString(TYPE_TEXT))));
                }
                if(contentJson.has("trusted")){
                    contentJson.remove("trusted");
                }
            }else{
                p = JSONObject.quote(normalize((String)p));
            }
        }
        int histDepth = AIApiParam.getInt("hist_depth");
		String apiKey = Grant.getSystemAdmin().getParameter("AI_API_KEY");
        String apiUrl = Grant.getSystemAdmin().getParameter("AI_API_URL");
        String model =AIApiParam.optString("model","");
        String projet = AIApiParam.optString("OpenAI-Project","");
        String org = AIApiParam.optString("OpenAI-Organization","");
        if("/".equals(apiUrl)){
            AppLog.info("AI_API_URL not set", g);
            return "";
        }
        if("/".equals(apiKey))apiKey = "";
        
       /*  if(!Tool.isEmpty(specialisation))
            specialisation=normalize(specialisation); */
       
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
                postData.put("max_tokens", maxToken);
            if(!Tool.isEmpty(model))
                postData.put("model", model);
            JSONArray messages = new JSONArray();
            // format specialisation.
            if(!Tool.isEmpty(specialisation))
                messages.put(new JSONObject().put("role","system").put(CONTENT_KEY,specialisation));
            // add historic (restrict to Param histDepth the number of messages )
            if(!Tool.isEmpty(historic)){
                int len = historic.length();
                if( len< histDepth*2){
                    messages.putAll(historic);
                }else{
                    for(int i = len - 2*histDepth; i < len;i++ )
                        messages.put(historic.getJSONObject(i));
                }


            }
            
            messages.put(new JSONObject().put("role","user").put(CONTENT_KEY,prompt));
            postData.put("messages", messages);
            try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
                outputStream.writeBytes(postData.toString());
                outputStream.flush();
            }
            
            int responseCode = connection.getResponseCode();
            if(responseCode!=200){
                
                return readError(connection,responseCode,g);
                
            }
           
           return readResponse(connection,g);

            
        } catch (IOException | URISyntaxException e) {
            AppLog.error(e,g);
        }
        return "";

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
            JSONObject error = new JSONObject(response.toString());
            connection.disconnect();
            AppLog.info("AI API error :["+responseCode+"]"+error.getJSONObject("error").getString("message"),g);
            return "{\"code\":\""+responseCode+"\",\"error\":\""+error.getJSONObject("error").getString("message")+"\" }";

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
            AppLog.info("AI used token :"+new JSONObject(res).optJSONObject("usage").toString(1), g);
            return res;
        } catch (IOException e) {
            AppLog.error(e,g);
        }
        connection.disconnect();
        return "";
    }
    /**
     * call AICaller with default value
     * @param g
     * @param specialisation
     * @param prompt
     * @return
     */
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt){
        return AICaller(g, specialisation,prompt,null,true,false);
    }
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt, boolean maxToken){
        return AICaller(g, specialisation,prompt,null,maxToken,false);
    }
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt, boolean maxToken,boolean secure){
        return AICaller(g, specialisation,prompt,maxToken,secure,false);
    }
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt, boolean maxToken,boolean secure,boolean isSafeSpe){
        return AICaller(g, specialisation,prompt,null,maxToken,secure,isSafeSpe);
    }
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken){
        return AICaller(g, specialisation,prompt,historic,maxToken,false);
    }
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken,boolean secure){
        return AICaller(g, specialisation,prompt,historic,maxToken,secure,false);
    }
    public static JSONObject AICaller(Grant g, String specialisation, Object prompt, JSONArray historic,boolean maxToken,boolean secure,boolean isSafeSpe){
        int tokens = 1500;
        if(!Tool.isEmpty(AIApiParam)) {
            tokens = maxToken?AIApiParam.getInt(MAX_TOKEN_PARAM_KEY):0;
        }
        return new JSONObject(AICaller(g, specialisation,prompt,historic,secure,isSafeSpe,tokens));

    }
    public static JSONObject AICaller(Grant g, String specialisation, JSONArray historic, Object prompt){
       return AICaller(g, specialisation,prompt,historic,true,false);
    }
    private static String AICaller(Grant g, String specialisation, Object prompt ,JSONArray historic, int maxToken){
        return AICaller(g, specialisation,prompt,historic,false,maxToken);
    
    }
	/**
     * call AICaller with specification for code usable in Simplicité.
	 * @param g
	 * @param prompt
	 * @param historic
	 * @return
	 */
	public static JSONObject AICodeHelper(Grant g, String prompt,JSONArray historic){
        return new JSONObject(AICaller(g, "you are java expert, optimize your function, answer only function",prompt,historic,AIApiParam.getInt("code_max_token")));
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
        messages.put(new JSONObject().put("role","assistant").put(CONTENT_KEY,normalize(response)));
        return messages;

    }
    public static JSONObject formatMessageHistoric(JSONObject json){
        if(json.has("trusted")){
            json.remove("trusted");
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
        Pattern pTrigger=Pattern.compile("(?i)^"+trigger+"((?:.|\\s)+)");
		JSONArray notePad = new JSONArray();
		JSONObject text = new JSONObject();
		String note="";
		for(String l : data.split("\n")){
			Matcher m =p.matcher(l);
			if(m.matches()){
				
				if (text.has("role")){//if note first line
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
                    text= new JSONObject();
                        
					
				}
				note="";
                if("ChatAI".equals(m.group(1))){
				    text.put("role","assistant");// see AI doc
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
			if("\n\n".equals(note.length()>2 ? note.substring(note.length() - 2):note))
				note = note.length()>2 ? note.substring(0,note.length() - 2):"";
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
       
        
		return invertJsonArray(notePad);
	}
    private static String normalize(String text){
        text = removeAcent(text);
        return  Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^a-zA-Z0-9@.-]", " ");
    }
    public static String normalize(String text, boolean secure){
        text = removeAcent(text);
        return secure?Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^\\w:\\(\\),`{}.\\[\\]\"@\\/:-]", " "):normalize(text);
    }
    public static String removeAcent(String text){
        return text.replaceAll("(?i)[éèêë]", "e")
                .replaceAll("(?i)[àâä]","a" )
                .replaceAll("(?i)[îï]", "i")
                .replaceAll("(?i)[ôö]", "o")
                .replaceAll("(?i)[ùûü]", "u")
                .replaceAll("(?i)ÿ", "y")
                .replaceAll("(?i)ç", "c")
                .replaceAll("(?i)æ","ae")
                .replaceAll("(?i)œ","oe");
                    
                    
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
    public static JSONObject actionAICaller(Grant g, String specialisation, String prompt){
        
        return AICaller(g, specialisation,prompt);
    }
    public static JSONObject actionAICaller(Grant g, String specialisation, String prompt,ObjectDB obj){
         try {
            String parsedPrompt = parseExpresion(prompt,obj);
            return AICaller(g, specialisation,parsedPrompt);
         } catch (ScriptException e) {
            AppLog.error(e, g);
            return new JSONObject();
        }
        
    }
    //Call AI whith parsed expretion
    public static JSONObject expresionAICaller(Grant g, String specialisation, String prompt,ObjectDB obj){
        try {
            String parsedPrompt = parseExpresion(prompt,obj);
            String res = AICaller(g, specialisation,parsedPrompt,null,3500);
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
		String regex= "([^\0{]*?)(?:```)?(?:json)?\s*(\\{[^`]+\\})(?:```)?([^\0}]*)";
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
                return null;
            }
		}
		return res;
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
		JSONObject schemas = swagger.getJSONObject("components").getJSONObject("schemas");
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			newSchemas.put(name, checkFields(schemas.getJSONObject(name), name,g));
		}
        return new JSONObject().put("components",new JSONObject().put("schemas",newSchemas)); 
    }

    public static JSONObject checkFields(JSONObject obj, String name, Grant g) {
        ObjectDB objDB = g.getTmpObject(name);
        JSONObject properties = obj.getJSONObject("properties");
        for (String key : properties.keySet()) {
            JSONObject val = properties.getJSONObject(key);
            ObjectField fld;
            fld = objDB.getField(key.replaceAll("__", "."));
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
		JSONObject schemas = swagger.getJSONObject("components").getJSONObject("schemas");
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			newSchemas.put(name, new JSONObject(schemas.getJSONObject(name).toString()));
		}
        
		swagger.getJSONObject("components").put("schemas", newSchemas);
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
                if(trusted) res.put("trusted",trusted);
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
}