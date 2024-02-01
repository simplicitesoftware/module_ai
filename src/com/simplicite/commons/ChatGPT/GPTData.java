package com.simplicite.commons.ChatGPT;

import java.util.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.simplicite.util.*;

import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;

/**
 * Shared code GPTData
 */
public class GPTData implements java.io.Serializable {
	
	private static HashMap<Integer,String> typeTrad;
	String html = "";
	private static class CreatedObject {
		private JSONObject objectCreate;
		private String objectName;
		private boolean toUpdate;
		private List<RefField> fieldToUpdate;
		private String rowId;
		public CreatedObject(String objectName) {
			this.objectCreate= new JSONObject();
			this.objectName = objectName;
			this.toUpdate = false;
			this.fieldToUpdate= new ArrayList<>();
			this.rowId = "";

		}
	}
	private static class RefField{
		private String objectName;
		private String fieldName;
		private String id;
		public RefField(String objectName, String fieldName, String id) {
			this.objectName = objectName;
			this.fieldName = fieldName;
			this.id = id;
		}
		
	}
	static {
		typeTrad = new HashMap<>();
		typeTrad.put(ObjectField.TYPE_STRING,"Short text");
		typeTrad.put(ObjectField.TYPE_LONG_STRING,"Long text");
		typeTrad.put(ObjectField.TYPE_INT,"Integer" );
		typeTrad.put(ObjectField.TYPE_FLOAT,"Decimal");
		typeTrad.put(ObjectField.TYPE_BIGDECIMAL,"Decimal");
		typeTrad.put( ObjectField.TYPE_DATE,"Date");
		typeTrad.put(ObjectField.TYPE_DATETIME,"Date and time");
		typeTrad.put(ObjectField.TYPE_TIME,"Time");
		typeTrad.put( ObjectField.TYPE_ENUM,"Enumeration");
		typeTrad.put(ObjectField.TYPE_ENUM_MULTI,"Multiple enumeration");
		typeTrad.put(ObjectField.TYPE_BOOLEAN,"Boolean");
		typeTrad.put( ObjectField.TYPE_URL,"URL");
		typeTrad.put(ObjectField.TYPE_HTML,"HTML content");
		typeTrad.put(ObjectField.TYPE_EMAIL, "Email" );
		typeTrad.put( ObjectField.TYPE_DOC, "Document");
		typeTrad.put(ObjectField.TYPE_OBJECT,"Object" );
		typeTrad.put(ObjectField.TYPE_PASSWORD,"Password" );
		typeTrad.put(ObjectField.TYPE_EXTFILE,"External file");
		typeTrad.put(ObjectField.TYPE_IMAGE,"Image");
		typeTrad.put(ObjectField.TYPE_NOTEPAD,"Notepad");
		typeTrad.put(ObjectField.TYPE_PHONENUM,"Phone number" );
		typeTrad.put(ObjectField.TYPE_COLOR,"Color");
		typeTrad.put( ObjectField.TYPE_GEOCOORDS,"Geographical coordinates");
	}
	public static String genDataForModule(String moduleName,Grant g){
		try {
			AppLog.info("Start genDataForModule", g);
			String[] ids = getObjectIdsModule(moduleName, g);
			if(Tool.isEmpty(ids))throw new PlatformException("Not found or not granted object to generate for module: \n"+moduleName);
			JSONObject response = GPTData.callIADataOnModule(ids, g);
			response = GPTData.jsonPreprocessing(response, g);
			//AppLog.info(response.toString(1), g);
			JSONObject formatResponse = GPTData.createObjects(ids,response, g);
			return formatResult(formatResponse, g);
		}catch (PlatformException e) {
			AppLog.error(e, g);
			return e.getMessage();
		}
	}
	private static JSONObject formatObjectInJson(String name, Grant g){
		ObjectDB obj = g.getTmpObject(name);
		JSONObject json = new JSONObject(obj.toJSON());
		json.remove("row_id");
		Iterator<String> keys = json.keys();
		List<String> toRemove = new ArrayList<>();
		List<String> refToAdd = new ArrayList<>();
		while (keys.hasNext()) {
			String key = keys.next();
			ObjectField field = obj.hasField(key)?obj.getField(key):null;
			if(Tool.isEmpty(field)){
				toRemove.add(key);
			}else if(field.isForeignKey()){
				toRemove.add(key);
				String idField = key;
				if(obj.hasField(idField)){
					String refObj = obj.getField(idField).getRefObjectName();
					refToAdd.add(refObj);
				}
			}else if(!field.isForeignKey() && !field.isInternalForeignKey()){
				int type = field.getType();
				switch (type) {
					case ObjectField.TYPE_REGEXP:
						json.put(key, "Validated text //"+field.getRegExp());
						break;
					case ObjectField.TYPE_ENUM :
						json.put(key, "Enumeration //("+String.join(", ", field.getList().getCodes(true))+")");
						break;
					case ObjectField.TYPE_ENUM_MULTI :
						json.put(key, "Multiple enumeration //("+String.join(", ", field.getList().getCodes(true))+")");
						break;
					default:
						json.put(key, typeTrad.getOrDefault(type, "String"));
						break;
				}
				
			}
		}
		for(String key : toRemove){
			json.remove(key);
		}
		JSONObject reference = new JSONObject();
		for(String key : refToAdd){
			reference.put(key,"id");
		}

		if(!Tool.isEmpty(reference))json.put("link", reference);
		json.put("id", "");
		
		return json;
	}
	private static String[] getObjectIdsModule(String moduleName, Grant g) throws PlatformException{
		
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
	private static List<String[]> removeNotCreatable(List<String[]> list,int nameIndex, Grant g){
		Map<String, String> creatables = g.getCreatable();
		List<String[]> res = new ArrayList<>();
		for(String[] row : list){
			if(creatables.getOrDefault(row[nameIndex],"N").equals("Y")){
				res.add(row);
			}
		}
		return res;

	}
	private static JSONObject getJsonModel(String[] ids, Grant g){
		JSONObject data = new JSONObject();
		List<JSONObject> nnToAdd = new ArrayList<>();
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			data.put(name, new JSONArray().put(formatObjectInJson(name, g)).put("//"+g.getTmpObject(name).getDesc()));
			/* if(!isNNObject(name, g)){
				data.put(name, new JSONArray().put(formatObjectInJson(name, g)));
			}else{
				nnToAdd.add(getNNInfo(name, g));
			} */
			
		}
		for(JSONObject json : nnToAdd){
			String from = json.optString("from");
			String to = json.optString("to");
			if(!Tool.isEmpty(from) && !Tool.isEmpty(to)){
				JSONArray fromArray = data.optJSONArray(from);
				if(!Tool.isEmpty(fromArray)){
					if(!fromArray.getJSONObject(0).has("link"))fromArray.getJSONObject(0).put("link", new JSONObject());
					fromArray.getJSONObject(0).getJSONObject("link").put(to, "[id,...]");
				}
				
			}
		}
		return data;
	}

	private static JSONObject callIADataOnModule(String[] ids, Grant g) throws PlatformException{
		JSONObject data = getJsonModel(ids, g);
		String response = GptTools.gptCaller(g, /* "module uml: "+json */"", " generates consistent data in json according to the model: ```json "+data.toString(1)+"```",false).getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
		if(!GptTools.isValidJson(response)){	
			
			List<String> listResult = GptTools.getJSONBlock(response,g);
			if(Tool.isEmpty(listResult) || !GptTools.isValidJson(listResult.get(1))){
				throw new PlatformException("Sorry GPT do not return interpretable json: \n"+response);
			}else{
				response = listResult.get(1);
			}
		}
		return new JSONObject(response);
	}

	private static JSONObject createObjects(String[] ids, JSONObject json, Grant g) throws JSONException, GetException, ValidateException, SaveException{
		
		JSONObject created = new JSONObject();
		List<CreatedObject> toUpdate = new ArrayList<>();
		JSONObject res = new JSONObject();
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			ObjectDB obj = g.getTmpObject(name);
			
			JSONArray arrayRes = new JSONArray();
			if(json.has(name) && json.get(name) instanceof JSONObject){
				CreatedObject objectToCreate = objectbyJSON(name, json.getJSONObject(name),created,g);
				synchronized(obj.getLock()){
					BusinessObjectTool objT = obj.getTool();
					if(checkFuncIdAndRequired(objectToCreate.objectCreate, obj, g)){
						JSONObject filters = getFilter(objectToCreate.objectCreate, obj);
						if(Tool.isEmpty(filters)){
							objT.selectForCreate();
							obj.setValuesFromJSONObject(objectToCreate.objectCreate, true, false);
							objT.validateAndCreate();
						}else if(!objT.selectForCreateOrUpdate(filters)){
							obj.setValuesFromJSONObject(objectToCreate.objectCreate, true, false);
							objT.validateAndCreate();
						}
						objectToCreate.rowId = obj.getRowId();
						if(!Tool.isEmpty(objectToCreate.rowId)){
							arrayRes.put(toDysplayJson(obj, g));
						}
					}
				}
				if(!Tool.isEmpty(objectToCreate.rowId)){
					
					String objid =json.getJSONObject(name).optString("id");
					
					if(!Tool.isEmpty(objid)){
						if(!created.has(name)){
							created.put(name, new JSONObject());
						}
						created.getJSONObject(name).put(objid, objectToCreate.rowId);
					}
					if(objectToCreate.toUpdate){
						toUpdate.add(objectToCreate);
					}
				}
			}else if(json.has(name) && json.get(name) instanceof JSONArray){
				JSONArray array = json.getJSONArray(name);
				for(int i=0; i<array.length();i++){
					if(array.get(i) instanceof JSONObject){
						CreatedObject objectToCreate = objectbyJSON(name, array.getJSONObject(i),created,g);
						
						synchronized(obj.getLock()){
							BusinessObjectTool objT = obj.getTool();
							if(checkFuncIdAndRequired(objectToCreate.objectCreate, obj, g)){
								JSONObject filters = getFilter(objectToCreate.objectCreate, obj);
								if(Tool.isEmpty(filters)){
									objT.selectForCreate();
									obj.setValuesFromJSONObject(objectToCreate.objectCreate, true, false);
									objT.validateAndCreate();
								}else if(!objT.selectForCreateOrUpdate(filters)){
									obj.setValuesFromJSONObject(objectToCreate.objectCreate, true, false);
									objT.validateAndCreate();
								}
						
								objectToCreate.rowId = obj.getRowId();
								if(!Tool.isEmpty(objectToCreate.rowId)){
									arrayRes.put(toDysplayJson(obj, g));
								}
							}
						}
						if(!Tool.isEmpty(objectToCreate.rowId)){
							String objid = array.getJSONObject(i).optString("id");
							
							if(!Tool.isEmpty(objid)){
								if(!created.has(name)){
									created.put(name, new JSONObject());
								}
								created.getJSONObject(name).put( objid, objectToCreate.rowId);
							}
							if(objectToCreate.toUpdate){
								toUpdate.add(objectToCreate);
							}
						}
					}
					
				}
			}
			res.put(g.getTmpObject(name).getDisplay(), arrayRes);
		}
		for(CreatedObject objectToUpdate: toUpdate){
			ObjectDB obj = g.getTmpObject(objectToUpdate.objectName);
			synchronized(obj.getLock()){
				BusinessObjectTool objT = obj.getTool();
				objT.select(objectToUpdate.rowId);
				for(RefField fieldUpdate : objectToUpdate.fieldToUpdate){
					String id = fieldUpdate.id;
					String objName = fieldUpdate.objectName;
					if(created.has(objName) && created.getJSONObject(objName).has(id)){
						String refRowId =created.getJSONObject(objName).getString(id);
						obj.setFieldValue(fieldUpdate.fieldName, refRowId);
					}
				}
			
				
				objT.validateAndSave();
			}
		}
		//AppLog.info(res.toString(1), g);
		return res;
	}
	private static CreatedObject objectbyJSON(String name, JSONObject json, JSONObject existed, Grant g){
		Random random = new Random();
		//AppLog.info(name, g);
		CreatedObject res = new CreatedObject(name);
		
		ObjectDB obj = g.getTmpObject(name);
		for (ObjectField field :obj.getFields()){
			String test = field.getName();
			if(field.isForeignKey()){
				String objName = field.getRefObjectName();
				if (json.has(objName) && json.get(objName) instanceof JSONObject){
					String id = json.getJSONObject(objName).optString("id");
					if(!Tool.isEmpty(id) && existed.has(objName) && existed.getJSONObject(objName).has(id)){
						String refRowId =existed.getJSONObject(objName).getString(id);
						res.objectCreate.put(field.getName(), refRowId);
					}else if(!Tool.isEmpty(id)){
						res.toUpdate = true;
						res.fieldToUpdate.add(new RefField(objName, field.getName(), id));
					}
				}else if(json.has("link") && json.get("link") instanceof JSONObject){
					JSONObject link = json.getJSONObject("link");
					if(link.has(objName)){
						String id=link.optString(objName,"");
						if(link.get(objName) instanceof JSONObject){
							id = link.getJSONObject(objName).optString("id");
							
						} 
						if(!Tool.isEmpty(id) && existed.has(objName) && existed.getJSONObject(objName).has(id)){
							String refRowId =existed.getJSONObject(objName).getString(id);
							res.objectCreate.put(field.getName(), refRowId);
						}else if(!Tool.isEmpty(id)){
							res.toUpdate = true;
							res.fieldToUpdate.add(new RefField(objName, field.getName(), id));
						}
					}		
				}
			}else if(json.has(field.getName())){
				if(field.isNumeric()){
					int precision = field.getFloatPrecision();
					int size = field.getSize();
					if (size > 6) size = 6;
					if (!(json.get(field.getName()) instanceof Number)) {
						int max = (int) Math.pow(10, size) - 1;
						res.objectCreate.put(field.getName(), random.nextInt(max));
					}else if(precision>0){
						float max = getMax(size, precision);
						float value = json.getFloat(field.getName());
						if(value>max) value = random.nextFloat(max);
						res.objectCreate.put(field.getName(), value);
					}else{
						int max = (int) Math.pow(10, size) - 1;
						int value = json.getInt(field.getName());
						if(value>max) value = random.nextInt(max);
						res.objectCreate.put(field.getName(), value);
					}
					
				}else{
					String value;
					switch (field.getType()) {
						case ObjectField.TYPE_PHONENUM:
							String phoneNum = json.optString(field.getName());
							try {
								if(!new PhoneNumTool().isValid(phoneNum)){
									res.objectCreate.put(field.getName(), "0000000000");
								}else{
									res.objectCreate.put(field.getName(), phoneNum);
								}
							} catch (ParamsException e) {
								AppLog.error(e, g);
								res.objectCreate.put(field.getName(), "0000000000");
							}
							break;
						case ObjectField.TYPE_ENUM:
							String[] listCode = field.getList().getCodes(true);
					
							value = "";
							if(json.get(field.getName()) instanceof JSONArray){
								JSONArray array = json.getJSONArray(field.getName());
								if(array.length()>0){
									value = array.getString(random.nextInt(array.length()));
								}
							}else if(json.get(field.getName()) instanceof String){ 
								value = json.getString(field.getName());
								
							}	
							res.objectCreate.put(field.getName(),Arrays.asList(listCode).contains(value)?value:listCode[random.nextInt(listCode.length)]);
							break;
						case ObjectField.TYPE_DATE:
							value =json.optString(field.getName());
							if(!Tool.isDate(value)) value = Tool.getCurrentDate();
							res.objectCreate.put(field.getName(), value);
							break;
						case ObjectField.TYPE_DATETIME:
							value =json.optString(field.getName());
							if(!Tool.isDateTime(value)) value = Tool.getCurrentDateTime();
							res.objectCreate.put(field.getName(), value);
							break;
						case ObjectField.TYPE_GEOCOORDS:
							value =json.optString(field.getName());
							//TODO
							AppLog.info("TODO GEOCOORDS "+test, g);
							break;
						case ObjectField.TYPE_EMAIL:
							value =json.optString(field.getName());
							if(!Tool.checkEmail(value)) value = "email@exemple.com";
							res.objectCreate.put(field.getName(), value);
							break;
						default:
							res.objectCreate.put(field.getName(), json.optString(field.getName()));
							break;
					}
				}

				
			}

		}

		return res;
	}
	/* private static boolean isNNObject(String objectName, Grant g){
		int fkCount = 0;
		ObjectDB obj = g.getTmpObject(objectName);
		for(ObjectField f : obj.getFields()){
			String test = f.getName();
			boolean test2 = f.isReferenced();
			if(!f.isTechnicalField() && !f.isReferenced()){
				if(!(f.isInternalForeignKey() && f.isFunctId() && fkCount<2))return false;
				fkCount++;
			}
		}
		return true;
	}
	private static JSONObject getNNInfo(String objectName, Grant g){
		int fkCount = 0;
		ObjectDB obj = g.getTmpObject(objectName);
		JSONObject res = new JSONObject();
		for(ObjectField f : obj.getFields()){
			
			if(f.isInternalForeignKey()){
				fkCount++;
				if(fkCount == 1){
					res.put("from", f.getRefObjectName());
					
				}else if(fkCount == 2){
					res.put("to", f.getRefObjectName());
				}
			}
		}
		return res;
	} */

	/* private static String getSwagger(String moduleName, Grant g) throws HTTPException{
		Map<String,Object> param = new HashMap<>();
		String baseurl = "https://candicetest.demo.simplicite.io"+Globals.WEB_API_PATH+Globals.WEB_REST_PATH+"/";
		param.put("_doc", "true");
		param.put("_output", "swagger-2.0");
		for(String id: getObjectIdsModule(moduleName, g)){
			
			String url= baseurl +ObjectCore.getObjectName(id);
			url = HTTPTool.append(url, param);
			//AppLog.info(url, g);
			
			//AppLog.info(RESTTool.get(url,g.getLogin(),g.getPassword()), g);
		}
		return "";
	} */
	private static JSONObject jsonPreprocessing(JSONObject json, Grant g) {
		JSONObject res = new JSONObject();
		int idProcess = 1;
		Iterator<String> keys = json.keys();
		while (keys.hasNext()) {
			String objName = keys.next();
			if(json.get(objName) instanceof JSONArray){
				JSONArray array = json.getJSONArray(objName);
				for(int i=0; i<array.length();i++){
					if(array.get(i) instanceof JSONObject){
						JSONObject obj = array.getJSONObject(i);
						idProcess = processObject(objName, obj, res, idProcess, g);
					}
				}
			}else if(json.get(objName) instanceof JSONObject){
				JSONObject obj = json.getJSONObject(objName);
				idProcess = processObject(objName, obj, res, idProcess, g);
			}
			
		}
		return res;
	}
	private static int processObject(String objName, JSONObject obj, JSONObject res, int idProcess, Grant g){
		if(!obj.has("id")){
			for(String key : obj.keySet()){
				if (key.matches(".*[i,I][d,D]$")){
					obj.put("id" ,obj.get(key));
					break;
				}
			}
		}
		if(obj.has("link") && obj.get("link") instanceof JSONObject){
			JSONObject link = obj.getJSONObject("link");
			Iterator<String> keysLink = link.keys();
			while (keysLink.hasNext()) {
				String linkName = keysLink.next();
				if(link.get(linkName) instanceof JSONObject){
					JSONObject linkObj = link.getJSONObject(linkName);
					if(linkObj.length()>1){
						if(!linkObj.has("id")){
							linkObj.put("id", "prc_"+idProcess);
							idProcess++;
						}else if(linkObj.get("id") instanceof Number){
							linkObj.put("id", String.valueOf(linkObj.get("id")));
						}
										
						link.put(linkName, linkObj.getString("id"));
						idProcess = processObject(linkName, linkObj, res, idProcess, g);
					}else if (linkObj.has("id")){
						if(linkObj.get("id") instanceof Number){
							linkObj.put("id", String.valueOf(linkObj.get("id")));
						}
						link.put(linkName, linkObj.getString("id"));
					}
							
				}
			}
		}
		if(!res.has(objName)){
			res.put(objName, new JSONArray());
		}
		res.getJSONArray(objName).put(obj);

		return idProcess;
	}
	private static JSONObject getFilter(JSONObject json, ObjectDB obj){
		JSONObject res = new JSONObject();
		List<ObjectField> funcIds = obj.getFunctId();
		if(Tool.isEmpty(funcIds)) return res;
		for(ObjectField f : funcIds){
			if(json.has(f.getName())){
				res.put(f.getName(), json.get(f.getName()));
			}
		}
		return res;
	}
	private static boolean checkFuncIdAndRequired(JSONObject json , ObjectDB obj,Grant g ){
		List<ObjectField> fields = obj.getFields();
		if(Tool.isEmpty(fields)) return true;
		for(ObjectField f : fields){
			String test = f.getName();
			if(!json.has(f.getName()) && !f.isTechnicalField() && (f.isRequired() || f.isFunctId()) ){
				if(f.isForeignKey() ) return false;
				if(f.isString()){
					//String res = GptTools.gptCaller(g,"","Value for "+f.getName()+"field").getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
					String res = f.getDisplay()+"_"+new Random().nextInt(99);
					json.put(f.getName(),res );
				}else if(f.isNumeric()){
					json.put(f.getName(), new Random().nextInt(99));
				}else{
					return false;
				}
				
			}
		}
		return true;
	}

	private static float getMax(int size, int precision) {
		int maxInt = (int) Math.pow(10, size-precision) - 1;
		float  denary = (float) Math.pow(10, precision);
		denary = (denary-1)/denary;
		float maxFloat = maxInt + denary;
		return maxFloat;
	}
	private static String formatResult(JSONObject json, Grant g) {
		StringBuilder html = new StringBuilder();
		html.append("<ul>");
		formatJson(json, html);
		html.append("</ul>");
		return html.toString();
	}

	private static void formatJson(JSONObject json, StringBuilder html) {
		for (String key : json.keySet()) {
			Object value = json.get(key);
			html.append("<li>");
			html.append("<strong>").append(key).append("</strong>: ");
			if (value instanceof JSONObject) {
				html.append("<ul>");
				formatJson((JSONObject) value, html);
				html.append("</ul>");
			} else if (value instanceof JSONArray) {
				html.append("<ul>");
				formatJsonArray((JSONArray) value, html);
				html.append("</ul>");
			} else {
				html.append(value);
			}
			html.append("</li>");
		}
	}

	private static void formatJsonArray(JSONArray jsonArray, StringBuilder html) {
		for (int i = 0; i < jsonArray.length(); i++) {
			Object value = jsonArray.get(i);
			html.append("<li>");
			if (value instanceof JSONObject) {
				html.append("<ul>");
				formatJson((JSONObject) value, html);
				html.append("</ul>");
			} else if (value instanceof JSONArray) {
				html.append("<ul>");
				formatJsonArray((JSONArray) value, html);
				html.append("</ul>");
			} else {
				html.append(value);
			}
			html.append("</li>");
		}
	}
	private static JSONObject toDysplayJson(ObjectDB obj, Grant g){

		JSONObject res = new JSONObject();
		res.put("id", obj.getRowId());
		for(ObjectField f : obj.getFields()){
			if(!f.isTechnicalField() && !f.isReferenced()){
				if(f.isForeignKey()){
					res.put(f.getRefObjectDisplay()+" id",f.getDisplayValue() );
				}else{
					res.put(f.getDisplay(), f.getDisplayValue() );
				}
			}
		}
		return res;
	}
}