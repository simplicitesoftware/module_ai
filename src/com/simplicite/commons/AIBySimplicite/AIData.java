package com.simplicite.commons.AIBySimplicite;

import java.util.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;

/**
 * Shared code AIData
 */
public class AIData implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	private static final String DEFAULT_EMAIL ="email@example.com";
	private static final String DEFAULT_PHONE ="0601020304";
	private static final String DEVOBJ_GENERATE_MLDS = "DaaGenerateMlds";
	private static HashMap<Integer,String> typeTrad;
	private static Random random = new Random();
	private static final String DAA_DATA_GENERATION ="DaaDataGeneration";
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
		@Override 
		public String toString() { 
			
			return this.toJSON().toString(1); 
		}
		
		public JSONObject toJSON() {
			JSONObject res = new JSONObject();
			res.put("objectCreate", this.objectCreate);
			res.put("objectName", this.objectName);
			if(this.toUpdate){
				JSONArray array = new JSONArray();
				for(RefField field : this.fieldToUpdate){
					array.put(field.toJSON());
				}
				res.put("fieldToUpdate", array);
			}
			res.put("rowId", this.rowId);
			
			return res;
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
		@Override
		public String toString() {
			return this.toJSON().toString(1);
		}
		public JSONObject toJSON() {
			JSONObject res = new JSONObject();
			res.put("objectName", this.objectName);
			res.put("fieldName", this.fieldName);
			res.put("id", this.id);
			return res;
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
	/**
	 * Generates data for a specific module.
	 * 
	 * @param moduleName the name of the module
	 * @param g the Grant object
	 * @return the formatted result as a String
	 */
	public static JSONObject genDataForModule(String moduleName,Grant g){
		try {
			String[] ids = AITools.getObjectIdsModule(moduleName, g);
			if(Tool.isEmpty(ids))throw new PlatformException("Not found or not granted object to generate for module "+moduleName+" and user "+g.getLogin());
			JSONObject response = AIData.callIADataOnModule(ids,ModuleDB.getModuleId(moduleName), g);
			response = AIData.jsonPreprocessing(response, g);
			return response;
		}catch (PlatformException e) {
			AppLog.error(e, g);
			return new JSONObject().put("error",e.getMessage());
		}
	}
	public static String createDataFromJSON(String moduleName, JSONObject response,Grant g){
		try {
		String[] ids = AITools.getObjectIdsModule(moduleName, g);
		JSONObject formatResponse = AIData.createObjects(ids,response, g);
			return formatResult(formatResponse);
		}catch (PlatformException e) {
			AppLog.error(e, g);
			return e.getMessage();
		}

	}

	/**
	 * Represents a JSON object, which is an unordered collection of key-value pairs.
	 * This class provides methods to manipulate and access the data stored in a JSON object.
	 */
	private static JSONObject formatObjectInJson(String name, Grant g) {
		ObjectDB obj = g.getTmpObject(name);
		JSONObject json = new JSONObject(obj.toJSON());
		json.remove("row_id");
		removeInvalidFieldsAndFormatReference(json, obj);
		addComment(json, obj);
		json.put("id", "");
		return json;
	}

	/**
	 * Removes invalid fields from the JSON object and formats the reference fields.
	 * Invalid fields are those that do not exist in the given ObjectDB.
	 * Reference fields are added to the JSON object based on the given ObjectDB.
	 * 
	 * @param json The JSON object to remove invalid fields and format reference fields from.
	 * @param obj The ObjectDB containing the valid fields for reference.
	 */
	private static void removeInvalidFieldsAndFormatReference(JSONObject json, ObjectDB obj) {
		Iterator<String> keys = json.keys();
		List<String> toRemove = new ArrayList<>();
		while (keys.hasNext()) {
			String key = keys.next();
			
			if (!obj.hasField(key)) {
				toRemove.add(key);
			}
		}
		toRemove.addAll(addReferenceFields(json, obj));
		for (String key : toRemove) {
			json.remove(key);
		}
	}

	/**
	 * Adds reference fields to the given JSON object based on the foreign key fields of the ObjectDB object.
	 * 
	 * @param json The JSON object to which the reference fields will be added.
	 * @param obj The ObjectDB object containing the fields.
	 * @return A list of keys that were removed from the JSON object.
	 */
	private static List<String> addReferenceFields(JSONObject json, ObjectDB obj) {
		Iterator<String> keys = json.keys();
		JSONObject reference = new JSONObject();
		List<String> toRemove = new ArrayList<>();
		while (keys.hasNext()) {
			String key = keys.next();
			ObjectField field = obj.hasField(key) ? obj.getField(key) : null;
			if (field != null && field.isForeignKey()) {
				toRemove.add(key);
				String refObj = field.getRefObjectName();
				reference.put(refObj, "id");
				
			}
		}

		if (!Tool.isEmpty(reference)) {
			json.put("link", reference);
		}
		return toRemove;
	}
	/**
	 * Adds comments to the given JSONObject based on the fields of the ObjectDB.
	 * 
	 * @param json The JSONObject to add comments to.
	 * @param obj The ObjectDB containing the fields.
	 */
	private static void addComment(JSONObject json, ObjectDB obj) {
		Iterator<String> keys = json.keys();
		while (keys.hasNext()) {
			String key = keys.next();
			ObjectField field = obj.hasField(key) ? obj.getField(key) : null;
			if (field != null && !field.isForeignKey() && !field.isInternalForeignKey() && ObjectField.TYPE_ID != field.getType()) {
				int type = field.getType();
				String pres = getFieldPrecition(field.getId());
				json.put(key,getCommentForType(type,pres,field));
			}
		}
	}
	private static String getCommentForType(int type,String pres, ObjectField field){
		if(!Tool.isEmpty(pres) && !isInt(pres)) pres = "//"+pres;
		String comment;
		switch (type) {
			case ObjectField.TYPE_DATETIME:
				comment = "Date and time yyyy-MM-dd HH:mm:ss "+pres;
				break;
			case ObjectField.TYPE_DATE:
				comment = "Date yyyy(-MM(-dd)?)? "+pres;
				break;
			case ObjectField.TYPE_TIME:
				comment = "Time HH(:mm(:ss)?)? "+pres;
				break;
			case ObjectField.TYPE_EMAIL:
				comment = "patterns: ^\\w+(['\\.\\+-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,})+$";
				break;
			case ObjectField.TYPE_REGEXP:
				comment = "patterns: "+field.getRegExp();
				break;
			case ObjectField.TYPE_ENUM :
				comment = "Enumeration //("+String.join(", ", field.getList().getCodes(false))+")";
				break;
			case ObjectField.TYPE_ENUM_MULTI :
				comment = "Multiple enumeration //("+String.join(", ", field.getList().getCodes(true))+")";
				break;
			case ObjectField.TYPE_PHONENUM:
				comment = "Phone number french format"+ pres;
				break;
			case ObjectField.TYPE_GEOCOORDS:
				comment = "Geographical coordinates: //latitude;longitude "+pres;
				break;
			case ObjectField.TYPE_IMAGE:
				if(!Tool.isEmpty(pres)){
					pres = "thumbnail size in pixels: "+ pres;
				}
				comment = typeTrad.get(type)+pres;
				break;
			case ObjectField.TYPE_INT:
				if("stars".equals(field.getRendering())){
					pres = "";
				}
				comment = typeTrad.get(type)+pres;
				break;
			case ObjectField.TYPE_DOC:
				comment = typeTrad.get(type);
				break;
			case ObjectField.TYPE_LONG_STRING:
				switch (field.getRendering()) {
					case "GRID":
						pres = pres + " Rendering: grid Type: String[][]";
						break;
					case "JSON":
						pres = pres + " JSON";
						break;
					case "MD":
						pres = pres + " Marckdown";
						break;
					case "HTML":
						pres = pres + " HTML";
						break;
					case "SQL":
						pres = pres + " SQL";
						break;
					default:
						break;
				}
				comment = typeTrad.get(type)+pres;
				break;
			default:
				if(field.isNumeric() && Integer.parseInt(pres) == field.getFloatPrecision()){
					pres = pres + " digits after the decimal poin";
				}
				comment = typeTrad.getOrDefault(type, "String")+pres;
				break;
		}
		return comment;
	}
	private static boolean isInt(String str){
		try{
			Integer.parseInt(str);
			return true;
		}catch(NumberFormatException e){
			return false;
		}
	}
	private static String getFieldPrecition(String id){
		if(Tool.isEmpty(id))return "";
		ObjectDB obj = Grant.getSystemAdmin().getTmpObject("Field");
		synchronized(obj.getLock()){
			obj.select(id);
			return obj.getFieldValue("fld_precision");
		}
		
	}
	

	/**
	 * Retrieves a JSON object model based on the given IDs and Grant.
	 *
	 * @param ids The array of IDs used to retrieve the JSON object model.
	 * @param g The Grant object used for retrieving object information.
	 * @return The JSON object model.
	 */
	private static JSONObject getJsonModel(String[] ids, Grant g){
		JSONObject data = new JSONObject();
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			data.put(name, new JSONArray().put(formatObjectInJson(name, g)).put("//"+g.getTmpObject(name).getDesc()));
		}
		return data;
	}
	/**
		 * Calls the IA for data of the module based on the given IDs.
		 *
		 * @param ids the array of IDs
		 * @param g the Grant object
		 * @return the JSON object containing the data
		 * @throws PlatformException if there is an error in the platform
	*/
	private static JSONObject callIADataOnModule(String[] ids,String mldId, Grant g) throws PlatformException{
		JSONObject data = getJsonModel(ids, g);
		if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS)) AppLog.info("module uml: "+data.toString(1), g);
		String dataNumber = AITools.getAIParam("data_number","5");
		JSONObject jsonResponse = AITools.aiCaller(g, /* "module uml: "+json */"", " generates consistent data in json according to the model: ```json "+data.toString(1)+"``` with at least "+dataNumber+" entries per class",false,true);
		devSaveGenerationDataCost(mldId,jsonResponse.optJSONObject(AITools.USAGE_KEY));
		String response = AITools.parseJsonResponse(jsonResponse);
		JSONObject json = AITools.getValidJson(response);
		if(Tool.isEmpty(json)){	
			
			List<String> listResult = AITools.getJSONBlock(response,g);
			if(Tool.isEmpty(listResult) ){
				throw new PlatformException("Sorry AI do not return interpretable json: \n"+response);
			}else{
				json =AITools.getValidJson(listResult.get(1));
				if(Tool.isEmpty(json)){
					throw new PlatformException("Sorry AI do not return interpretable json: \n"+listResult.get(1));
				}
			}
		}
		return json;
	}

	/**
	 * Creates simplicité objects based on the given IDs, JSON data, and grant.
	 * 
	 * @param ids   the array of object IDs
	 * @param json  the JSON data
	 * @param g     the grant
	 * @return      the created objects as a JSONObject
	 * @throws JSONException       if there is an error with JSON parsing
	 * @throws GetException        if there is an error retrieving an object
	 * @throws ValidateException   if there is an error validating an object
	 * @throws SaveException       if there is an error saving an object
	 */
	private static JSONObject createObjects(String[] ids, JSONObject json, Grant g) throws JSONException, GetException, ValidateException, SaveException{
		JSONObject created = new JSONObject();
		List<CreatedObject> toUpdate = new ArrayList<>();
		JSONObject res = new JSONObject();
		for(String id : ids){
			String name = ObjectCore.getObjectName(id);
			JSONArray arrayRes = new JSONArray();
			for (Object obj : json.optJSONArray(name, new JSONArray())) {
				if (obj instanceof JSONObject) {
					CreatedObject objectToCreate = validateJsonAndCreate(name, (JSONObject) obj, created, arrayRes, g);
					if (objectToCreate != null) {
						toUpdate.add(objectToCreate);
					}
				}
			}
			res.put(g.getTmpObject(name).getDisplay(), arrayRes);
		}
		updateObjects(toUpdate,created,g);
		return res;
	}
	/**
	 * Updates the objects based on the provided parameters.
	 * 
	 * @param toUpdate the list of objects to update
	 * @param created the JSON object containing the created objects
	 * @param g the Grant object
	 * @throws GetException if there is an error retrieving data
	 * @throws ValidateException if there is an error validating the object
	 * @throws SaveException if there is an error saving the object
	 */
	private static void updateObjects(List<CreatedObject> toUpdate,JSONObject created,Grant g) throws GetException, ValidateException, SaveException{
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
	}
	/**
	 * Validates and passes or creates a new object based on the provided parameters.
	 * 
	 * @param objectToCreate The object to create or update.
	 * @param obj The ObjectDB instance.
	 * @param arrayRes The JSONArray to store the resulting objects.
	 * @param g The Grant instance.
	 * @throws GetException If there is an error retrieving data.
	 * @throws CreateException If there is an error creating the object.
	 * @throws ValidateException If there is an error validating the object.
	 */
	private static CreatedObject validateJsonAndCreate(String name, JSONObject json,JSONObject created,JSONArray arrayRes,Grant g) throws GetException, CreateException{
		ObjectDB obj = g.getTmpObject(name);
		CreatedObject objectToCreate = objectbyJSON(name, json,created,g);
		synchronized(obj.getLock()){
			BusinessObjectTool objT = obj.getTool();
			if(checkFuncIdAndRequired(objectToCreate.objectCreate, obj)){
				JSONObject filters = getFilter(objectToCreate.objectCreate, obj);
				try{
					if(Tool.isEmpty(filters)){
						objT.selectForCreate();
						obj.setValuesFromJSONObject(objectToCreate.objectCreate, true, false, true);
						obj.populate(true);
						objT.validateAndCreate();
					}else if(!objT.selectForCreateOrUpdate(filters)){
						obj.setValuesFromJSONObject(objectToCreate.objectCreate, true, false,true);
						if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info("create object: "+obj.getName()+" with values: "+objectToCreate.objectCreate.toString(1), g);
						obj.populate(true);
						objT.validateAndCreate();
					}
				}catch(ValidateException e){
					AppLog.info(name+":" + e.getMessage(),g);
					checkAndSetFields(obj,objT,g);
					
				}
		
				objectToCreate.rowId = obj.getRowId();
				if(!Tool.isEmpty(objectToCreate.rowId) && !"0".equals(objectToCreate.rowId) ){
					arrayRes.put(toDysplayJson(obj));
				}
			}
		}
		return checkUpdate(name, objectToCreate,json,created);
		
	}
	private static void checkAndSetFields(ObjectDB obj,BusinessObjectTool objT,Grant g){
		for(ObjectField fld : obj.getFields()){
			List<String> err = fld.validate(obj);
			if(!Tool.isEmpty(err)){
				if(Boolean.TRUE.equals(AITools.AI_DEBUG_LOGS))AppLog.info("error on field: "+fld.getName()+" with values: "+fld.getValue()+" | "+String.join(",",err), g);
				if(ObjectField.TYPE_EMAIL == fld.getType()){
					fld.setValue(DEFAULT_EMAIL);
				}else if(ObjectField.TYPE_PHONENUM == fld.getType()){
					fld.setValue( DEFAULT_PHONE);
				}else if(!fld.isRequired()){
					fld.setValue("");
				}else{
					break;
				}
			}
		}
		try{
			objT.validateAndCreate();
		}catch(ValidateException | CreateException e1){
			AppLog.info(e1.toString(), g);
		}
	}
	private static CreatedObject checkUpdate(String name, CreatedObject objectToCreate,JSONObject json,JSONObject created){
		if(!Tool.isEmpty(objectToCreate.rowId) && !"0".equals(objectToCreate.rowId)){
			String objid = json.optString("id");

			if (!Tool.isEmpty(objid)) {
				if (!created.has(name)) {
					created.put(name, new JSONObject());
				}
				created.getJSONObject(name).put(objid, objectToCreate.rowId);
			}
			if (objectToCreate.toUpdate) {
				return objectToCreate;
			}
		}
		return null;

	}
	/**
	 * Creates a new object based on the provided parameters.
	 * 
	 * @param name The name of the object to create.
	 * @param json The JSON object containing the data to create the object.
	 * @param existed The JSON object containing the existing objects.
	 * @param g The Grant object.
	 * @return The created object.
	 */
	private static CreatedObject objectbyJSON(String name, JSONObject json, JSONObject existed, Grant g){
		CreatedObject res = new CreatedObject(name);
		ObjectDB obj = g.getTmpObject(name);
		for (ObjectField field :obj.getFields()){
			if(field.isForeignKey()){
				processForeignKeyField(field, json, existed, res);
			} else if(json.has(field.getName())){
				processJsonField(field, json.get(field.getName()), res, g);
			} else if(!field.isTechnicalField() && (field.isRequired() || field.isFunctId())){
				processJsonField(field,null, res, g);
			}
		}
		return res;
	}


	/**
	 * Processes a foreign key field in the JSON object.
	 * If the field exists in the JSON object and is of type JSONObject, it extracts the ID and sets the foreign ID if it is created.
	 * If the field exists in the "link" object of the JSON and is of type JSONObject, it extracts the ID and sets the foreign ID if it is created.
	 * 
	 * @param field the ObjectField representing the foreign key field
	 * @param json the JSONObject containing the data
	 * @param existed the JSONObject representing the existing data
	 * @param res the CreatedObject to set the foreign ID on
	 */
	private static void processForeignKeyField(ObjectField field, JSONObject json, JSONObject existed, CreatedObject res) {
		String objName = field.getRefObjectName();
		if (json.has(objName) && json.get(objName) instanceof JSONObject){
			String id = json.getJSONObject(objName).optString("id");
			setForeingIdIfCreated(id, objName, field.getName(), existed, res);
		} else if(json.has("link") && json.get("link") instanceof JSONObject){
			JSONObject link = json.getJSONObject("link");
			if(link.has(objName)){
				String id=link.optString(objName,"");
				if(link.get(objName) instanceof JSONObject){
					id = link.getJSONObject(objName).optString("id");
				} 
				setForeingIdIfCreated(id, objName, field.getName(), existed, res);
			}		
		}
	}

	/**
	 * Sets the foreign ID if it already exists in the provided JSON object.
	 * If the ID exists, it is added to the "objectToCreate" .
	 * If the ID does not exist, it is added to "fieldToUpdate".
	 * 
	 * @param id The ID to check and set.
	 * @param objName The name of the object in the JSON.
	 * @param fieldName The name of the field to update.
	 * @param existed The JSON object containing existing data.
	 * @param res The object to update with the foreign ID.
	 */
	private static void setForeingIdIfCreated(String id, String objName,String fieldName, JSONObject existed, CreatedObject res){
		if(!Tool.isEmpty(id) && existed.has(objName) && existed.getJSONObject(objName).has(id)){
			String refRowId =existed.getJSONObject(objName).getString(id);
			res.objectCreate.put(fieldName, refRowId);
		} else if(!Tool.isEmpty(id)){
			res.toUpdate = true;
			res.fieldToUpdate.add(new RefField(objName, fieldName, id));
		}
	}


	/**
	 * Processes a JSON field and add default value if the value is not valid.
	 * 
	 * @param field The object field to process.
	 * @param val The value of the field.
	 * @param res The created object to add the field to.
	 * @param g The grant object.
	 */
	private static void processJsonField(ObjectField field, Object val, CreatedObject res, Grant g) {
		int type = field.getType();
		
		Object param = null;
		if(type == ObjectField.TYPE_ENUM || type == ObjectField.TYPE_ENUM_MULTI ) param = field.getList().getCodes(true);
		if(type == ObjectField.TYPE_REGEXP) param = field.getRegExp();
		String value = field.isNumeric()?getValidNumericValue(val, field.getFloatPrecision(),field.getSize(), type):getValidValue(val,type,param,field.getDisplay(),field,g);
		res.objectCreate.put(field.getName(), value);
	}

	/**
	 * Returns a valid numeric value as a string based on the given parameters.
	 * 
	 * @param val the value to be converted to a string
	 * @param precision the number of decimal places to include in the string representation
	 * @param size the maximum number of digits in the string representation
	 * @param type the type of the value (ObjectField.TYPE_INT for integer, other values for non-integer)
	 * @return a valid numeric value as a string
	 */
	private static String getValidNumericValue(Object val, int precision,int size, int type) {
		if (size > 6) size = 6;
		if (!(val instanceof Number)) {
			int max = (int) Math.pow(10, (size-precision)) - 1;
			return String.valueOf(random.nextInt(max));
		}else if((type != ObjectField.TYPE_INT) && precision>0 ){
			float max = getMax(size, precision);
			Number test= (Number)val;
			float value = Float.parseFloat(test.toString());
			if(value>max) value = randomFloat(max) ;
			return String.valueOf(value);
		}else{
			int max = (int) Math.pow(10,(size-precision)) - 1;
			int value = (int)val;
			if(value>max) value = random.nextInt(max);
			return String.valueOf(value);
		}
	}
	
	/**
	 * Returns a valid value based on the given parameters.
	 *
	 * @param val the value to validate
	 * @param type the type of the value
	 * @param param the parameter for validation
	 * @param fieldName the name of the field
	 * @param g the Grant object
	 * @return a valid value based on the given parameters
	 */
	private static String getValidValue(Object val, int type, Object param, String fieldName,ObjectField field,Grant g) {
		String value = "";
		switch (type) {
			case ObjectField.TYPE_PHONENUM:
				value = getValidPhoneNumValue(val, g);
				break;
			case ObjectField.TYPE_ENUM_MULTI:
			case ObjectField.TYPE_ENUM:
				value = getValidEnumValue(val, param);
				break;
			case ObjectField.TYPE_DATE:
				value = getValidDateValue(val,field.getRendering());
				break;
			case ObjectField.TYPE_DATETIME:
				value = getValidDateTimeValue(val);
				break;
			case ObjectField.TYPE_TIME:
				value = getValidTimeValue(val,field.getRendering());
				break;
			case ObjectField.TYPE_GEOCOORDS:
				value = getValidGeoCoordsValue(val);
				break;
			case ObjectField.TYPE_EMAIL:
				value = getValidEmailValue(val);
				break;
			case ObjectField.TYPE_REGEXP:
				value = getValidRegExpValue(val, param);
				break;
			case ObjectField.TYPE_IMAGE:
			case ObjectField.TYPE_DOC:
			case ObjectField.TYPE_EXTFILE:
				value = "";
				break;
			default:
				value = getValidDefaultValue(val, fieldName);
				break;
		}
		return value;
	}

	private static String getValidPhoneNumValue(Object val, Grant g) {
		String value = (val instanceof String) ? (String) val : "";
		try {
			if (!new PhoneNumTool().isValid(value)) {
				value = DEFAULT_PHONE;
			}
		} catch (ParamsException e) {
			AppLog.error(e, g);
			value = DEFAULT_PHONE;
		}
		return value;
	}

	private static String getValidEnumValue(Object val, Object param) {
		String value = "";
		if (val instanceof JSONArray) {
			JSONArray array = (JSONArray) val;
			if (array.length() > 0) {
				value = array.getString(random.nextInt(array.length()));
			}
		} else if (val instanceof String) {
			value = (String) val;
		}
		String[] list = (String[]) param;
		if (!Arrays.asList(list).contains(value)) {
			value = list[random.nextInt(list.length)];
		}
		return value;
	}

	private static String getValidDateValue(Object val,String rendering) {
		String value = (val instanceof String) ? (String) val : "";
		return getValidDate(value,rendering);
	}

	private static String getValidDateTimeValue(Object val) {
		String value = (val instanceof String) ? (String) val : "";
		if (!Tool.isDateTime(value)) {
			value = Tool.getCurrentDateTime();
		}
		return value;
	}
	private static String getValidTimeValue(Object val,String rendering) {
		String value = (val instanceof String) ? (String) val : "";
		return getValideTime(value,rendering);
	}
	
	private static String getValidDate(String value,String rendering){
		//yyyy-MM-dd
		switch (rendering) {
			case "Y":
				
				if(isDateRendering(value, rendering)){
					return value+"-01-01";
				}else if(isDateRendering(value, "M") || isDateRendering(value, "")){
					return value.substring(0,4)+"-01-01";
				}
				break;
			case "M":
				if(isDateRendering(value, rendering)){
					return value+"-01";
				}else if(isDateRendering(value, "")){
					return value.substring(0, 7)+"-01";
				}
				break;
			default:
				if(isDateRendering(value, "")){
					return value;
				}
				break;
		}
		
		return Tool.getCurrentDate();
	}
	private static boolean isDateRendering(String value,String rendering){
		//yyyy-MM-dd
		String regex = "";
		switch (rendering) {
			case "Y":
				regex = "^\\d{4}$";
				break;
			case "M":
				regex = "^\\d{4}-(?:0?[1-9]|1[0-2])$";
				break;
			default:
				regex = "^\\d{4}-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[12][0-9]|3[01])$";
				break;
		}
		return value.matches(regex);
	}
	private static String getValideTime(String value,String rendering){
		switch (rendering) {
			case "H":
				if(isTimeRendering(value, rendering)){
					return value+":00:00";
				}else if(isTimeRendering(value, "") || isTimeRendering(value, "I")){
					return value.substring(0,2)+":00:00";
				}
				break;
			case "I":
				if(isTimeRendering(value, rendering)){
					return value+":00";
				}else if(isTimeRendering(value, "")){
					return value.substring(0,5)+":00";
				}
				break;
			default:
				if(isTimeRendering(value, "")){
					return value;
				}
				break;
		}
		return Tool.getCurrentTime();
	}
	private static boolean isTimeRendering(String value,String rendering){
		//HH:mm:ss
		String regex = "";
		switch (rendering) {
			case "H":
				regex = "^(?:[01]?[0-9]|2[0-3])$";
				break;
			case "I":
				regex = "^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$";
				break;
			default:
				regex = "^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$";
				break;
		}
		return value.matches(regex);
	}
	
	private static String getValidGeoCoordsValue(Object val) {
		String value = (val instanceof String) ? (String) val : "";
		double[] geo = Tool.parseCoordinates(value);
		if (geo[0] == 0 && geo[1] == 0) {
			value = "48.8534100;2.3488000"; // Default coordinates for Paris
		} else {
			value = geo[0] + ";" + geo[1];
		}
		return value;
	}

	private static String getValidEmailValue(Object val) {
		String value = (val instanceof String) ? (String) val : "";
		if (!Tool.checkEmail(value)) {
			value = DEFAULT_EMAIL;
		}
		return value;
	}

	private static String getValidRegExpValue(Object val, Object param) {
		String value = (val instanceof String) ? (String) val : "";
		String regex = (String) param;
		if (!value.matches(regex)) {
			value = "";
		}
		return value;
	}

	private static String getValidDefaultValue(Object val,String fieldName) {
		return (val instanceof String) ? (String) val : fieldName + "_" + random.nextInt(3);
	}

	/**
	 * This method performs preprocessing on a JSONObject.
	 * It iterates through the keys of the JSONObject and processes each object based on its type.
	 * If the object is an array, it iterates through the elements and processes each nested JSONObject.
	 * If the object is a JSONObject, it processes the object and converts it into a JSONArray.
	 * The processed objects are stored in a new JSONObject and returned.
	 *
	 * @param json The JSONObject to be preprocessed.
	 * @param g The Grant object used for processing.
	 * @return The preprocessed JSONObject.
	 */
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
				json.put(objName,new JSONArray().put(obj));
			}

			
		}
		return res;
	}
	

	/**
	 * Processes an object and adds it to the result JSON.
	 * If the object has a "link" property, it processes the linked object recursively.
	 * If the result JSON does not have an array for the given object name, it creates one.
	 * Finally, it adds the processed object to the array in the result JSON.
	 *
	 * @param objName   the name of the object
	 * @param obj       the object to be processed
	 * @param res       the result JSON object
	 * @param idProcess the current process ID
	 * @param g         the Grant object
	 * @return the updated process ID
	 */
	private static int processObject(String objName, JSONObject obj, JSONObject res, int idProcess, Grant g){
		checkId(obj);
		if(obj.has("link") && obj.get("link") instanceof JSONObject){
           idProcess = processLink(obj.getJSONObject("link"),idProcess,res,g);
		}
		if(!res.has(objName)){
			res.put(objName, new JSONArray());
		}
		res.getJSONArray(objName).put(obj);

		return idProcess;
	}
    private static void checkId(JSONObject obj){
        if(!obj.has("id")){
			for(String key : obj.keySet()){
				if (key.matches(".*[i,I][d,D]$")){
					obj.put("id" ,obj.get(key));
					break;
				}
			}
		}
    }
    private static int checkLinkId(JSONObject linkObj,int idProcess){
        if(!linkObj.has("id")){
            linkObj.put("id", "prc_"+idProcess);
            idProcess++;
        }else if(linkObj.get("id") instanceof Number){
            linkObj.put("id", String.valueOf(linkObj.get("id")));
        }
        return idProcess;
    }
    private static int processLink(JSONObject link, int idProcess,JSONObject res , Grant g){
			Iterator<String> keysLink = link.keys();
			while (keysLink.hasNext()) {
				String linkName = keysLink.next();
				if(link.get(linkName) instanceof JSONObject){
					JSONObject linkObj = link.getJSONObject(linkName);
					if(linkObj.length()>1){
						idProcess = checkLinkId(linkObj,idProcess);				
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
	private static boolean checkFuncIdAndRequired(JSONObject json , ObjectDB obj){
		List<ObjectField> fields = obj.getFields();
		if(Tool.isEmpty(fields)) return true;
		for(ObjectField f : fields){
			if(!json.has(f.getName()) && !f.isTechnicalField() && (f.isRequired() || f.isFunctId()) ){
				return false;
			}
		}
		return true;
	}
	private static float getMax(int size, int precision) {
		int maxInt = (int) Math.pow(10, (size-precision)) - 1;
		float  denary = (float) Math.pow(10, precision);
		denary = (denary-1)/denary;
		return maxInt + denary;
		 
	}
	/**
	 * Formats the result as a string.
	 *
	 * @param json the JSON object to format
	 * @return the formatted result as a string
	 */
	private static String formatResult(JSONObject json) {
		StringBuilder html = new StringBuilder();
		formatJson(json, html);
		return html.toString();
	}

	/**
	 * Formats a JSON object into an HTML unordered list.
	 * Recursively iterates through the JSON object and its nested objects and arrays,
	 * appending the formatted HTML to the provided StringBuilder.
	 *
	 * @param json The JSON object to format.
	 * @param html The StringBuilder to append the formatted HTML to.
	 */
	private static void formatJson(JSONObject json, StringBuilder html) {
		html.append("<ul>");
		for (String key : json.keySet()) {
			Object value = json.get(key);
			html.append("<li>");
			html.append("<strong>").append(key).append("</strong>: ");
			if (value instanceof JSONObject) {
				formatJson((JSONObject) value, html);
			} else if (value instanceof JSONArray) {
				formatJsonArray((JSONArray) value, html);
			} else {
				html.append(value);
			}
			html.append("</li>");
		}
		html.append("</ul>");
	}

	/**
	 * Formats a JSON array into an HTML unordered list.
	 * 
	 * @param jsonArray the JSON array to format
	 * @param html the StringBuilder to append the formatted HTML to
	 */
	private static void formatJsonArray(JSONArray jsonArray, StringBuilder html) {
		html.append("<ul>");
		for (int i = 0; i < jsonArray.length(); i++) {
			Object value = jsonArray.get(i);
			html.append("<li>");
			if (value instanceof JSONObject) {
				formatJson((JSONObject) value, html);
			} else if (value instanceof JSONArray) {
				formatJsonArray((JSONArray) value, html);
			} else {
				html.append(value);
			}
			html.append("</li>");
		}
		html.append("</ul>");
	}
	/**
	 * Converts an ObjectDB instance to a JSONObject for display purposes.
	 *
	 * @param obj The ObjectDB instance to convert.
	 * @return The converted JSONObject.
	 */
	private static JSONObject toDysplayJson(ObjectDB obj){

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


	private static float randomFloat(float max){
		return max * random.nextFloat();
	}
	
	private static void devSaveGenerationDataCost(String mldId, JSONObject cost){
		if(!Tool.isEmpty(ModuleDB.getModuleId("DevAIAddon", false))){
			Grant admin = Grant.getSystemAdmin();
			admin.addAccessObject(DAA_DATA_GENERATION);
			admin.addAccessCreate(DAA_DATA_GENERATION);
			admin.addAccessRead(DEVOBJ_GENERATE_MLDS);
			admin.addAccessCreate(DEVOBJ_GENERATE_MLDS);
			
			ObjectDB obj = admin.getTmpObject(DEVOBJ_GENERATE_MLDS);
			obj.resetFilters();
			obj.setFieldFilter("daaGmlModuleId", mldId);
			List<String[]> r = obj.search();
			String glmId;
			if(Tool.isEmpty(r)){
				synchronized(obj.getLock()){
					BusinessObjectTool objT = obj.getTool();
					try {
						objT.selectForCreate();
						obj.setFieldValue("daaGmlModuleId", mldId,false);
						obj.setFieldValue("daaGmlModuleName",ModuleDB.getModuleName(mldId));
						objT.validateAndCreate();
						glmId = obj.getRowId();
					} catch (GetException | CreateException | ValidateException e) {
						AppLog.warning("Dev list object not Created",e);
						return;
					}
				}
			}else{
				glmId = r.get(0)[obj.getFieldIndex("row_id")];
			}
			obj = admin.getTmpObject(DAA_DATA_GENERATION);
			synchronized(obj.getLock()){
				BusinessObjectTool objT = obj.getTool();
				try {
					objT.selectForCreate();
					obj.setFieldValue("daaDgGmlId", glmId,false);
					obj.setFieldValue("daaDgCost",cost);
					objT.validateAndCreate();
				} catch (GetException | CreateException | ValidateException e) {
					AppLog.warning("Dev list object not Created",e);
				}
			}
		}
	}
}