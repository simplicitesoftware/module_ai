package com.simplicite.commons.ChatGPT;

import org.checkerframework.checker.units.qual.g;
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
import java.net.URL;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
/**
 * Shared code GptTools
 */
public class GptTools implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
    private static JSONObject gptApiParam = Grant.getSystemAdmin().getJSONObjectParameter("GPT_API_PARAM");
    private static final String CONTENT_KEY = "content";
    private static final String MAX_TOKEN_PARAM_KEY = "default_max_token";
	/**
     * Function to format the call to chatGPT API.
     * Need the GPT_API_KEY parameter set up with your key.
     * Use the GPT_API_PARAM hist_depth parameter to limit the number of exchanges in the historic (useful to limit the number off token of requests).
	 * @param g Grant
	 * @param specialisation Prompt to specialise chatbot (ex: You're a java developer).
	 * @param prompt 
	 * @param historic exchange historic for contextual response
	 * @param maxToken number of tokens allow in response
	 * @return If API return code is 200: API answer else: error return.
	 */
    
	private static String gptCaller(Grant g, String specialisation, String prompt ,JSONArray historic, boolean secure, int maxToken){
        int histDepth = gptApiParam.getInt("hist_depth");
		String apiKey = Grant.getSystemAdmin().getParameter("GPT_API_KEY");
        String apiUrl = Grant.getSystemAdmin().getParameter("GPT_API_URL");
        if(/* apiKey.equals("/") || */ apiUrl.equals("/")){
            AppLog.info("GPT_API_KEY or GPT_API_URL not set", g);
            return "";
        }
        if(apiKey.equals("/"))apiKey = "";
        prompt=normalize(prompt,secure);
        if(!Tool.isEmpty(specialisation))
            specialisation=normalize(specialisation);
       
        try {
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            connection.setDoOutput(true);
            // format data
            JSONObject postData = new JSONObject();
            if(maxToken>0)
                postData.put("max_tokens", maxToken);
            postData.put("model", "gpt-3.5-turbo");
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

            
        } catch (IOException e) {
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
            return response.toString();
        } catch (IOException e) {
            AppLog.error(e,g);
        }
        connection.disconnect();
        return "";
    }
    /**
     * call gptCaller with default value
     * @param g
     * @param specialisation
     * @param prompt
     * @return
     */
    public static JSONObject gptCaller(Grant g, String specialisation, String prompt){
        String res = gptCaller(g, specialisation,prompt,null,gptApiParam.getInt(MAX_TOKEN_PARAM_KEY));
        return new JSONObject(res);
    }
    public static JSONObject gptCaller(Grant g, String specialisation, String prompt, boolean maxToken){
        String res = gptCaller(g, specialisation,prompt,null,maxToken?gptApiParam.getInt(MAX_TOKEN_PARAM_KEY):0);
        return new JSONObject(res);
    }
    public static JSONObject gptCaller(Grant g, String specialisation, String prompt, boolean maxToken,boolean secure){
        String res = gptCaller(g, specialisation,prompt,null,secure,maxToken?gptApiParam.getInt(MAX_TOKEN_PARAM_KEY):0);
        return new JSONObject(res);
    }
    public static JSONObject gptCaller(Grant g, String specialisation, String prompt, JSONArray historic,boolean maxToken){
        String res = gptCaller(g, specialisation,prompt,historic,maxToken?gptApiParam.getInt(MAX_TOKEN_PARAM_KEY):0);
        return new JSONObject(res);
    }
    public static JSONObject gptCaller(Grant g, String specialisation, String prompt, JSONArray historic,boolean maxToken,boolean secure){
        String res = gptCaller(g, specialisation,prompt,historic,secure,maxToken?gptApiParam.getInt(MAX_TOKEN_PARAM_KEY):0);
        return new JSONObject(res);
    }
     public static JSONObject gptCaller(Grant g, String specialisation, JSONArray historic, String prompt){
        String res = gptCaller(g, specialisation,prompt,historic,gptApiParam.getInt(MAX_TOKEN_PARAM_KEY));
        return new JSONObject(res);
    }
    private static String gptCaller(Grant g, String specialisation, String prompt ,JSONArray historic, int maxToken){
        return gptCaller(g, specialisation,prompt,historic,false,maxToken);
    
    }
	/**
     * call gptCaller with specification for code usable in Simplicité.
	 * @param g
	 * @param prompt
	 * @param historic
	 * @return
	 */
	public static JSONObject gptCodeHelper(Grant g, String prompt,JSONArray historic){
        return new JSONObject(gptCaller(g, "you are java expert, optimize your function, answer only function",prompt,historic,gptApiParam.getInt("code_max_token")));
    }

    /**
     * Format an exchange to GPT API format.
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
        json.put(CONTENT_KEY,normalize( json.getString(CONTENT_KEY)));
        return json;
    }

    /**
     * Format a NotePad Field to a GPT Format Historic Array
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
                    if(text.getString("role").equals("user") && !Tool.isEmpty(trigger)){
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
                if("ChatGPT".equals(m.group(1))){
				    text.put("role","assistant");// see GPT doc
                }else{
                    text.put("role","user");// see GPT doc
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
            if(text.getString("role").equals("user") && !Tool.isEmpty(trigger)){
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
        return  Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^a-zA-Z0-9]", " ");
    }
    private static String normalize(String text, boolean secure){
        return secure?Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\u0300-\u036F]", "").replaceAll("[^\\w:\\(\\),`{}.\\[\\]\"]", " "):normalize(text);
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
    public static JSONObject actionGptCaller(Grant g, String specialisation, String prompt){
        
        return gptCaller(g, specialisation,prompt);
    }
    public static JSONObject actionGptCaller(Grant g, String specialisation, String prompt,ObjectDB obj){
         try {
            String parsedPrompt = parseExpresion(prompt,obj);
            return gptCaller(g, specialisation,parsedPrompt);
         } catch (ScriptException e) {
            AppLog.error(e, g);
            return new JSONObject();
        }
        
    }
    //Call GPT whith parsed expretion
    public static JSONObject expresionGptCaller(Grant g, String specialisation, String prompt,ObjectDB obj){
        try {
            String parsedPrompt = parseExpresion(prompt,obj);
            String res = gptCaller(g, specialisation,parsedPrompt,null,3500);
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
		String regex= "([^\0{]*)(?:```)?(?:json)?(\\{[^`]+\\})(?:```)?([^\0}]*)";
        if(!txt.matches("[\\w\\W]*\\{[\\w\\W]*\\}[\\w\\W]*")){
            return list;
        }
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(txt);
        

        try {
            if (matcher.find()) {
                
                list.add(matcher.group(1));
                list.add(matcher.group(2));
                list.add(matcher.group(3));
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
   


}