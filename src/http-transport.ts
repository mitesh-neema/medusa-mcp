import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';

// Define the type for the request handler
type RequestHandler = (request: any) => Promise<any>;

// Define the ServerTransport interface based on the existing implementation
interface ServerTransport {
    connect(handler: RequestHandler): Promise<void>;
    disconnect(): Promise<void>;
}

export class HttpServerTransport implements ServerTransport {
    private app: express.Application;
    private server: any;
    private port: number;
    private handler: RequestHandler | null = null;

    constructor(port: number = 3000) {
        this.app = express();
        this.port = port;
        this.app.use(express.json());
    }

    async connect(handler: RequestHandler): Promise<void> {
        this.handler = handler;

        // Set up the main endpoint for MCP requests
        this.app.post('/mcp', async (req, res) => {
            try {
                const request = req.body;
                // const extra: RequestHandlerExtra = {
                //     remoteAddress: req.ip || '',
                //     headers: req.headers as Record<string, string>
                // };
                const response = await this.handler!(request);
                res.json(response);
            } catch (error) {
                console.error('Error handling MCP request:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : String(error)
                });
            }
        });

        // Health check endpoint
        this.app.get('/health', (_, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        // Start the server
        return new Promise((resolve) => {
            this.server = this.app.listen(this.port, () => {
                console.error(`MCP HTTP Server running on http://localhost:${this.port}`);
                resolve();
            });
        });
    }

    async disconnect(): Promise<void> {
        if (this.server) {
            return new Promise((resolve, reject) => {
                this.server.close((err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }
}
