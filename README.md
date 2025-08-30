# Stackpress Context Provider

Experimental MCP server implementation to provide Stackpress context to AI utilities like cline.

## 1. Usage

You can manually start the server like the following.

```bash
$ npx @stackpress/mcp serve
```

### 1.1. With Claude Desktop

Add the following configuration to your `claude_desktop_config.json`.

```json
{
  "mcpServers": {
    "stackpress-context": {
      "command": "npx",
      "args": [
        "@stackpress/mcp",
        "serve"
      ]
    }
  }
}
```

### 1.2. With Cline

Add the following configuration to your `cline_mcp_settings.json`.

```json
{
  "name": "stackpress-context",
  "command": "npx",
  "args": [
    "@stackpress/mcp",
    "serve"
  ]
}
```