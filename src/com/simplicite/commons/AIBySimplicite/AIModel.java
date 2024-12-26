package com.simplicite.commons.AIBySimplicite;


import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;

import com.simplicite.bpm.ActivityFile;
import com.simplicite.bpm.DataFile;
import com.simplicite.bpm.Processus;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;


/**
 * Shared code AIModel
 */
public class AIModel implements java.io.Serializable {
	private static final long serialVersionUID = 1L;

	private static final String OBJECT_INTERNAL_NAME = "ObjectInternal";
	private static final String OBJECT_FIELD_SYSTEM_NAME = "ObjectFieldSystem";
	private static final String OBJECT_NAME_FIELD = "obo_name";
	private static final String OBJECT_DB_FIELD = "obo_dbtable";
	private static final String OBJECT_DESCRIPTION = "obo_comment";
	private static final String OBJECT_ICON_FIELD = "obo_icon";
	private static final String OBJECT_PREFIX_FIELD  = "obo_prefix";
	private static final String MODULE_ID_FIELD = "row_module_id";
	private static final String OBJECTFIELD = "Field";
	private static final String OBJECTFIELD_OBJECT_FIELD = "obf_object_id";
	private static final String OBJECTFIELD_ORDER_FIELD = "obf_order";
	private static final String OBJECTFIELD_FIELD_FIELD = "obf_field_id";

	private static final String ACTIVITY_METHOD = "Method";
	private static final String ACTIVITY = "Activity";


	private static final String JSON_ENUM_KEY = "Enumeration";
	private static final String JSON_LINK_KEY = "relationships";
	private static final String JSON_TRIGRAM_KEY = "trigram";
	private static final String JSON_COMMENT_KEY = "comment";
	private static final String JSON_LINK_CLASS_FROM_KEY = "class1";
	private static final String JSON_LINK_CLASS_TO_KEY = "class2";
	private static final String JSON_VALUES_LOWER_KEY = "values";
	private static final String JSON_VALUES_UPPER_KEY = "Values";
	private static final String NOT_WORD_CHAR_REGEX = "[^\\w]";
	private static final Random rand = new Random();
	private static final String SHORT_TEXT ="Short text";
	private static final String HEXA_BLACK ="#303030";
	private static final String HEXA_WHITE ="#FFFFFF";
	private static final String IS_STATUS ="isStatus";
	private static final String CLASS ="class";
	private static final JSONObject DEFAULT_CODE_FK = new JSONObject()
															.put("name","code")
															.put("fr","Code")
															.put("en","Code")
															.put("key",true)
															.put("required",true)
															.put("type",SHORT_TEXT)
															.put(IS_STATUS,false)
															.put(CLASS,"");
	private static class EnumFieldStyle {
		private String bg;   //background color
		private String hexa; //hexadecimal color
		private String color; //text color
		private String icon; //icon name
		
		public EnumFieldStyle(String bg, String hexa,String color, String icon) {
			this.bg = bg;
			this.hexa = hexa;
			this.color = color;
			this.icon = icon;
			
		}
	}
	private static class LinkObject {
		private String objId;
		private String en;
		private String fr;
		private int linkorder;

		public LinkObject(String objId, String en, String fr, int linkorder) {
			this.objId = objId;
			this.en = en;
			this.fr = fr;
			this.linkorder = linkorder;
		}
	}
	private static class ModuleInfo {
		private String moduleId;
		private String mPrefix;
		private String[] groupIds;
		private String domainID;
		private Grant g;

		public ModuleInfo(String moduleId, String mPrefix, String[] groupIds, String domainID) {
			this.moduleId = moduleId;
			this.mPrefix = mPrefix;
			this.groupIds = groupIds;
			this.domainID = domainID;
			this.g = Grant.getSystemAdmin();
		}

		
	}
	
	private static class DataMapObject {
		private HashMap<String, String> objCreate;
		private HashMap<String, String> objFr;
		private HashMap<String, String> objEn;
		private HashMap<String, String> fldFr;
		private HashMap<String, String> fldEn;
		private HashMap<String, String> fieldCreate;
		private List<String> linkDone ;

		public DataMapObject() {
			this.objCreate = new HashMap<>();
			this.objFr = new HashMap<>();
			this.objEn = new HashMap<>();
			this.fldFr = new HashMap<>();
			this.fldEn = new HashMap<>();
			this.fieldCreate = new HashMap<>();
			this.linkDone = new ArrayList<>();
			
		}
	}
	private static HashMap<String, Integer> typeTrad;
	private static List<String> shortListIcon;
	private static List<String> listIcon;
	private static List<String> linkType;
	private static HashMap<String, EnumFieldStyle> enumColors;
	static {
		typeTrad = new HashMap<>();
		typeTrad.put("Short text < 4000", ObjectField.TYPE_STRING);
		typeTrad.put(SHORT_TEXT, ObjectField.TYPE_STRING);
		typeTrad.put("Long text", ObjectField.TYPE_LONG_STRING);
		typeTrad.put("Integer", ObjectField.TYPE_INT);
		typeTrad.put("Decimal", ObjectField.TYPE_FLOAT);
		typeTrad.put("BigDecimal", ObjectField.TYPE_BIGDECIMAL);
		typeTrad.put("Date", ObjectField.TYPE_DATE);
		typeTrad.put("Date and time", ObjectField.TYPE_DATETIME);
		typeTrad.put("Time", ObjectField.TYPE_TIME);
		typeTrad.put(JSON_ENUM_KEY, ObjectField.TYPE_ENUM);
		typeTrad.put("Multiple enumeration", ObjectField.TYPE_ENUM_MULTI);
		typeTrad.put("Boolean", ObjectField.TYPE_BOOLEAN);
		typeTrad.put("URL", ObjectField.TYPE_URL);
		typeTrad.put("HTML content", ObjectField.TYPE_HTML);
		typeTrad.put("Email", ObjectField.TYPE_EMAIL);
		typeTrad.put("Document", ObjectField.TYPE_DOC);
		typeTrad.put("Object", ObjectField.TYPE_OBJECT);
		typeTrad.put("Password", ObjectField.TYPE_PASSWORD);
		typeTrad.put("External file", ObjectField.TYPE_EXTFILE);
		typeTrad.put("Image", ObjectField.TYPE_IMAGE);
		typeTrad.put("Notepad", ObjectField.TYPE_NOTEPAD);
		typeTrad.put("Phone number", ObjectField.TYPE_PHONENUM);
		typeTrad.put("Color", ObjectField.TYPE_COLOR);
		typeTrad.put("Geographical coordinates", ObjectField.TYPE_GEOCOORDS);
		enumColors = new HashMap<>();
		enumColors.put("red", new EnumFieldStyle("redbg", "#D9534F", HEXA_WHITE, "btn_red"));
		enumColors.put("orange", new EnumFieldStyle("orangebg", "#F0AD4E", HEXA_WHITE, "btn_orange"));
		enumColors.put("pink", new EnumFieldStyle("pinkbg", "#FF8EC1", HEXA_WHITE, "btn_pink"));
		enumColors.put("green", new EnumFieldStyle("greenbg", "#5CB85C", HEXA_WHITE, "btn_green"));
		enumColors.put("blue", new EnumFieldStyle("bluebg", "#5BC0DE", HEXA_WHITE, "btn_blue"));
		enumColors.put("white", new EnumFieldStyle("whitebg", HEXA_WHITE, HEXA_BLACK, "btn_white"));
		enumColors.put("black", new EnumFieldStyle("blackbg", HEXA_BLACK, HEXA_WHITE, "btn_black"));
		enumColors.put("yellow", new EnumFieldStyle("yellowbg", "#FFEF8D", HEXA_BLACK, "btn_yellow"));
		enumColors.put("purple", new EnumFieldStyle("purplebg", "#8C6AC4", HEXA_WHITE, "btn_purple"));
		enumColors.put("brown", new EnumFieldStyle("brownbg", "#CE8E67", HEXA_WHITE, "btn_brown"));
		enumColors.put("grey", new EnumFieldStyle("greybg", "#D0D0D0", HEXA_WHITE, "btn_grey"));
		shortListIcon = Arrays.asList("star", "book", "arrow-up", "arrow-down", "clock", "envelope", "search", "folder", "list", "phone", "cloud", "key", "file", "calendar");
		listIcon = Arrays.asList("1-circle-fill","1-circle","1-square-fill","1-square","123","2-circle-fill","2-circle","2-square-fill","2-square","3-circle-fill",
		"3-circle","3-square-fill","3-square","4-circle-fill","4-circle","4-square-fill","4-square","5-circle-fill","5-circle","5-square-fill",
		"5-square","6-circle-fill","6-circle","6-square-fill","6-square","7-circle-fill","7-circle","7-square-fill","7-square","8-circle-fill",
		"8-circle","8-square-fill","8-square","9-circle-fill","9-circle","9-square-fill","9-square","activity","airplane-engines-fill","airplane-engines",
		"airplane-fill","airplane","alarm-fill","alarm","alexa","align-bottom","align-center","align-end","align-middle","align-start",
		"align-top","alipay","alt","android","android2","app-indicator","app","apple","archive-fill","archive",
		"arrow-90deg-down","arrow-90deg-left","arrow-90deg-right","arrow-90deg-up","arrow-bar-down","arrow-bar-left","arrow-bar-right","arrow-bar-up","arrow-clockwise","arrow-counterclockwise",
		"arrow-down-circle-fill","arrow-down-circle","arrow-down-left-circle-fill","arrow-down-left-circle","arrow-down-left-square-fill","arrow-down-left-square","arrow-down-left","arrow-down-right-circle-fill","arrow-down-right-circle","arrow-down-right-square-fill",
		"arrow-down-right-square","arrow-down-right","arrow-down-short","arrow-down-square-fill","arrow-down-square","arrow-down-up","arrow-down","arrow-left-circle-fill","arrow-left-circle","arrow-left-right",
		"arrow-left-short","arrow-left-square-fill","arrow-left-square","arrow-left","arrow-repeat","arrow-return-left","arrow-return-right","arrow-right-circle-fill","arrow-right-circle","arrow-right-short",
		"arrow-right-square-fill","arrow-right-square","arrow-right","arrow-through-heart-fill","arrow-through-heart","arrow-up-circle-fill","arrow-up-circle","arrow-up-left-circle-fill","arrow-up-left-circle","arrow-up-left-square-fill",
		"arrow-up-left-square","arrow-up-left","arrow-up-right-circle-fill","arrow-up-right-circle","arrow-up-right-square-fill","arrow-up-right-square","arrow-up-right","arrow-up-short","arrow-up-square-fill","arrow-up-square",
		"arrow-up","arrows-angle-contract","arrows-angle-expand","arrows-collapse","arrows-expand","arrows-fullscreen","arrows-move","aspect-ratio-fill","aspect-ratio","asterisk",
		"at","award-fill","award","back","backspace-fill","backspace-reverse-fill","backspace-reverse","backspace","badge-3d-fill","badge-3d",
		"badge-4k-fill","badge-4k","badge-8k-fill","badge-8k","badge-ad-fill","badge-ad","badge-ar-fill","badge-ar","badge-cc-fill","badge-cc",
		"badge-hd-fill","badge-hd","badge-sd-fill","badge-sd","badge-tm-fill","badge-tm","badge-vo-fill","badge-vo","badge-vr-fill","badge-vr",
		"badge-wc-fill","badge-wc","bag-check-fill","bag-check","bag-dash-fill","bag-dash","bag-fill","bag-heart-fill","bag-heart","bag-plus-fill",
		"bag-plus","bag-x-fill","bag-x","bag","balloon-fill","balloon-heart-fill","balloon-heart","balloon","bandaid-fill","bandaid",
		"bank","bank2","bar-chart-fill","bar-chart-line-fill","bar-chart-line","bar-chart-steps","bar-chart","basket-fill","basket","basket2-fill",
		"basket2","basket3-fill","basket3","battery-charging","battery-full","battery-half","battery","behance","bell-fill","bell-slash-fill",
		"bell-slash","bell","bezier","bezier2","bicycle","binoculars-fill","binoculars","blockquote-left","blockquote-right","bluetooth",
		"body-text","book-fill","book-half","book","bookmark-check-fill","bookmark-check","bookmark-dash-fill","bookmark-dash","bookmark-fill","bookmark-heart-fill",
		"bookmark-heart","bookmark-plus-fill","bookmark-plus","bookmark-star-fill","bookmark-star","bookmark-x-fill","bookmark-x","bookmark","bookmarks-fill","bookmarks",
		"bookshelf","boombox-fill","boombox","bootstrap-fill","bootstrap-icons","bootstrap-reboot","bootstrap","border-all","border-bottom","border-center",
		"border-inner","border-left","border-middle","border-outer","border-right","border-style","border-top","border-width","border","bounding-box-circles",
		"bounding-box","box-arrow-down-left","box-arrow-down-right","box-arrow-down","box-arrow-in-down-left","box-arrow-in-down-right","box-arrow-in-down","box-arrow-in-left","box-arrow-in-right","box-arrow-in-up-left",
		"box-arrow-in-up-right","box-arrow-in-up","box-arrow-left","box-arrow-right","box-arrow-up-left","box-arrow-up-right","box-arrow-up","box-fill","box-seam-fill","box-seam",
		"box","box2-fill","box2-heart-fill","box2-heart","box2","boxes","braces-asterisk","braces","bricks","briefcase-fill",
		"briefcase","brightness-alt-high-fill","brightness-alt-high","brightness-alt-low-fill","brightness-alt-low","brightness-high-fill","brightness-high","brightness-low-fill","brightness-low","broadcast-pin",
		"broadcast","browser-chrome","browser-edge","browser-firefox","browser-safari","brush-fill","brush","bucket-fill","bucket","bug-fill",
		"bug","building","bullseye","c-circle-fill","c-circle","c-square-fill","c-square","calculator-fill","calculator","calendar-check-fill",
		"calendar-check","calendar-date-fill","calendar-date","calendar-day-fill","calendar-day","calendar-event-fill","calendar-event","calendar-fill","calendar-heart-fill","calendar-heart",
		"calendar-minus-fill","calendar-minus","calendar-month-fill","calendar-month","calendar-plus-fill","calendar-plus","calendar-range-fill","calendar-range","calendar-week-fill","calendar-week",
		"calendar-x-fill","calendar-x","calendar","calendar2-check-fill","calendar2-check","calendar2-date-fill","calendar2-date","calendar2-day-fill","calendar2-day","calendar2-event-fill",
		"calendar2-event","calendar2-fill","calendar2-heart-fill","calendar2-heart","calendar2-minus-fill","calendar2-minus","calendar2-month-fill","calendar2-month","calendar2-plus-fill","calendar2-plus",
		"calendar2-range-fill","calendar2-range","calendar2-week-fill","calendar2-week","calendar2-x-fill","calendar2-x","calendar2","calendar3-event-fill","calendar3-event","calendar3-fill",
		"calendar3-range-fill","calendar3-range","calendar3-week-fill","calendar3-week","calendar3","calendar4-event","calendar4-range","calendar4-week","calendar4","camera-fill",
		"camera-reels-fill","camera-reels","camera-video-fill","camera-video-off-fill","camera-video-off","camera-video","camera","camera2","capslock-fill","capslock",
		"capsule-pill","capsule","car-front-fill","car-front","card-checklist","card-heading","card-image","card-list","card-text","caret-down-fill",
		"caret-down-square-fill","caret-down-square","caret-down","caret-left-fill","caret-left-square-fill","caret-left-square","caret-left","caret-right-fill","caret-right-square-fill","caret-right-square",
		"caret-right","caret-up-fill","caret-up-square-fill","caret-up-square","caret-up","cart-check-fill","cart-check","cart-dash-fill","cart-dash","cart-fill",
		"cart-plus-fill","cart-plus","cart-x-fill","cart-x","cart","cart2","cart3","cart4","cash-coin","cash-stack",
		"cash","cassette-fill","cassette","cast","cc-circle-fill","cc-circle","cc-square-fill","cc-square","chat-dots-fill","chat-dots",
		"chat-fill","chat-heart-fill","chat-heart","chat-left-dots-fill","chat-left-dots","chat-left-fill","chat-left-heart-fill","chat-left-heart","chat-left-quote-fill","chat-left-quote",
		"chat-left-text-fill","chat-left-text","chat-left","chat-quote-fill","chat-quote","chat-right-dots-fill","chat-right-dots","chat-right-fill","chat-right-heart-fill","chat-right-heart",
		"chat-right-quote-fill","chat-right-quote","chat-right-text-fill","chat-right-text","chat-right","chat-square-dots-fill","chat-square-dots","chat-square-fill","chat-square-heart-fill","chat-square-heart",
		"chat-square-quote-fill","chat-square-quote","chat-square-text-fill","chat-square-text","chat-square","chat-text-fill","chat-text","chat","check-all","check-circle-fill",
		"check-circle","check-lg","check-square-fill","check-square","check","check2-all","check2-circle","check2-square","check2","chevron-bar-contract",
		"chevron-bar-down","chevron-bar-expand","chevron-bar-left","chevron-bar-right","chevron-bar-up","chevron-compact-down","chevron-compact-left","chevron-compact-right","chevron-compact-up","chevron-contract",
		"chevron-double-down","chevron-double-left","chevron-double-right","chevron-double-up","chevron-down","chevron-expand","chevron-left","chevron-right","chevron-up","circle-fill",
		"circle-half","circle-square","circle","clipboard-check-fill","clipboard-check","clipboard-data-fill","clipboard-data","clipboard-fill","clipboard-heart-fill","clipboard-heart",
		"clipboard-minus-fill","clipboard-minus","clipboard-plus-fill","clipboard-plus","clipboard-pulse","clipboard-x-fill","clipboard-x","clipboard","clipboard2-check-fill","clipboard2-check",
		"clipboard2-data-fill","clipboard2-data","clipboard2-fill","clipboard2-heart-fill","clipboard2-heart","clipboard2-minus-fill","clipboard2-minus","clipboard2-plus-fill","clipboard2-plus","clipboard2-pulse-fill",
		"clipboard2-pulse","clipboard2-x-fill","clipboard2-x","clipboard2","clock-fill","clock-history","clock","cloud-arrow-down-fill","cloud-arrow-down","cloud-arrow-up-fill",
		"cloud-arrow-up","cloud-check-fill","cloud-check","cloud-download-fill","cloud-download","cloud-drizzle-fill","cloud-drizzle","cloud-fill","cloud-fog-fill","cloud-fog",
		"cloud-fog2-fill","cloud-fog2","cloud-hail-fill","cloud-hail","cloud-haze-1","cloud-haze-fill","cloud-haze","cloud-haze2-fill","cloud-haze2","cloud-lightning-fill",
		"cloud-lightning-rain-fill","cloud-lightning-rain","cloud-lightning","cloud-minus-fill","cloud-minus","cloud-moon-fill","cloud-moon","cloud-plus-fill","cloud-plus","cloud-rain-fill",
		"cloud-rain-heavy-fill","cloud-rain-heavy","cloud-rain","cloud-slash-fill","cloud-slash","cloud-sleet-fill","cloud-sleet","cloud-snow-fill","cloud-snow","cloud-sun-fill",
		"cloud-sun","cloud-upload-fill","cloud-upload","cloud","clouds-fill","clouds","cloudy-fill","cloudy","code-slash","code-square",
		"code","coin","collection-fill","collection-play-fill","collection-play","collection","columns-gap","columns","command","compass-fill",
		"compass","cone-striped","cone","controller","cpu-fill","cpu","credit-card-2-back-fill","credit-card-2-back","credit-card-2-front-fill","credit-card-2-front",
		"credit-card-fill","credit-card","crop","cup-fill","cup-hot-fill","cup-hot","cup-straw","cup","currency-bitcoin","currency-dollar",
		"currency-euro","currency-exchange","currency-pound","currency-rupee","currency-yen","cursor-fill","cursor-text","cursor","dash-circle-dotted","dash-circle-fill",
		"dash-circle","dash-lg","dash-square-dotted","dash-square-fill","dash-square","dash","device-hdd-fill","device-hdd","device-ssd-fill","device-ssd",
		"diagram-2-fill","diagram-2","diagram-3-fill","diagram-3","diamond-fill","diamond-half","diamond","dice-1-fill","dice-1","dice-2-fill",
		"dice-2","dice-3-fill","dice-3","dice-4-fill","dice-4","dice-5-fill","dice-5","dice-6-fill","dice-6","disc-fill",
		"disc","discord","display-fill","display","displayport-fill","displayport","distribute-horizontal","distribute-vertical","door-closed-fill","door-closed",
		"door-open-fill","door-open","dot","download","dpad-fill","dpad","dribbble","dropbox","droplet-fill","droplet-half",
		"droplet","ear-fill","ear","earbuds","easel-fill","easel","easel2-fill","easel2","easel3-fill","easel3",
		"egg-fill","egg-fried","egg","eject-fill","eject","emoji-angry-fill","emoji-angry","emoji-dizzy-fill","emoji-dizzy","emoji-expressionless-fill",
		"emoji-expressionless","emoji-frown-fill","emoji-frown","emoji-heart-eyes-fill","emoji-heart-eyes","emoji-kiss-fill","emoji-kiss","emoji-laughing-fill","emoji-laughing","emoji-neutral-fill",
		"emoji-neutral","emoji-smile-fill","emoji-smile-upside-down-fill","emoji-smile-upside-down","emoji-smile","emoji-sunglasses-fill","emoji-sunglasses","emoji-wink-fill","emoji-wink","envelope-check-fill",
		"envelope-check","envelope-dash-fill","envelope-dash","envelope-exclamation-fill","envelope-exclamation","envelope-fill","envelope-heart-fill","envelope-heart","envelope-open-fill","envelope-open-heart-fill",
		"envelope-open-heart","envelope-open","envelope-paper-fill","envelope-paper-heart-fill","envelope-paper-heart","envelope-paper","envelope-plus-fill","envelope-plus","envelope-slash-fill","envelope-slash",
		"envelope-x-fill","envelope-x","envelope","eraser-fill","eraser","escape","ethernet","ev-station-fill","ev-station","exclamation-circle-fill",
		"exclamation-circle","exclamation-diamond-fill","exclamation-diamond","exclamation-lg","exclamation-octagon-fill","exclamation-octagon","exclamation-square-fill","exclamation-square","exclamation-triangle-fill","exclamation-triangle",
		"exclamation","exclude","explicit-fill","explicit","eye-fill","eye-slash-fill","eye-slash","eye","eyedropper","eyeglasses",
		"facebook","fan","fast-forward-btn-fill","fast-forward-btn","fast-forward-circle-fill","fast-forward-circle","fast-forward-fill","fast-forward","file-arrow-down-fill","file-arrow-down",
		"file-arrow-up-fill","file-arrow-up","file-bar-graph-fill","file-bar-graph","file-binary-fill","file-binary","file-break-fill","file-break","file-check-fill","file-check",
		"file-code-fill","file-code","file-diff-fill","file-diff","file-earmark-arrow-down-fill","file-earmark-arrow-down","file-earmark-arrow-up-fill","file-earmark-arrow-up","file-earmark-bar-graph-fill","file-earmark-bar-graph",
		"file-earmark-binary-fill","file-earmark-binary","file-earmark-break-fill","file-earmark-break","file-earmark-check-fill","file-earmark-check","file-earmark-code-fill","file-earmark-code","file-earmark-diff-fill","file-earmark-diff",
		"file-earmark-easel-fill","file-earmark-easel","file-earmark-excel-fill","file-earmark-excel","file-earmark-fill","file-earmark-font-fill","file-earmark-font","file-earmark-image-fill","file-earmark-image","file-earmark-lock-fill",
		"file-earmark-lock","file-earmark-lock2-fill","file-earmark-lock2","file-earmark-medical-fill","file-earmark-medical","file-earmark-minus-fill","file-earmark-minus","file-earmark-music-fill","file-earmark-music","file-earmark-pdf-fill",
		"file-earmark-pdf","file-earmark-person-fill","file-earmark-person","file-earmark-play-fill","file-earmark-play","file-earmark-plus-fill","file-earmark-plus","file-earmark-post-fill","file-earmark-post","file-earmark-ppt-fill",
		"file-earmark-ppt","file-earmark-richtext-fill","file-earmark-richtext","file-earmark-ruled-fill","file-earmark-ruled","file-earmark-slides-fill","file-earmark-slides","file-earmark-spreadsheet-fill","file-earmark-spreadsheet","file-earmark-text-fill",
		"file-earmark-text","file-earmark-word-fill","file-earmark-word","file-earmark-x-fill","file-earmark-x","file-earmark-zip-fill","file-earmark-zip","file-earmark","file-easel-fill","file-easel",
		"file-excel-fill","file-excel","file-fill","file-font-fill","file-font","file-image-fill","file-image","file-lock-fill","file-lock","file-lock2-fill",
		"file-lock2","file-medical-fill","file-medical","file-minus-fill","file-minus","file-music-fill","file-music","file-pdf-fill","file-pdf","file-person-fill",
		"file-person","file-play-fill","file-play","file-plus-fill","file-plus","file-post-fill","file-post","file-ppt-fill","file-ppt","file-richtext-fill",
		"file-richtext","file-ruled-fill","file-ruled","file-slides-fill","file-slides","file-spreadsheet-fill","file-spreadsheet","file-text-fill","file-text","file-word-fill",
		"file-word","file-x-fill","file-x","file-zip-fill","file-zip","file","files-alt","files","filetype-aac","filetype-ai",
		"filetype-bmp","filetype-cs","filetype-css","filetype-csv","filetype-doc","filetype-docx","filetype-exe","filetype-gif","filetype-heic","filetype-html",
		"filetype-java","filetype-jpg","filetype-js","filetype-json","filetype-jsx","filetype-key","filetype-m4p","filetype-md","filetype-mdx","filetype-mov",
		"filetype-mp3","filetype-mp4","filetype-otf","filetype-pdf","filetype-php","filetype-png","filetype-ppt","filetype-pptx","filetype-psd","filetype-py",
		"filetype-raw","filetype-rb","filetype-sass","filetype-scss","filetype-sh","filetype-sql","filetype-svg","filetype-tiff","filetype-tsx","filetype-ttf",
		"filetype-txt","filetype-wav","filetype-woff","filetype-xls","filetype-xlsx","filetype-xml","filetype-yml","film","filter-circle-fill","filter-circle",
		"filter-left","filter-right","filter-square-fill","filter-square","filter","fingerprint","fire","flag-fill","flag","flower1",
		"flower2","flower3","folder-check","folder-fill","folder-minus","folder-plus","folder-symlink-fill","folder-symlink","folder-x","folder",
		"folder2-open","folder2","fonts","forward-fill","forward","front","fuel-pump-diesel-fill","fuel-pump-diesel","fuel-pump-fill","fuel-pump",
		"fullscreen-exit","fullscreen","funnel-fill","funnel","gear-fill","gear-wide-connected","gear-wide","gear","gem","gender-ambiguous",
		"gender-female","gender-male","gender-trans","geo-alt-fill","geo-alt","geo-fill","geo","gift-fill","gift","git",
		"github","globe","globe2","google-play","google","gpu-card","graph-down-arrow","graph-down","graph-up-arrow","graph-up",
		"grid-1x2-fill","grid-1x2","grid-3x2-gap-fill","grid-3x2-gap","grid-3x2","grid-3x3-gap-fill","grid-3x3-gap","grid-3x3","grid-fill","grid",
		"grip-horizontal","grip-vertical","h-circle-fill","h-circle","h-square-fill","h-square","hammer","hand-index-fill","hand-index-thumb-fill","hand-index-thumb",
		"hand-index","hand-thumbs-down-fill","hand-thumbs-down","hand-thumbs-up-fill","hand-thumbs-up","handbag-fill","handbag","hash","hdd-fill","hdd-network-fill",
		"hdd-network","hdd-rack-fill","hdd-rack","hdd-stack-fill","hdd-stack","hdd","hdmi-fill","hdmi","headphones","headset-vr",
		"headset","heart-arrow","heart-fill","heart-half","heart-pulse-fill","heart-pulse","heart","heartbreak-fill","heartbreak","hearts",
		"heptagon-fill","heptagon-half","heptagon","hexagon-fill","hexagon-half","hexagon","hospital-fill","hospital","hourglass-bottom","hourglass-split",
		"hourglass-top","hourglass","house-door-fill","house-door","house-fill","house-heart-fill","house-heart","house","hr","hurricane",
		"hypnotize","image-alt","image-fill","image","images","inbox-fill","inbox","inboxes-fill","inboxes","incognito",
		"indent","infinity","info-circle-fill","info-circle","info-lg","info-square-fill","info-square","info","input-cursor-text","input-cursor",
		"instagram","intersect","journal-album","journal-arrow-down","journal-arrow-up","journal-bookmark-fill","journal-bookmark","journal-check","journal-code","journal-medical",
		"journal-minus","journal-plus","journal-richtext","journal-text","journal-x","journal","journals","joystick","justify-left","justify-right",
		"justify","kanban-fill","kanban","key-fill","key","keyboard-fill","keyboard","ladder","lamp-fill","lamp",
		"laptop-fill","laptop","layer-backward","layer-forward","layers-fill","layers-half","layers","layout-sidebar-inset-reverse","layout-sidebar-inset","layout-sidebar-reverse",
		"layout-sidebar","layout-split","layout-text-sidebar-reverse","layout-text-sidebar","layout-text-window-reverse","layout-text-window","layout-three-columns","layout-wtf","life-preserver","lightbulb-fill",
		"lightbulb-off-fill","lightbulb-off","lightbulb","lightning-charge-fill","lightning-charge","lightning-fill","lightning","line","link-45deg","link",
		"linkedin","list-check","list-columns-reverse","list-columns","list-nested","list-ol","list-stars","list-task","list-ul","list",
		"lock-fill","lock","lungs-fill","lungs","magic","magnet-fill","magnet","mailbox","mailbox2","map-fill",
		"map","markdown-fill","markdown","mask","mastodon","medium","megaphone-fill","megaphone","memory","menu-app-fill",
		"menu-app","menu-button-fill","menu-button-wide-fill","menu-button-wide","menu-button","menu-down","menu-up","messenger","meta","mic-fill",
		"mic-mute-fill","mic-mute","mic","microsoft-teams","microsoft","minecart-loaded","minecart","modem-fill","modem","moisture",
		"moon-fill","moon-stars-fill","moon-stars","moon","mortarboard-fill","mortarboard","motherboard-fill","motherboard","mouse-fill","mouse",
		"mouse2-fill","mouse2","mouse3-fill","mouse3","music-note-beamed","music-note-list","music-note","music-player-fill","music-player","newspaper",
		"nintendo-switch","node-minus-fill","node-minus","node-plus-fill","node-plus","nut-fill","nut","octagon-fill","octagon-half","octagon",
		"optical-audio-fill","optical-audio","option","outlet","p-circle-fill","p-circle","p-square-fill","p-square","paint-bucket","palette-fill",
		"palette","palette2","paperclip","paragraph","pass-fill","pass","patch-check-fill","patch-check","patch-exclamation-fill","patch-exclamation",
		"patch-minus-fill","patch-minus","patch-plus-fill","patch-plus","patch-question-fill","patch-question","pause-btn-fill","pause-btn","pause-circle-fill","pause-circle",
		"pause-fill","pause","paypal","pc-display-horizontal","pc-display","pc-horizontal","pc","pci-card","peace-fill","peace",
		"pen-fill","pen","pencil-fill","pencil-square","pencil","pentagon-fill","pentagon-half","pentagon","people-fill","people",
		"percent","person-badge-fill","person-badge","person-bounding-box","person-check-fill","person-check","person-circle","person-dash-fill","person-dash","person-fill",
		"person-heart","person-hearts","person-lines-fill","person-plus-fill","person-plus","person-rolodex","person-square","person-video","person-video2","person-video3",
		"person-workspace","person-x-fill","person-x","person","phone-fill","phone-flip","phone-landscape-fill","phone-landscape","phone-vibrate-fill","phone-vibrate",
		"phone","pie-chart-fill","pie-chart","piggy-bank-fill","piggy-bank","pin-angle-fill","pin-angle","pin-fill","pin-map-fill","pin-map",
		"pin","pinterest","pip-fill","pip","play-btn-fill","play-btn","play-circle-fill","play-circle","play-fill","play",
		"playstation","plug-fill","plug","plugin","plus-circle-dotted","plus-circle-fill","plus-circle","plus-lg","plus-slash-minus","plus-square-dotted",
		"plus-square-fill","plus-square","plus","postage-fill","postage-heart-fill","postage-heart","postage","postcard-fill","postcard-heart-fill","postcard-heart",
		"postcard","power","prescription","prescription2","printer-fill","printer","projector-fill","projector","puzzle-fill","puzzle",
		"qr-code-scan","qr-code","question-circle-fill","question-circle","question-diamond-fill","question-diamond","question-lg","question-octagon-fill","question-octagon","question-square-fill",
		"question-square","question","quora","quote","r-circle-fill","r-circle","r-square-fill","r-square","radioactive","rainbow",
		"receipt-cutoff","receipt","reception-0","reception-1","reception-2","reception-3","reception-4","record-btn-fill","record-btn","record-circle-fill",
		"record-circle","record-fill","record","record2-fill","record2","recycle","reddit","repeat-1","repeat","reply-all-fill",
		"reply-all","reply-fill","reply","rewind-btn-fill","rewind-btn","rewind-circle-fill","rewind-circle","rewind-fill","rewind","robot",
		"router-fill","router","rss-fill","rss","rulers","safe-fill","safe","safe2-fill","safe2","save-fill",
		"save","save2-fill","save2","scissors","screwdriver","sd-card-fill","sd-card","search-heart-fill","search-heart","search",
		"segmented-nav","send-check-fill","send-check","send-dash-fill","send-dash","send-exclamation-fill","send-exclamation","send-fill","send-plus-fill","send-plus",
		"send-slash-fill","send-slash","send-x-fill","send-x","send","server","share-fill","share","shield-check","shield-exclamation",
		"shield-fill-check","shield-fill-exclamation","shield-fill-minus","shield-fill-plus","shield-fill-x","shield-fill","shield-lock-fill","shield-lock","shield-minus","shield-plus",
		"shield-shaded","shield-slash-fill","shield-slash","shield-x","shield","shift-fill","shift","shop-window","shop","shuffle",
		"sign-stop-fill","sign-stop-lights-fill","sign-stop-lights","sign-stop","sign-turn-left-fill","sign-turn-left","sign-turn-right-fill","sign-turn-right","sign-turn-slight-left-fill","sign-turn-slight-left",
		"sign-turn-slight-right-fill","sign-turn-slight-right","sign-yield-fill","sign-yield","signal","signpost-2-fill","signpost-2","signpost-fill","signpost-split-fill","signpost-split",
		"signpost","sim-fill","sim","skip-backward-btn-fill","skip-backward-btn","skip-backward-circle-fill","skip-backward-circle","skip-backward-fill","skip-backward","skip-end-btn-fill",
		"skip-end-btn","skip-end-circle-fill","skip-end-circle","skip-end-fill","skip-end","skip-forward-btn-fill","skip-forward-btn","skip-forward-circle-fill","skip-forward-circle","skip-forward-fill",
		"skip-forward","skip-start-btn-fill","skip-start-btn","skip-start-circle-fill","skip-start-circle","skip-start-fill","skip-start","skype","slack","slash-circle-fill",
		"slash-circle","slash-lg","slash-square-fill","slash-square","slash","sliders","sliders2-vertical","sliders2","smartwatch","snapchat",
		"snow","snow2","snow3","sort-alpha-down-alt","sort-alpha-down","sort-alpha-up-alt","sort-alpha-up","sort-down-alt","sort-down","sort-numeric-down-alt",
		"sort-numeric-down","sort-numeric-up-alt","sort-numeric-up","sort-up-alt","sort-up","soundwave","speaker-fill","speaker","speedometer","speedometer2",
		"spellcheck","spotify","square-fill","square-half","square","stack-overflow","stack","star-fill","star-half","star",
		"stars","steam","stickies-fill","stickies","sticky-fill","sticky","stop-btn-fill","stop-btn","stop-circle-fill","stop-circle",
		"stop-fill","stop","stoplights-fill","stoplights","stopwatch-fill","stopwatch","strava","subtract","suit-club-fill","suit-club",
		"suit-diamond-fill","suit-diamond","suit-heart-fill","suit-heart","suit-spade-fill","suit-spade","sun-fill","sun","sunglasses","sunrise-fill",
		"sunrise","sunset-fill","sunset","symmetry-horizontal","symmetry-vertical","table","tablet-fill","tablet-landscape-fill","tablet-landscape","tablet",
		"tag-fill","tag","tags-fill","tags","telegram","telephone-fill","telephone-forward-fill","telephone-forward","telephone-inbound-fill","telephone-inbound",
		"telephone-minus-fill","telephone-minus","telephone-outbound-fill","telephone-outbound","telephone-plus-fill","telephone-plus","telephone-x-fill","telephone-x","telephone","terminal-dash",
		"terminal-fill","terminal-plus","terminal-split","terminal-x","terminal","text-center","text-indent-left","text-indent-right","text-left","text-paragraph",
		"text-right","textarea-resize","textarea-t","textarea","thermometer-half","thermometer-high","thermometer-low","thermometer-snow","thermometer-sun","thermometer",
		"three-dots-vertical","three-dots","thunderbolt-fill","thunderbolt","ticket-detailed-fill","ticket-detailed","ticket-fill","ticket-perforated-fill","ticket-perforated","ticket",
		"tiktok","toggle-off","toggle-on","toggle2-off","toggle2-on","toggles","toggles2","tools","tornado","train-freight-front-fill",
		"train-freight-front","train-front-fill","train-front","train-lightrail-front-fill","train-lightrail-front","translate","trash-fill","trash","trash2-fill","trash2",
		"trash3-fill","trash3","tree-fill","tree","triangle-fill","triangle-half","triangle","trophy-fill","trophy","tropical-storm",
		"truck-flatbed","truck-front-fill","truck-front","truck","tsunami","tv-fill","tv","twitch","twitter","type-bold",
		"type-h1","type-h2","type-h3","type-italic","type-strikethrough","type-underline","type","ubuntu","ui-checks-grid","ui-checks",
		"ui-radios-grid","ui-radios","umbrella-fill","umbrella","unindent","union","unity","universal-access-circle","universal-access","unlock-fill",
		"unlock","upc-scan","upc","upload","usb-c-fill","usb-c","usb-drive-fill","usb-drive","usb-fill","usb-micro-fill",
		"usb-micro","usb-mini-fill","usb-mini","usb-plug-fill","usb-plug","usb-symbol","usb","valentine","valentine2","vector-pen",
		"view-list","view-stacked","vimeo","vinyl-fill","vinyl","virus","virus2","voicemail","volume-down-fill","volume-down",
		"volume-mute-fill","volume-mute","volume-off-fill","volume-off","volume-up-fill","volume-up","vr","wallet-fill","wallet","wallet2",
		"watch","water","webcam-fill","webcam","wechat","whatsapp","wifi-1","wifi-2","wifi-off","wifi",
		"wind","window-dash","window-desktop","window-dock","window-fullscreen","window-plus","window-sidebar","window-split","window-stack","window-x",
		"window","windows","wordpress","wrench-adjustable-circle-fill","wrench-adjustable-circle","wrench-adjustable","wrench","x-circle-fill","x-circle","x-diamond-fill",
		"x-diamond","x-lg","x-octagon-fill","x-octagon","x-square-fill","x-square","x","xbox","yelp","yin-yang",
		"youtube","zoom-in","zoom-out");
		linkType = Arrays.asList("ManyToMany","Many-to-many","ManyToOne","Many-to-one","OneToMany","One-to-many");
	}
	
	public static List<String> genModule(String moduleId,String[] groupIds, String domainID, JSONObject json) throws GetException, ValidateException, SaveException{
		AppLog.info("I'M HERE genmodule");
		int domainOrder=100;	
		ModuleInfo mInfo = new ModuleInfo(moduleId, SyntaxTool.getModulePrefix(moduleId), groupIds, domainID);
		Grant g = Grant.getSystemAdmin();

		DataMapObject dataMaps = new DataMapObject();
		
		if(!json.has(JSON_LINK_KEY)){
			json.put(JSON_LINK_KEY, new JSONArray());
		}
		for (Object object : json.getJSONArray("classes")){
			int fieldOrder = 100;
			List<String> fKs = new ArrayList<>();
			JSONObject jsonObj = (JSONObject) object;
			String objName = formatObjectNames(jsonObj.getString("name"));
			String objPrefix=getOboPrefix(jsonObj, objName);
			//createObject
			String oboId = createObject(jsonObj, objName, objPrefix, domainOrder,mInfo, dataMaps, g);
			domainOrder+=100;
			//createFields
			if(jsonObj.has("attributes")){	
				fKs.addAll(parsefield(jsonObj, json, oboId, fieldOrder, mInfo, dataMaps, g));
			}
			
			//check if AI mis placed link
			json.getJSONArray(JSON_LINK_KEY).putAll(checkMisplacedLink(jsonObj,objName));
	
		}
		
		createLinks(json.getJSONArray(JSON_LINK_KEY),mInfo, dataMaps, g);
		return new ArrayList<>(dataMaps.objCreate.values());
	}
	private static List<String> parsefield(JSONObject jsonObj,JSONObject json, String oboId, int fieldOrder,ModuleInfo mInfo, DataMapObject dataMaps,Grant g) throws GetException, ValidateException, SaveException{

		String objName = formatObjectNames(jsonObj.getString("name"));
		String objPrefix = SyntaxTool.getObjectPrefix(oboId);
		List<String> fKs = new ArrayList<>();
		for(Object field:jsonObj.getJSONArray("attributes")){
					
			JSONObject jsonFld = (JSONObject) field;
			String fldType =jsonFld.optString("type",SHORT_TEXT);
			if(linkType.contains(fldType)){
				String class2 = getClassFromJson(jsonFld);
				json.getJSONArray(JSON_LINK_KEY).put(new JSONObject().put(JSON_LINK_CLASS_FROM_KEY, objName).put(JSON_LINK_CLASS_TO_KEY,class2).put("type",fldType));
			}else{
				String fldId=addField(jsonFld, oboId, objPrefix, fieldOrder,mInfo, dataMaps, g);
				if(jsonFld.optBoolean("key")){
					fKs.add(fldId);
				}
				fieldOrder+=10;
			}
		}
		if(Tool.isEmpty(fKs)){
			
			String fldId=addField(DEFAULT_CODE_FK, oboId, objPrefix, fieldOrder,mInfo, dataMaps, g);
			fKs.add(fldId);
		}
		return fKs;
	}

	private static String getClassFromJson(JSONObject jsonFld){
		String class2 = jsonFld.getString("name");
		if(jsonFld.has(CLASS)){
			class2 = jsonFld.getString(CLASS);
		}else if(jsonFld.has(JSON_LINK_CLASS_TO_KEY)){
			class2 = jsonFld.getString(JSON_LINK_CLASS_TO_KEY);
		}
		return class2;
	}
	private static JSONArray checkMisplacedLink(JSONObject jsonObj,String objName){
		if(jsonObj.has(JSON_LINK_KEY)){
			JSONArray links = jsonObj.getJSONArray(JSON_LINK_KEY);
			for (Object link : links){
				if(link instanceof JSONObject){
					JSONObject rel = (JSONObject) link;
					if(!rel.has(JSON_LINK_CLASS_FROM_KEY)){
						rel.put(JSON_LINK_CLASS_FROM_KEY, objName);
						if(rel.has("name")){
							
							String class2 = rel.getString("name");
							rel.remove("name");
							rel.put(JSON_LINK_CLASS_TO_KEY, class2);
						}
					}
				}
			}
			return links;
		}
		return new JSONArray();
	}
	private static String getOboPrefix(JSONObject jsonObj, String objName){
		String objPrefix = "";
		if (jsonObj.has(JSON_TRIGRAM_KEY) && jsonObj.get(JSON_TRIGRAM_KEY) instanceof String){
			objPrefix = jsonObj.getString(JSON_TRIGRAM_KEY).toLowerCase().replaceAll(NOT_WORD_CHAR_REGEX,"");	 
		}
		
		if (Tool.isEmpty(objPrefix)){// if not trigram in json or trigram in json is empty
			objPrefix = objName.substring(0, 3).toLowerCase();
		}
		return objPrefix;
	}
	private static String createObject(JSONObject jsonObj, String objName,  String objPrefix, int domainOrder,ModuleInfo mInfo, DataMapObject dataMaps,Grant g) throws GetException, ValidateException, SaveException{
		JSONObject fields = new JSONObject();
		String nameWP = getNameWithoutPrefix(objName, mInfo.mPrefix, "");
		fields.put(OBJECT_NAME_FIELD, SyntaxTool.join(SyntaxTool.PASCAL, new String[]{mInfo.mPrefix,nameWP}));
		fields.put(OBJECT_DB_FIELD, SyntaxTool.join(SyntaxTool.SNAKE, new String[]{mInfo.mPrefix,nameWP}));
		fields.put(MODULE_ID_FIELD, mInfo.moduleId);
		fields.put(OBJECT_PREFIX_FIELD, objPrefix);
		fields.put(OBJECT_ICON_FIELD, getIcon(jsonObj.optString("bootstrapIcon")));
		String comment ="";
		if (jsonObj.has(JSON_COMMENT_KEY) && !jsonObj.isNull(JSON_COMMENT_KEY)){
			Object commentObj = jsonObj.get(JSON_COMMENT_KEY);
			if(commentObj instanceof String){
				comment = (String)commentObj;
			}else if(commentObj instanceof JSONObject){
				JSONObject commentJson = (JSONObject) commentObj;
				if(commentJson.has("en") && !commentJson.isNull("en")){
					comment = commentJson.getString("en");
				}
			}
		}
		fields.put(OBJECT_DESCRIPTION, comment);
		String oboId = AITools.createOrUpdateWithJson(OBJECT_INTERNAL_NAME,fields, g);
		dataMaps.objCreate.put(objName.toLowerCase(),oboId);

		String en= (jsonObj.has("en") && (jsonObj.get("en") instanceof String))?  jsonObj.getString("en"):"";
		String fr= (jsonObj.has("fr") && (jsonObj.get("fr") instanceof String))?  jsonObj.getString("fr"):"";
		//extract trad		
		updateTradField(Grant.getTranslateObjectId(oboId, Globals.LANG_ENGLISH), en, g);
		updateTradField(Grant.getTranslateObjectId(oboId, Globals.LANG_FRENCH), fr, g);
		dataMaps.objEn.put(oboId, en);
		dataMaps.objFr.put(oboId, fr);
		addToDomain(mInfo.domainID,oboId,mInfo.moduleId,domainOrder,g);
		for (String gId: mInfo.groupIds){
			grantGroup(gId,oboId,mInfo.moduleId,g);
		}
		return oboId;
	}
	
	private static String getIcon(String icon){
		if(!Tool.isEmpty(icon)){
			icon = icon.replace("bi-","");
			icon = icon.replace("bi ","");
			if(listIcon.contains(icon)){
				return "bi/"+icon;
			}
		}
		return "bi/"+getRandomIcon(); 
	}
	private static String getRandomIcon() {
		return shortListIcon.get(rand.nextInt(shortListIcon.size()));
	}
	private static String addField(JSONObject jsonFld,String oboId, String objPrefix,  int fieldOrder,ModuleInfo mInfo, DataMapObject dataMaps,Grant g) throws GetException , ValidateException, SaveException{
		String fieldName = jsonFld.getString("name").replaceAll(NOT_WORD_CHAR_REGEX,"").replaceAll("\\s","");
		String objName = getObjectNameById(oboId, g);
		String fldType =jsonFld.optString("type",SHORT_TEXT);
		int type = ObjectField.TYPE_STRING;
		if(typeTrad.containsKey(fldType)){
			type = typeTrad.get(fldType);
		}
		JSONObject field = new JSONObject();
		String fldNameWP = getNameWithoutPrefix(fieldName, mInfo.mPrefix, objPrefix);
		String fldName = SyntaxTool.join(SyntaxTool.CAMEL, new String[]{mInfo.mPrefix,objPrefix,fldNameWP});
		field.put("fld_name", fldName);
		field.put("fld_dbname", SyntaxTool.join(SyntaxTool.SNAKE, new String[]{mInfo.mPrefix,objPrefix,fldNameWP}));
		field.put("fld_type", type);
		field.put("fld_fonctid", jsonFld.optBoolean("key"));
		field.put("fld_required", jsonFld.optBoolean("required"));
		field.put(MODULE_ID_FIELD,	mInfo.moduleId);
		if(type == ObjectField.TYPE_FLOAT || type == ObjectField.TYPE_BIGDECIMAL ){
			field.put("fld_precision", 2);
			field.put("fld_size", 5);
		}else{
			field.put("fld_size", (type == ObjectField.TYPE_INT)?5:100);
		}
		if(type == ObjectField.TYPE_ENUM || type == ObjectField.TYPE_ENUM_MULTI){
			String enumId = createListOfValue(objPrefix, fieldName, mInfo, g);
			field.put("fld_list_id",enumId);
			String defaultCode = completeList(enumId, jsonFld,objName,fldName, mInfo, g);
			field.put("fld_dfault", defaultCode);
		}
		
		String fldId = AITools.createOrUpdateWithJson(OBJECTFIELD,field, g);
		dataMaps.fieldCreate.put(fieldName, fldId);
		translateField(jsonFld, fldId, dataMaps, g);
		String oboFldId = createObjectField(oboId, fieldName, fieldOrder, mInfo, dataMaps, g);
		if(type == ObjectField.TYPE_ENUM && ("status".equalsIgnoreCase(fieldName) || jsonFld.has(IS_STATUS) && jsonFld.getBoolean(IS_STATUS))){
			addStateModel(oboId,  oboFldId,mInfo, g);
		}
		return fldId;
	}
	private static String getObjectNameById(String oboId,Grant g){
		ObjectDB obj = g.getTmpObject(OBJECT_INTERNAL_NAME);
		synchronized(obj.getLock()){
			obj.select(oboId);
			return obj.getFieldValue(OBJECT_NAME_FIELD);
		}
	}
	private static void translateField(JSONObject jsonFld, String fldId, DataMapObject dataMaps,Grant g) throws UpdateException, GetException, ValidateException{
		String en ="";
		String fr="";
		if(jsonFld.has("en") && jsonFld.get("en") instanceof JSONObject){
			JSONObject enJson = jsonFld.getJSONObject("en");
			if(enJson.length()==1){	
				en = enJson.optString(enJson.keys().next(),"");
			}
		}else{
			en = jsonFld.optString("en", "");
		}
		if(jsonFld.has("fr") && jsonFld.get("fr") instanceof JSONObject){
			JSONObject frJson = jsonFld.getJSONObject("fr");
			if(frJson.length()==1){
				fr = frJson.optString(frJson.keys().next(),"");
			}
		}else{
			fr = jsonFld.optString("fr", "");
		}
		updateTradField(Grant.getTranslateFieldId(fldId, Globals.LANG_ENGLISH),en, g);
		updateTradField(Grant.getTranslateFieldId(fldId, Globals.LANG_FRENCH), fr, g);
		dataMaps.fldEn.put(fldId, en);
		dataMaps.fldFr.put(fldId, fr);	
	}
	private static void addStateModel(String oboId, String oboFldId,ModuleInfo mInfo, Grant g){
		String pcs = "CreateStateModel";
		Processus p = g.getProcessus(pcs, null);
		p.instantiate();
		Message m = p.activate();
		if(m.isOk()){
			//select module
			m = activitySelect(mInfo.moduleId,"Module",p,(ActivityFile)m.get(ACTIVITY),g);
			//select Object
			m = activitySelect(oboId,"ObjectIntAIModuleCreateernal",p,(ActivityFile)m.get(ACTIVITY),g);
			//select field
			m = activitySelect(oboFldId, OBJECT_FIELD_SYSTEM_NAME, p, (ActivityFile)m.get(ACTIVITY), g);
			//Transition			
			m = activityTransition(p,(ActivityFile)m.get(ACTIVITY),g);
			//Grant		
			m = activityGrant(mInfo.groupIds,p,(ActivityFile)m.get(ACTIVITY),g);
			//Translation
			ActivityFile act = (ActivityFile)m.get(ACTIVITY);
			if("CSTM-TSL".equals(act.getActivity().getStep())){
				m = activityTranslation(p,act,g);
				act = (ActivityFile)m.get(ACTIVITY);
			}
			//end
			p.lock(act.getActivity(), act.getAID());
			p.validate(act, null);
		}
	}
	private static Message activitySelect(String rowId,String object,Processus p,ActivityFile act,Grant g){
		p.lock(act.getActivity(), act.getAID());
		act.addDataFile(OBJECTFIELD, "row_id", rowId);
		ObjectDB o = g.getProcessObject(object);
		return p.validate(act, o);
	}
	private static Message activityTransition(Processus p,ActivityFile act,Grant g){
		p.lock(act.getActivity(), act.getAID());
		try {
			p.invokePageMethod(act, null, act.getDataValue("Page", ACTIVITY_METHOD));
		} catch (MethodException e) {
			AppLog.error(e, g);
		}
		for(DataFile data : act.getDataFiles("Data")){
			String name = data.getName();
			if(name.startsWith("chk")){
				data.setValue(0,"true");
			}
		}
		return p.validate(act, null);
	}
	private static Message activityGrant(String[] groupIds,Processus p,ActivityFile act,Grant g){
		p.lock(act.getActivity(), act.getAID());
		try {
			p.invokePageMethod(act, null, act.getDataValue("Page", ACTIVITY_METHOD));
		} catch (MethodException e) {
			AppLog.error(e, g);
		}
		for (DataFile data : act.getDataFiles("Data")) {
			String name = data.getName();
			if (name.startsWith("chk")) {
				for (String grpId : groupIds) {
					if (name.startsWith("chk" + grpId)) {
						data.setValue(0, "true");
					}
				}

			} else if (name.startsWith("btn")) {
				data.setValue(0, "true");
			}
		}
		return p.validate(act, null);
	}
	private static Message activityTranslation(Processus p,ActivityFile act,Grant g){
		ObjectDB action = g.getTmpObject("Action");
		p.lock(act.getActivity(), act.getAID());
		try {
			p.invokePageMethod(act, null, act.getDataValue("Page", ACTIVITY_METHOD));

		} catch (MethodException e) {
			AppLog.error(e, g);
		}
		for (DataFile data : act.getDataFiles("Data")) {
			String name = data.getName();
			if (name.startsWith("tsl")) {
				String idAct = name.substring(6);
				String val = "";
				synchronized (action.getLock()) {
					action.select(idAct);
					val = action.getFieldValue("act_name");
				}
				if (val.contains("-")) {
					String[] part = val.split("-");
					val = part[part.length - 1];

				}
				data.setValue(0, val);
			}
		}
		return p.validate(act, null);
	}
	private static String createObjectField(String oboId,String fieldName,int fieldOrder,ModuleInfo mInfo, DataMapObject dataMaps,Grant g){
		JSONObject oboField = new JSONObject();
		oboField.put(OBJECTFIELD_OBJECT_FIELD, oboId);
		oboField.put(OBJECTFIELD_FIELD_FIELD, dataMaps.fieldCreate.get(fieldName));
		oboField.put(OBJECTFIELD_ORDER_FIELD, fieldOrder);
		oboField.put(MODULE_ID_FIELD,mInfo.moduleId);
		return AITools.createOrUpdateWithJson(OBJECT_FIELD_SYSTEM_NAME,oboField, g);
	}
	private static String createListOfValue(String objPrefix,String fieldName,ModuleInfo mInfo,Grant g){
		JSONObject enumObject = new JSONObject();
		enumObject.put("lov_name",SyntaxTool.join(SyntaxTool.UPPER, new String[]{mInfo.mPrefix,objPrefix,fieldName}));
		enumObject.put(MODULE_ID_FIELD,mInfo.moduleId);
		return AITools.createOrUpdateWithJson("FieldList",enumObject, g);
	}
	private static void createLinks(JSONArray links, ModuleInfo mInfo, DataMapObject dataMaps, Grant g) throws GetException, ValidateException, UpdateException {
		int linkorder = 10;
		for (Object link : links) {
			JSONObject jsonLink = (JSONObject) link;
			String linksType = jsonLink.getString("type");
			String class1Name = getClassFromJsonLink(jsonLink, JSON_LINK_CLASS_FROM_KEY);
			String class2Name = getClassFromJsonLink(jsonLink, JSON_LINK_CLASS_TO_KEY);

			if (!Tool.isEmpty(class1Name) && !Tool.isEmpty(class2Name) && (dataMaps.objCreate.containsKey(class1Name.toLowerCase()) || dataMaps.objCreate.containsKey(class2Name.toLowerCase()))) {
				if (!dataMaps.objCreate.containsKey(class1Name.toLowerCase())) {
					createLinkObject(class1Name, mInfo, dataMaps, g);
				}
				if (!dataMaps.objCreate.containsKey(class2Name.toLowerCase())) {
					createLinkObject(class2Name, mInfo, dataMaps, g);
				}

				switch (linksType.toLowerCase()) {
					case "m2m":
					case "manytomany":
					case "many-to-many":
						createManyToManyLink(class1Name, class2Name, linkorder, mInfo, dataMaps, g);
						linkorder += 20;
						break;
					case "m2o":
					case "manytoone":
					case "many-to-one":
						createLink(class1Name, class2Name, linkorder, mInfo, dataMaps,true);
						linkorder += 10;
						break;
					case "o2m":
					case "onetomany":
					case "one-to-many":
					default:
						createLink(class1Name, class2Name, linkorder, mInfo, dataMaps,false);
						linkorder += 10;
						break;
				}
			}
		}
	}

	private static void createManyToManyLink(String class1Name, String class2Name, int linkorder, ModuleInfo mInfo, DataMapObject dataMaps, Grant g) throws GetException, ValidateException, UpdateException{
		String oboId = dataMaps.objCreate.get(class1Name.toLowerCase());
		String oboId2 = dataMaps.objCreate.get(class2Name.toLowerCase());
		if (!dataMaps.linkDone.contains(class1Name + class2Name + "m2m") && !dataMaps.linkDone.contains(class2Name + class1Name + "m2m")) {
			manyToManyLink(new LinkObject(oboId, dataMaps.objEn.get(oboId), dataMaps.objFr.get(oboId), linkorder), new LinkObject(oboId2, dataMaps.objEn.get(oboId2), dataMaps.objFr.get(oboId2), linkorder + 10), mInfo, dataMaps, g);
			dataMaps.linkDone.add(class1Name + class2Name + "m2m");
		}
	}

	private static void createLink(String class1Name, String class2Name, int linkorder, ModuleInfo mInfo, DataMapObject dataMaps, boolean isManyToOne) throws GetException, ValidateException, UpdateException {
		String oboId1 = dataMaps.objCreate.get(class1Name.toLowerCase());
		String oboId2 = dataMaps.objCreate.get(class2Name.toLowerCase());
		String linkType = isManyToOne ? "m2o" : "o2m";
		String linkKey = class1Name + class2Name + linkType;
		if (!dataMaps.linkDone.contains(linkKey)) {
			if (isManyToOne) {
				LinkObject linkObject = new LinkObject(oboId2, dataMaps.objEn.get(oboId2), dataMaps.objFr.get(oboId2), linkorder);
				manyToOneLink(oboId1, linkObject, mInfo, dataMaps, ObjectCore.DEL_RESTRICT, false, false);
			} else {
				LinkObject linkObject = new LinkObject(oboId1, dataMaps.objEn.get(oboId1), dataMaps.objFr.get(oboId1), linkorder);
				manyToOneLink(oboId2, linkObject, mInfo, dataMaps, ObjectCore.DEL_RESTRICT, false, false);
			}
			dataMaps.linkDone.add(linkKey);
		}
	}

	private static String getClassFromJsonLink(JSONObject jsonLink, String key) {
		String className ="";
		if (jsonLink.has(key)) {
			Object classObj = jsonLink.get(key);
			if (classObj instanceof String) {
				className= (String) classObj;
			} else if (classObj instanceof JSONObject) {
				JSONObject objJSON = (JSONObject) classObj;
				if (objJSON.has("name")) {
					className =  objJSON.getString("name");
				}
			}
		}
		return formatObjectNames(className);
	}
	private static void createLinkObject(String name,ModuleInfo mInfo, DataMapObject dataMaps,Grant g){
		JSONObject linkFields = new JSONObject();
		String namewp = getNameWithoutPrefix(name,mInfo.mPrefix,"");
		linkFields.put(OBJECT_NAME_FIELD, SyntaxTool.join(SyntaxTool.PASCAL, new String[]{mInfo.mPrefix,namewp}));
		linkFields.put(OBJECT_DB_FIELD, SyntaxTool.join(SyntaxTool.SNAKE, new String[]{mInfo.mPrefix,namewp}));
		linkFields.put(MODULE_ID_FIELD, mInfo.moduleId);
		linkFields.put(OBJECT_PREFIX_FIELD, namewp.substring(0, 3).toLowerCase());
		linkFields.put(OBJECT_ICON_FIELD, getIcon(""));
		String oboId = AITools.createOrUpdateWithJson(OBJECT_INTERNAL_NAME,linkFields, g);
		dataMaps.objCreate.put(name.toLowerCase(),oboId);			
		
	}
	private static void updateTradField(String tradId,String val,Grant g) throws GetException, UpdateException, ValidateException{
		ObjectDB oTra = g.getTmpObject("Translate");
		synchronized(oTra.getLock()){
			BusinessObjectTool oTraT = oTra.getTool();
			if(!Tool.isEmpty(val) && !Tool.isEmpty(tradId)){
				
				oTraT.selectForUpdate(tradId);
				oTra.setFieldValue("tsl_value", val);
				oTraT.validateAndUpdate();
			}
		}
		
	}
	private static void createOrUpdateTranslation(String obj,String objId,String lang,String val, String moduleId,Grant g) throws GetException, UpdateException, ValidateException{
		ObjectDB oTra = g.getTmpObject("Translate");
		synchronized(oTra.getLock()){
			BusinessObjectTool oTraT = oTra.getTool();
			if(!Tool.isEmpty(objId)){
				String objectRef = Tool.toSQL(obj)+":"+Tool.toSQL(objId);
				if(!Tool.isEmpty(val)){
					if(!oTraT.selectForCreateOrUpdate(new JSONObject().put("tsl_object",objectRef).put("tsl_lang",lang))){
						oTra.setFieldValue("tsl_object",objectRef);
						oTra.setFieldValue("tsl_lang",lang);
						oTra.setFieldValue(MODULE_ID_FIELD,moduleId);
					}
					oTra.setFieldValue("tsl_value", val);
					oTraT.validateAndUpdate();
				}
				
			}
		}
		
	}
	private static void manyToManyLink(LinkObject objectData1,LinkObject objectData2, ModuleInfo mInfo,DataMapObject dataMaps,Grant g) throws GetException, ValidateException, UpdateException{
		String childId="";
		String prefix1=SyntaxTool.getObjectPrefix(objectData1.objId);
		String prefix2=SyntaxTool.getObjectPrefix(objectData2.objId);
		
		//create objectChild then manytoone to obj1 and obj2
		JSONObject objFields = new JSONObject();
		String name = SyntaxTool.join(SyntaxTool.PASCAL, new String[]{mInfo.mPrefix,prefix1,prefix2});
		objFields.put(OBJECT_NAME_FIELD,name );
		objFields.put(OBJECT_DB_FIELD, SyntaxTool.join(SyntaxTool.SNAKE, new String[]{mInfo.mPrefix,prefix1,prefix2}));
		objFields.put(MODULE_ID_FIELD, mInfo.moduleId);
		objFields.put(OBJECT_PREFIX_FIELD, prefix1+prefix2);
		objFields.put(OBJECT_ICON_FIELD, getIcon(""));
		objFields.put(OBJECT_DESCRIPTION, "NN between "+objectData1.en+" and "+objectData2.en);
		childId = AITools.createOrUpdateWithJson(OBJECT_INTERNAL_NAME,objFields, g);
		dataMaps.objCreate.put(name.toLowerCase(),childId);
		for (String gId: mInfo.groupIds){
			grantGroup(gId,childId,mInfo.moduleId,g);
		}
		
		manyToOneLink(childId, objectData1, mInfo, dataMaps,ObjectCore.DEL_CASCAD,true,objectData1.objId.equals(objectData2.objId));
		manyToOneLink(childId, objectData2, mInfo, dataMaps,ObjectCore.DEL_CASCAD,true,objectData1.objId.equals(objectData2.objId));
	}
	private static HashMap<String, String> linkIds = new HashMap<>();
	private static void manyToOneLink(String childId,LinkObject objectData, ModuleInfo mInfo, DataMapObject dataMaps,char del,Boolean key,boolean recursive) throws GetException, ValidateException, UpdateException{
			Grant g = mInfo.g;
			String triObj = SyntaxTool.getObjectPrefix(objectData.objId);
			String triChild = SyntaxTool.getObjectPrefix(childId);
			String fkFieldName=SyntaxTool.join(SyntaxTool.CAMEL, new String[]{mInfo.mPrefix,triChild,triObj,"id"});
			String refId = "";
			if( linkIds.containsKey(fkFieldName)){
				if(recursive){
					triObj+="Bis";
					fkFieldName=SyntaxTool.join(SyntaxTool.CAMEL, new String[]{mInfo.mPrefix,triChild,triObj,"id"});
				}else{
					return;
				}
			}
			JSONObject fields = new JSONObject();
			fields.put("fld_name", fkFieldName);
			fields.put("fld_dbname", SyntaxTool.join(SyntaxTool.SNAKE, new String[]{mInfo.mPrefix,triChild,triObj,"id"}));
			fields.put("fld_type",ObjectField.TYPE_ID);
			fields.put(MODULE_ID_FIELD,mInfo.moduleId);
			if(Boolean.TRUE.equals(key)){
				fields.put("fld_fonctid",true);
				fields.put("fld_required",true);
			}
			refId = AITools.createOrUpdateWithJson(OBJECTFIELD,fields, g);
			JSONObject oboFields = new JSONObject();
			oboFields.put(OBJECTFIELD_OBJECT_FIELD, childId);
			oboFields.put(OBJECTFIELD_FIELD_FIELD, refId);
			oboFields.put(OBJECTFIELD_ORDER_FIELD, objectData.linkorder);
			oboFields.put(MODULE_ID_FIELD,mInfo.moduleId);
			oboFields.put("obf_ref_object_id",objectData.objId);
			oboFields.put("obf_cascad", Character.toString(del));
			AITools.createOrUpdateWithJson(OBJECT_FIELD_SYSTEM_NAME,oboFields, g);
			//Joined field Add key of child in main object.
			objectData.linkorder += 1;
			addJoinedField(childId, refId, objectData, mInfo, dataMaps, objectData.linkorder, g);
			linkIds.put(fkFieldName, refId);
	}
	private static void addJoinedField(String childId,String refId,LinkObject objectData,ModuleInfo mInfo, DataMapObject dataMaps,int fkOrder, Grant g) throws GetException, ValidateException, UpdateException{
		List<String> fks = getFonctionalKeys(objectData.objId,g);
		if(!Tool.isEmpty(fks)){
			for(String fkField: fks){
				JSONObject fields = new JSONObject();
				fields.put(OBJECTFIELD_OBJECT_FIELD, childId);
				fields.put(OBJECTFIELD_FIELD_FIELD, fkField);
				fields.put(OBJECTFIELD_ORDER_FIELD, fkOrder);
				fields.put(MODULE_ID_FIELD,mInfo.moduleId);
				fields.put("obf_ref_object_id",objectData.objId);
				fields.put("obf_ref_field_id",refId);
				String oboFldId = AITools.createOrUpdateWithJson(OBJECT_FIELD_SYSTEM_NAME,fields, g);
				if(dataMaps.fldEn.containsKey(fkField) && !Tool.isEmpty(objectData.en)){
					createOrUpdateTranslation(OBJECT_FIELD_SYSTEM_NAME, oboFldId, Globals.LANG_ENGLISH, objectData.en +" "+dataMaps.fldEn.get(fkField), mInfo.moduleId, g);
				}
				if(dataMaps.fldFr.containsKey(fkField) && !Tool.isEmpty(objectData.fr)){
					createOrUpdateTranslation(OBJECT_FIELD_SYSTEM_NAME, oboFldId,  Globals.LANG_FRENCH, dataMaps.fldFr.get(fkField) +" "+objectData.fr, mInfo.moduleId, g);
					
				}
				fkOrder+=1;
			}
				
			
		}
	}
	private static List<String> getFonctionalKeys(String objId,Grant g) {
		List<String> fks = new ArrayList<>();
		String objName =  ObjectCore.getObjectName(objId);
		ObjectDB obj = g.getTmpObject(objName);
		for(ObjectField fk : obj.getFunctId()){
			fks.add(fk.getId());
		}
		return fks;
	}
	private static String completeList(String enumId,JSONObject jsonFld,String objName,String fldName,ModuleInfo mInfo,Grant g) throws GetException, ValidateException, UpdateException{
		if(hasJsonArray(jsonFld,JSON_VALUES_UPPER_KEY,JSON_VALUES_LOWER_KEY)){
			return completeList(mInfo.moduleId, enumId, jsonFld.has(JSON_VALUES_LOWER_KEY)?jsonFld.getJSONArray(JSON_VALUES_LOWER_KEY):jsonFld.getJSONArray(JSON_VALUES_UPPER_KEY),objName,fldName, g);
		}else if(hasNotCaseSensitibve(jsonFld.optJSONObject(JSON_ENUM_KEY), JSON_VALUES_UPPER_KEY, JSON_VALUES_LOWER_KEY)){
			return completeList(mInfo.moduleId, enumId, jsonFld.getJSONObject(JSON_ENUM_KEY).has(JSON_VALUES_LOWER_KEY) ?jsonFld.getJSONObject(JSON_ENUM_KEY).getJSONArray(JSON_VALUES_LOWER_KEY):jsonFld.getJSONObject(JSON_ENUM_KEY).getJSONArray(JSON_VALUES_UPPER_KEY),objName,fldName, g);
		}else if(hasNotCaseSensitibve(jsonFld.optJSONObject(JSON_ENUM_KEY.toLowerCase()), JSON_VALUES_UPPER_KEY, JSON_VALUES_LOWER_KEY) ){
			return completeList(mInfo.moduleId, enumId, jsonFld.getJSONObject(JSON_ENUM_KEY.toLowerCase()).has(JSON_VALUES_LOWER_KEY) ?jsonFld.getJSONObject(JSON_ENUM_KEY.toLowerCase()).getJSONArray(JSON_VALUES_LOWER_KEY):jsonFld.getJSONObject(JSON_ENUM_KEY.toLowerCase()).getJSONArray(JSON_VALUES_UPPER_KEY),objName,fldName, g);
		}else{
			JSONArray values = new JSONArray();
			String[] defaultVal = {"A","B","C"};
			String[] defaultColor = {"green", "orange", "red"};
			for(int i=0;i<defaultVal.length;i++){
				String val = defaultVal[i];
				values.put(new JSONObject().put("code",val).put("en",val).put("fr",val).put("color",defaultColor[i]));
			}
			return completeList(mInfo.moduleId, enumId, values,objName,fldName, g);
		}
	}
	private static boolean hasJsonArray(JSONObject json, String upperkey, String lowerkey){
		return json.has(upperkey) && json.get(upperkey) instanceof JSONArray || json.has(lowerkey) && json.get(lowerkey) instanceof JSONArray;
	}
	private static boolean hasNotCaseSensitibve(JSONObject json, String upperKey, String lowerKey){
		if(Tool.isEmpty(json)){
			return false;
		}
		return json.has(upperKey) || json.has(lowerKey);
	}
	private static String completeList(String moduleId,String listId,JSONArray values,String objName,String fldName,Grant g) throws GetException, ValidateException, UpdateException{
		int order = 1;
		String defaultCode = "";
		for (int index = 0; index < values.length(); index++) {
			Object value = values.get(index);
			JSONObject jsonValue = getJsonValue(value,g);
			String color = jsonValue.optString("color").toLowerCase();
			if(Tool.isEmpty(jsonValue)){
				return defaultCode;
			}
			String code = SyntaxTool.forceCase(jsonValue.getString("code"), 1).toUpperCase();
			if(index == 0){
				defaultCode = code;
			}
			JSONObject enumCodeFields = new JSONObject();
			enumCodeFields.put("lov_list_id", listId);
			enumCodeFields.put("lov_code", code);
			enumCodeFields.put("lov_order_by", order);
			enumCodeFields.put(MODULE_ID_FIELD,moduleId);
			
			if (!Tool.isEmpty(color)){
				EnumFieldStyle style = enumColors.get(color);
				if(!Tool.isEmpty(style)){
					enumCodeFields.put("lov_color_bg", style.hexa);
					enumCodeFields.put("lov_icon", style.icon);
					enumCodeFields.put("lov_color", style.color);
				}
				addFieldStyle(objName,fldName,code,style.bg,moduleId,g);
			}
			String enumId = AITools.createOrUpdateWithJson("FieldListCode",enumCodeFields, g);
			traductListItems(jsonValue,enumId,"en",Globals.LANG_ENGLISH,g);
			traductListItems(jsonValue,enumId,"fr",Globals.LANG_FRENCH,g);
			order+=1;
		}
		return defaultCode;
	}
	private static void traductListItems(JSONObject jsonValue,String enumId,String lang,String filterLang,Grant g) throws UpdateException, ValidateException, GetException{
		ObjectDB oTra = g.getTmpObject("FieldListValue");
		BusinessObjectTool oTraT = oTra.getTool();
		if(jsonValue.has(lang) && (jsonValue.get(lang) instanceof String)&& (oTraT.selectForCreateOrUpdate(new JSONObject().put("lov_code_id",enumId).put("lov_lang",filterLang))) ){
			oTra.setFieldValue("lov_value", jsonValue.getString(lang));
			oTraT.validateAndUpdate();
		} 
	}
	private static void addFieldStyle(String objName,String fldName,String code,String style,String moduleId,Grant g){
		JSONObject fieldStyle= new JSONObject();
		fieldStyle.put("sty_object", objName);
		fieldStyle.put("sty_field", fldName);
		fieldStyle.put("sty_value", code);
		fieldStyle.put("sty_style", style);
		fieldStyle.put(MODULE_ID_FIELD,moduleId);
		AITools.createOrUpdateWithJson("FieldStyle",fieldStyle, g);

	}
	private static JSONObject getJsonValue(Object value, Grant g){
		if(value instanceof String){
			return new JSONObject()
						.put("code",value)
						.put("FRA".equals(g.getLang())?"fr":"en", value);
			
		}else if(value instanceof JSONObject){
			return (JSONObject) value;
		}else{
			return new JSONObject();
		}
	}
	private static void addToDomain(String domainID,String objectId,String moduleId,int domainOrder,Grant g){
		if(Tool.isEmpty(domainID)){
			return;
		}
		JSONObject domain = new JSONObject();
		domain.put("map_domain_id", domainID);
		domain.put("map_object", "ObjectInternal:"+objectId);
		domain.put("map_order", domainOrder);
		domain.put(MODULE_ID_FIELD,moduleId);
		AITools.createOrUpdateWithJson("Map",domain, g);
	}	
	private static void grantGroup(String groupId,String objectId,String moduleId,Grant g){
		ObjectDB funcObj = g.getTmpObject("Function");
		String funcId="";
		synchronized(funcObj.getLock()){
			funcObj.resetFilters();
			funcObj.setFieldFilter(MODULE_ID_FIELD,moduleId);
			funcObj.setFieldFilter("fct_function",GrantCore.FUNCTION_ALL);
			funcObj.setFieldFilter("fct_object_id",objectId);
			List<String[]> funcs = funcObj.search();
			if(Tool.isEmpty(funcs)){
				AppLog.warning("No function found for object "+ObjectCore.getObjectName(objectId)+" in module "+ModuleDB.getModuleName(moduleId));
				return;
			}
			funcId = funcs.get(0)[funcObj.getRowIdFieldIndex()];
			
		}

		JSONObject grant = new JSONObject();
		grant.put("grt_group_id", groupId);
		grant.put(MODULE_ID_FIELD,moduleId);
		grant.put("grt_function_id",funcId);
		AITools.createOrUpdateWithJson("Grant",grant, g);
	}
	private static String formatObjectNames(String name){
		String regex="\\s(\\w)";
		Pattern p = Pattern.compile(regex);	
		Matcher m =p.matcher(name);
		StringBuffer sb = new StringBuffer();
		while (m.find()) {
			m.appendReplacement(sb, m.group(1).toUpperCase());
		}
		m.appendTail(sb);
		name = sb.toString();
		return name.replaceAll(NOT_WORD_CHAR_REGEX,"");
	}
	private static String getNameWithoutPrefix(String name, String mdlPrefix, String objprefix){
		String regex = "^(?i)"+(Tool.isEmpty(mdlPrefix)?"":"(?:"+mdlPrefix+")?")+(Tool.isEmpty(objprefix)?"":"(?:"+objprefix+")?")+"(.*)$";

		Pattern p = Pattern.compile(regex,Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(name);
		StringBuffer sb = new StringBuffer();
		while (m.find()) {
			m.appendReplacement(sb, "$1");
		}
		m.appendTail(sb);
		return sb.toString();
	}
}