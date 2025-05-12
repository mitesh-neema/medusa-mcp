import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import MedusaStoreService from "./services/medusa-store";
import MedusaAdminService from "./services/medusa-admin";
import WebScraperService from "./services/web-scraper";
import { HttpServerTransport } from "./http-transport";

// Get port from environment variable or use default
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function main(): Promise<void> {
    console.error("Starting Medusa Store MCP HTTP Server...");
    const medusaStoreService = new MedusaStoreService();
    const medusaAdminService = new MedusaAdminService();
    const webScraperService = new WebScraperService();
    
    let tools = [];
    try {
        await medusaAdminService.init();

        tools = [
            ...medusaStoreService.defineTools(),
            ...medusaAdminService.defineTools(),
            webScraperService.defineTool()
        ];
    } catch (error) {
        console.error("Error initializing Medusa Admin Services:", error);
        tools = [
            ...medusaStoreService.defineTools(),
            webScraperService.defineTool()
        ];
    }

    const server = new McpServer(
        {
            name: "Medusa Store MCP Server",
            version: "1.0.0"
        },
        {
            capabilities: {
                tools: {}
            }
        }
    );

    tools.forEach((tool) => {
        server.tool(
            tool.name,
            tool.description,
            tool.inputSchema,
            tool.handler
        );
    });

    const transport = new HttpServerTransport(PORT);
    console.error(`Using HTTP transport on port ${PORT}`);

    console.error("Connecting server to transport...");
    await server.connect(transport);

    console.error(`Medusajs MCP Server running on http://localhost:${PORT}`);
    console.error(`Health check available at http://localhost:${PORT}/health`);
    console.error(`MCP endpoint available at http://localhost:${PORT}/mcp`);
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
