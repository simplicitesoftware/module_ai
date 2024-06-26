package com.simplicite.workflows.AIBySimplicite;

import java.util.*;

import com.simplicite.bpm.*;
import com.simplicite.util.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.ObjectContextWeb;

/**
 * Process AIChartCrossTable
 */
public class AIChartCrossTable extends Processus {
	private static final long serialVersionUID = 1L;
	public String defineChart(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		return "<textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"swagger\" name=\"swagger\"></textarea><textarea  class=\"form-control autosize js-focusable\"  style=\"height: 50vh;\" id=\"js\" name=\"js\"></textarea>";
	}
	@Override
	public void postValidate(ActivityFile context) {
		//To do for stape definechart
	}
	public String display(Processus p, ActivityFile context, ObjectContextWeb ctx, Grant g){
		//todo
		String objName ="DemoOrder";//from Data
		String tableName = "DemoOrder-TC1";//from Data
		String html = "<div id=\"crosstable\"></div>";
		String js ="$ui.displayCrosstab($(\"#crosstable\"), \""+objName+"\", \""+tableName+"\", {\r\n" + //
				" \"zwidth\": \"100%\",\r\n" + //
				" \"zheight\": \"30rem\",\r\n" + //
				" \"zcaption\": \"no\",\r\n" + //
				" \"zcontrol\": \"no\",\r\n" + //
				" \"zstotal\": \"no\",\r\n" + //
				" \"ztable\": \"no\",\r\n" + //
				" \"zgraph\": \"no\",\r\n" + //
				" \"zstcolor\": \"#D9D2E9\"\r\n" + //
				"},null);";
		return html + HTMLTool.jsBlock(js) ;
	}
	
}
