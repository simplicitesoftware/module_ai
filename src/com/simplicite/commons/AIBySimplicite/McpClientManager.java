package com.simplicite.commons.AIBySimplicite;

import java.util.*;

import com.simplicite.util.*;
import com.simplicite.bpm.*;
import com.simplicite.util.exceptions.*;
import com.simplicite.util.tools.*;
import com.simplicite.util.tools.RESTTool;
import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import io.modelcontextprotocol.client.transport.StdioClientTransport;
import io.modelcontextprotocol.client.transport.ServerParameters;
import io.modelcontextprotocol.json.McpJsonMapper;
import io.modelcontextprotocol.json.McpJsonDefaults;
import io.modelcontextprotocol.spec.McpSchema.CallToolRequest;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import io.modelcontextprotocol.spec.McpSchema.ListToolsResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.HttpRequest;

import java.time.Duration;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
/** Shared code McpClientManager */
@SuppressWarnings("unused")
public class McpClientManager implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private static McpClientManager instance;
    private McpSyncClient client;
    private String token ;
    private String baseUrl;
    private McpClientManager(Grant g) {
        init(g);
    }


    public static synchronized McpClientManager getInstance(Grant g) {
        if (instance == null) {
            instance = new McpClientManager(g);
        }
        return instance;
    }
    private void init(Grant g) {

        String jwt = AuthTool.createJWTToken(g);
        token = getBearerToken(g);
        baseUrl=g.getContextURL();
        AppLog.info("baseUrl "+baseUrl);
        initHttpClient(g);
        //initStdioClient();
        initHttpClientUi(g);
    }
     private String getBearerToken(Grant g) {
        try (BusinessObject bo = new BusinessObject(Grant.getSystemAdmin(), "UserToken")) {
            bo
            .getTmpObject() // or getInstance("MyInstance")
            .withAllAccess() // = withCRUD(true, true, true, true)
            .preserveContext() // keep the instance definition to be restored on close
            .forCreateOrUpdate(Map.of(
                "utk_usr_id", g.getUserUniqueId(),
                "utk_type", "API"))
            .validateAndSave(msg -> AppLog.info("save = "+msg))
            .returns(msg -> AppLog.info("msg = "+msg));
            return bo.getObject().getFieldValue("utk_token");
        }
        catch (GetException | ValidateException | SaveException  e) {
            AppLog.error("There was an error", e);
            return null;
        }
    }
    private void initHttpClient(Grant g) {
        //String token =g.getAuthToken();
        //builder(String) -> la commande est le premier argument obligatoire
      HttpClientStreamableHttpTransport transport = HttpClientStreamableHttpTransport
        .builder(baseUrl)
        .endpoint("/api"+Globals.WEB_MCP_PATH )
        .requestBuilder(HttpRequest.newBuilder()
            .header("Authorization", "Bearer " + token))
        .build();

        //Inspecter McpJsonMapper pour trouver l'impl disponible
        AppLog.warning("=== McpJsonMapper ===", null);
        for (java.lang.reflect.Constructor<?> c :
                io.modelcontextprotocol.json.McpJsonMapper.class.getDeclaredConstructors()) {
            AppLog.warning("  Constructor: " + c, null);
        }

    //McpJsonMapper jsonMapper = McpJsonDefaults.getMapper();
        // StdioClientTransport transport = new StdioClientTransport(params,jsonMapper);

        client = McpClient.sync(transport).requestTimeout(Duration.ofSeconds(30)).build();

        client.initialize();

    }
    private void initHttpClientUi(Grant g) {
        //String token =g.getAuthToken();
        // builder(String) -> la commande est le premier argument obligatoire
      HttpClientStreamableHttpTransport transport = HttpClientStreamableHttpTransport
        .builder(baseUrl)
        .endpoint("/api"+Globals.WEB_MCP_PATH )
        .requestBuilder(HttpRequest.newBuilder()
            .header("Authorization","Bearer " + token))
        .build();

        //Inspecter McpJsonMapper pour trouver l'impl disponible
        AppLog.warning("=== McpJsonMapper ===", null);
        for (java.lang.reflect.Constructor<?> c :
                io.modelcontextprotocol.json.McpJsonMapper.class.getDeclaredConstructors()) {
            AppLog.warning("  Constructor: " + c, null);
        }

    // McpJsonMapper jsonMapper = McpJsonDefaults.getMapper();
    //     StdioClientTransport transport = new StdioClientTransport(params,jsonMapper);

        client = McpClient.sync(transport).requestTimeout(Duration.ofSeconds(30)).build();

        client.initialize();

    }
    // private void initStdioClient() {
    //     // builder(String) -> la commande est le premier argument obligatoire
    //     ServerParameters  params =  ServerParameters.builder("/ui/mcp")
    //     .build();
    //  McpJsonMapper jsonMapper = McpJsonDefaults.getMapper();
    //   StdioClientTransport transport = new StdioClientTransport(params,jsonMapper);

    //     client = McpClient.sync(transport).requestTimeout(Duration.ofSeconds(30)).build();

    //     client.initialize();
    // }
    public McpSyncClient getClient() {
        return client;
    }

    public ListToolsResult listTools() {
        return client.listTools();
    }
    public JSONArray listToolsAsOpenAIFormat() {
        return mcpToolsToOpenAIFormat(listTools().tools());
    }
    private static JSONArray mcpToolsToOpenAIFormat(List<io.modelcontextprotocol.spec.McpSchema.Tool> mcpTools) {
        JSONArray tools = new JSONArray();
        for (io.modelcontextprotocol.spec.McpSchema.Tool mcpTool : mcpTools) {
            JSONObject tool = new JSONObject();
            tool.put("type", "function");

            JSONObject function = new JSONObject();
            function.put("name", mcpTool.name());
            function.put("description", mcpTool.description() != null ? mcpTool.description() : "");

            if (mcpTool.inputSchema() != null) {
                // inputSchema() returns an McpSchema.JsonSchema
                // convert to a JSONObject
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    String schemaJson = mapper.writeValueAsString(mcpTool.inputSchema());
                    function.put("parameters", new JSONObject(schemaJson));
                } catch (Exception e) {
                    // fallback : empty schema 
                    AppLog.warning("fallback : empty schema for tool " + mcpTool.name(), e);
                    function.put("parameters", new JSONObject()
                        .put("type", "object")
                        .put("properties", new JSONObject()));
                }
            } else {
                function.put("parameters", new JSONObject()
                    .put("type", "object")
                    .put("properties", new JSONObject()));
            }

            tool.put("function", function);
            tools.put(tool);
        }
        AppLog.info("tools: "+tools.toString(1));
        return tools;
    }
    public CallToolResult callWithPrompt(String toolName, JSONObject arguments) {
        return client.callTool(new CallToolRequest(toolName, arguments.toMap()));
    }

    public void close() {
        if (client != null) {
            try {
                client.closeGracefully();
            } catch (Exception e) {
                AppLog.warning("Close error",e);
            }
        }
    }
     public String getToolDescription(String toolName) {
        if(Tool.isEmpty(toolName)) return null;
        if(client == null) return null;
        try {
            return client.listTools().tools().stream()
        .filter(tool -> tool.name().equals(toolName))
        .findFirst()
        .map(tool -> tool.description())
        .orElse("");
        } catch (Exception e) {
            AppLog.warning("Get tool description error",e);
            return null;
        }

    }
}