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

## 2.1. Fetching Updated Context

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

## 2.2. Upgrading Search Model

The MCP uses `Xenova/all-MiniLM-L6-v2` locally to determine the best search query term for the MCP. Think about it like random prompt → correct query → ask MCP. You can upgrade this to use your OpenAI key by adding `OPENAI_HOST`, `OPENAI_KEY` and `EMBEDDING_MODEL` environment variables in your MCP settings like the following.

```json
{
  "name": "stackpress-context",
  "command": "node",
  "args": [ "[pwd]/dist/scripts/serve.js" ],
  "env": {
    "OPENAI_HOST": "https://api.openai.com/v1",
    "OPENAI_KEY": "sk-xxx",
    "EMBEDDING_MODEL": "text-embedding-3-small"
  }
}
```

> WARNING: OpenRouter doesn't support the `/embeddings` API endpoint. This is called when providing an OpenAI compatible host.