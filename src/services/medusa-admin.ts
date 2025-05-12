import Medusa from "@medusajs/js-sdk";
import { config } from "dotenv";
import { z, ZodTypeAny } from "zod";
import adminJson from "../oas/admin.json";
import { SdkRequestType, Parameter } from "../types/admin-json";
import { defineTool, InferToolHandlerInput } from "../utils/define-tools";

config();

const MEDUSA_BACKEND_URL =
    process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000";

const MEDUSA_USERNAME = process.env.MEDUSA_USERNAME ?? "medusa_user";
const MEDUSA_PASSWORD = process.env.MEDUSA_PASSWORD ?? "medusa_pass";

console.log(
    "Medusa backend url: ",
    MEDUSA_BACKEND_URL,
    "Medusa username: ",
    MEDUSA_USERNAME,
    "Medusa password: ",
    MEDUSA_PASSWORD
);

export default class MedusaAdminService {
    sdk: Medusa;
    adminToken = "";
    constructor() {
        this.sdk = new Medusa({
            baseUrl: MEDUSA_BACKEND_URL,
            debug: process.env.NODE_ENV === "development",
            publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
            auth: {
                type: "jwt"
            }
        });
    }

    async init(): Promise<void> {
        const res = await this.sdk.auth.login("user", "emailpass", {
            email: MEDUSA_USERNAME,
            password: MEDUSA_PASSWORD
        });
        this.adminToken = res.toString();
    }

    wrapPath(refPath: string, refFunction: SdkRequestType) {
        return defineTool((z) => {
            let name;
            let description;
            let parameters: Parameter[] = [];
            let method = "get";
            if ("get" in refFunction) {
                method = "get";
                name = refFunction.get.operationId;
                description = refFunction.get.description;
                parameters = (refFunction.get.parameters ?? "") as any;
            } else if ("post" in refFunction) {
                method = "post";
                name = refFunction.post.operationId;
                description = refFunction.post.description;
                parameters = refFunction.post.parameters ?? [];
            } else if ("delete" in refFunction) {
                method = "delete";
                name = (refFunction.delete as any).operationId;
                description = (refFunction.delete as any).description;
                parameters = (refFunction.delete as any).parameters ?? [];
            }
            if (!name) {
                throw new Error("No name found for path: " + refPath);
            }
            return {
                name: `Admin${name}`,
                description: `This tool helps store administors. ${description}`,
                inputSchema: {
                    ...parameters
                        .filter((p) => p.in != "header")
                        .reduce((acc, param) => {
                            switch (param.schema.type) {
                                case "string":
                                    acc[param.name] = z.string().optional();
                                    break;
                                case "number":
                                    acc[param.name] = z.number().optional();
                                    break;
                                case "boolean":
                                    acc[param.name] = z.boolean().optional();
                                    break;
                                case "array":
                                    acc[param.name] = z
                                        .array(z.string())
                                        .optional();
                                    break;
                                case "object":
                                    acc[param.name] = z.object({}).optional();
                                    break;
                                default:
                                    acc[param.name] = z.string().optional();
                            }
                            return acc;
                        }, {} as any)
                },

                handler: async (
                    input: InferToolHandlerInput<any, ZodTypeAny>
                ): Promise<any> => {
                    // Process path parameters
                    let processedPath = refPath;
                    const pathParams = parameters.filter(p => p.in === "path");
                    
                    // Replace path parameters with actual values
                    pathParams.forEach(param => {
                        if (input[param.name]) {
                            const paramPlaceholder = `{${param.name}}`;
                            processedPath = processedPath.replace(paramPlaceholder, input[param.name]);
                            console.error(`Replaced path parameter ${param.name}: ${paramPlaceholder} -> ${input[param.name]}`);
                        } else if (pathParams.length > 0) {
                            console.error(`Warning: Path parameter ${param.name} not provided in input for path ${refPath}`);
                        }
                    });
                    
                    if (refPath !== processedPath) {
                        console.error(`Path transformation: ${refPath} -> ${processedPath}`);
                    }

                    // Process query and body parameters
                    const queryParams = parameters.filter(p => p.in === "query");
                    const query = new URLSearchParams();
                    queryParams.forEach(param => {
                        if (input[param.name] !== undefined) {
                            query.append(param.name, input[param.name]);
                        }
                    });
                    const body = Object.entries(input).reduce(
                        (acc, [key, value]) => {
                            if (
                                parameters.find(
                                    (p) => p.name === key && p.in === "body"
                                )
                            ) {
                                acc[key] = value;
                            }
                            return acc;
                        },
                        {} as Record<string, any>
                    );

                    if (method === "get") {
                        const response = await this.sdk.client.fetch(processedPath, {
                            method: method,
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": `Bearer ${this.adminToken}`
                            },
                            query
                        });
                        return response;
                    } else {
                        const response = await this.sdk.client.fetch(processedPath, {
                            method: method,
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": `Bearer ${this.adminToken}`
                            },
                            body: JSON.stringify(body)
                        });
                        return response;
                    }
                }
            };
        });
    }

    defineTools(admin = adminJson): any[] {
        const paths = Object.entries(admin.paths) as [string, SdkRequestType][];
        const tools = paths.map(([path, refFunction]) =>
            this.wrapPath(path, refFunction)
        );
        return tools;
    }
}
