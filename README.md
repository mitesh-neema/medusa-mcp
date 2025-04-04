# medusa-mcp
## Overview

The `medusa-mcp` project serves as a Model Context Protocol (MCP) server for the Medusa JavaScript SDK. It provides a robust and scalable backend solution to manage and interact with Medusa's data models efficiently.

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
