package com.simplicite.objects.AIBySimplicite;

import java.util.*;

import org.json.JSONObject;

import com.simplicite.commons.AIBySimplicite.AITools;
import com.simplicite.util.*;

/**
 * Business object AIExemple
 */
public class AIExemple extends ObjectDB {
	private static final long serialVersionUID = 1L;
	private static final String EX_PROMPT_FIELD ="aiExPrompt";
	private static final String EX_OLD_PROMPT_FIELD ="aiExOldPrompt";
	@Override
	public void initCreate() {
		getField("aiExName").setVisibility(ObjectField.VIS_FORM);
		
		super.initCreate();
	}
	@Override
	public String postCreate() {
		ObjectField f =getField("aiExName");
		f.setVisibility(f.getVisibilityDefault());
		return super.postCreate();
	}
	@Override
	public List<String> preValidate() {
		List<String> msgs = new ArrayList<>();
		
		if(!Tool.isEmpty(getFieldValue(EX_PROMPT_FIELD)) && (isNew() || getField(EX_PROMPT_FIELD).hasChanged() || getField("aiExType").hasChanged() || getField("aiExSpecification").hasChanged())){
			JSONObject result;
			
			if ("CODE".equals(getFieldValue("aiExType"))){
				
				result = AITools.AICodeHelper(getGrant(), getFieldValue(EX_PROMPT_FIELD),Tool.isEmpty(getFieldValue(EX_OLD_PROMPT_FIELD))?null:AITools.formatMessageHistoric(getFieldValue(EX_OLD_PROMPT_FIELD),getFieldValue("aiExResponse")));

			}else{
				result = AITools.AICaller(getGrant(), getFieldValue("aiExSpecification"), getFieldValue(EX_PROMPT_FIELD));
			}
			if(result.has("error")){
				msgs.add(Message.formatError("AI_ERROR_RETURN",result.getString("code")+": "+result.getString("error"),"demoPrdDescription"));
				return msgs;
			}
			setFieldValue("aiExResponse", result.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content"));
			setFieldValue(EX_OLD_PROMPT_FIELD,  getFieldValue(EX_PROMPT_FIELD));
			setFieldValue(EX_PROMPT_FIELD,  "");
			
		}
		
		return super.preValidate();
	}

}