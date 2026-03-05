# Forge MCP Server

The project includes an external Model Context Protocol (MCP) server located in `/mcp-server/`. This NodeJS service bridges the local AI models logic with external services and filesystem data.

## Features & Tools Provided

The MCP Server exposes the following critical tools to any connected AI ecosystem:

- **Codebase Access**: `search_codebase`, `read_file`, `list_directory`.
- **Excalidraw Parser**: `read_excalidraw` parses visual architecture diagrams back to text objects.
- **GitHub Integration**: `github_dispatch_action` (triggers CI/CD or other workflows), `github_create_issue`, and `github_add_comment` to tightly integrate the agent with the repository's SDLC.
- **Obsidian-like Knowledge Graph**: `save_idea` (persists tags, markdown notes) and `get_ideas_graph` (returns graphs via linked notes).

## Operations

- **Startup**: Triggered via `node build/index.js`.
- **Authentication**: Connects to the GitHub API securely using a standard `GITHUB_TOKEN` environment variable.
