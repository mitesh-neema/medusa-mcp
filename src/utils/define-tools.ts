import { z, ZodType } from "zod";
import { CallToolResult, RequestHandlerExtra } from "@modelcontextprotocol/sdk";

export type ToolDefinition<T, R extends ZodType, O> = {
    name: string;
    description: string;
    inputSchema: T;
    handler: (input: InferToolHandlerInput<T, R>) => Promise<O>;
};

export type InferToolHandlerInput<T, X extends ZodType> = {
    [K in keyof T]: z.infer<X>;
};

export const defineTool = (cb: (zod: typeof z) => ToolDefinition) => {
    const tool = cb(z);

    const wrappedHandler = async (
        input: InferToolHandlerInput<string, Zod.ZodString>,
        _: RequestHandlerExtra
    ): Promise<{
        content: CallToolResult["content"];
        isError?: boolean;
        statusCode?: number;
    }> => {
        try {
            const result = await tool.handler(input);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${
                            error instanceof Error
                                ? error.message
                                : String(error)
                        }`
                    }
                ],
                isError: true
            };
        }
    };

    return {
        ...tool,
        handler: wrappedHandler
    };
};
