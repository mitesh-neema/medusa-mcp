# Medusa-mcp
## Overview

The `medusa-mcp` project serves as a Model Context Protocol (MCP) server for the Medusa JavaScript SDK. It provides a robust and scalable backend solution to manage and interact with Medusa's data models efficiently.

## What is an MCP server

An MCP server refers to a Modular Communication Protocol server or similar systems that facilitate communication, data processing, and service orchestration across diverse computing environments. It is designed as a modular, scalable, and secure platform that supports inter-application communication, real-time service orchestration, and integration with external tools or systems. MCP servers are commonly used in industries such as AI development, industrial control systems, and enterprise-level integrations.

Key Features of MCP Servers
Modularity: MCP servers consist of distinct functional modules or services that perform specific tasks, enabling flexibility and scalability.

Communication Efficiency: They are optimized for high throughput and low latency communication, often using custom protocols or standards like JSON-RPC for interaction between components.

Extensibility: MCP servers support plugin systems or APIs to add new functionalities easily.

Flexible Deployment: They can be deployed across cloud, on-premises, or hybrid environments using containerization or virtualization technologies.

Standardization: MCP servers establish standardized protocols for integrating AI models (like Large Language Models) with external tools and data sources.

Role in AI Systems
In the context of AI, MCP servers act as bridges between AI applications (clients) and external systems. They provide real-world context and capabilities to AI models by:

Allowing access to up-to-date data from databases, APIs, or files.

Enabling interaction with external tools for automation tasks (e.g., sending emails or querying databases).

Facilitating interoperability between different AI tools and systems.

Applications
MCP servers are widely used in:

AI workflows to enhance Large Language Models by integrating external tools.

Enterprise integrations, where modularity and scalability are crucial.

Industrial IoT, enabling efficient communication between devices and systems.

In essence, MCP servers are powerful frameworks for building adaptable and efficient software architectures, particularly in environments requiring robust communication and real-time data processing.

## Medusa JS and MCP

Integrating MCP into MedusaJS can enhance its capabilities by enabling seamless third-party integrations, automating workflows with AI orchestration, simplifying customization, and providing intelligent insights—all while maintaining scalability and consistency across its architecture.

Using MCP, MedusaJS can leverage AI assistants to automate complex workflows. For example:

An AI assistant could use MCP servers to fetch product data from Medusa's database, analyze customer trends, and update pricing or inventory levels.

It could also automate tasks such as sending notifications, processing payments, or managing order fulfillment by interacting with Medusa's modules through MCP connectors

## Features

- **Model Context Protocol Support**: Implements MCP for seamless communication with Medusa SDK.
- **Scalability**: Designed to handle large-scale applications with ease.
- **Extensibility**: Easily extendable to support custom use cases.
- **Integration**: Works out-of-the-box with the Medusa JS SDK.

## Installation

To install the project, clone the repository and run the following commands:

```bash
npm install
```

```
npm build
```




## Usage

Start the server with:

```bash
npm start
```

or test with
```
npx @modelcontextprotocol/inspector .\dist\index.js
```

Remember to restart the inspector and launch a new browser after every build

## Environment variables:

MEDUSA_BACKEND_URL=<Your medusa backend url>
PUBLISHABLE_KEY=<Your publishable api key>

### for admin
MEDUSA_USERNAME=<Your medusa admin username>
MEDUSA_PASSWORD=<Your medusa admin password>

The server will be available at `http://localhost:3000` by default.

### customerizing the server

In the oas folder your can replace admin.json with your admin.json and similary store.json with your store.json 
alternatively , you can fork it make it your custom mcp server. 
Use this medusa-oas-cli[https://www.npmjs.com/package/@medusajs/medusa-oas-cli] to generate the JSON files. 


## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
