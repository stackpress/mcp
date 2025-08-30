# Stackpress Context Provider

Experimental MCP server implementation to provide Stackpress context to AI utilities like cline.

## 1. Install

> Make sure you are using Node version 22

```bash
$ git clone https://github.com/stackpress/mcp.git stackpress-mcp
$ cd stackpress-mcp
$ npm i
$ npm run build
$ npm run fetch
$ pwd
```

Copy the response from `pwd` for the next sections.

### 1.1. With Claude Desktop

Add the following configuration to your `claude_desktop_config.json`.

```json
{
  "mcpServers": {
    "stackpress-context": {
      "command": "node",
      "args": [ "[pwd]/dist/scripts/serve.js" ]
    }
  }
}
```

### 1.2. With Cline

Add the following configuration to your `cline_mcp_settings.json`.

```json
{
  "name": "stackpress-context",
  "command": "node",
  "args": [ "[pwd]/dist/scripts/serve.js" ]
}
```

## 2. Usage

You can manually start the server like the following.

```bash
$ node [pwd]/dist/scripts/serve.js
```

You can also start the server with `npx` like the following.

```bash
$ npx . serve
```

## 3. Fetching Updated Context

You can manually fetch and verify the Stackpress context like the following.

```bash
$ node [pwd]/dist/scripts/fetch.js
$ node [pwd]/dist/scripts/verify.js
```

You can also fetch the context with `npx` like the following.

```bash
$ npx . fetch
$ npx . verify
```