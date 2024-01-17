package com.simplicite.objects.ChatGPT;

import java.util.*;

import org.json.JSONObject;

import com.simplicite.commons.ChatGPT.GptTools;
import com.simplicite.util.*;

/**
 * Business object GptExemple
 */
public class GptExemple extends ObjectDB {
	private static final long serialVersionUID = 1L;
	private static final String EX_PROMPT_FIELD ="gptExPrompt";
	private static final String EX_OLD_PROMPT_FIELD ="gptExOldPrompt";
	@Override
	public void initCreate() {
		getField("gptExName").setVisibility(ObjectField.VIS_FORM);
		
		super.initCreate();
	}
	@Override
	public String postCreate() {
		ObjectField f =getField("gptExName");
		f.setVisibility(f.getVisibilityDefault());
		return super.postCreate();
	}
	@Override
	public List<String> preValidate() {
		List<String> msgs = new ArrayList<>();
		
		if(!Tool.isEmpty(getFieldValue(EX_PROMPT_FIELD)) && (isNew() || getField(EX_PROMPT_FIELD).hasChanged() || getField("gptExType").hasChanged() || getField("gptExSpecification").hasChanged())){
			JSONObject result;
			
			if ("CODE".equals(getFieldValue("gptExType"))){
				
				result = GptTools.gptCodeHelper(getGrant(), getFieldValue(EX_PROMPT_FIELD),Tool.isEmpty(getFieldValue(EX_OLD_PROMPT_FIELD))?null:GptTools.formatMessageHistoric(getFieldValue(EX_OLD_PROMPT_FIELD),getFieldValue("gptExResponse")));

			}else{
				result = GptTools.gptCaller(getGrant(), getFieldValue("gptExSpecification"), getFieldValue(EX_PROMPT_FIELD));
			}
			if(result.has("error")){
				msgs.add(Message.formatError("GPT_ERROR_RETURN",result.getString("code")+": "+result.getString("error"),"demoPrdDescription"));
				return msgs;
			}
			setFieldValue("gptExResponse", result.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content"));
			setFieldValue(EX_OLD_PROMPT_FIELD,  getFieldValue(EX_PROMPT_FIELD));
			setFieldValue(EX_PROMPT_FIELD,  "");
			
		}
		
		return super.preValidate();
	}

}