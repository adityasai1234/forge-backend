# Forge Backend Architecture

The FORGE application backend is distributed across multiple interconnected components to handle data ingestion, AI-driven analysis, and AI tool extensions.

## Core Components

1. **Next.js API Gateway (`forge-app/app/api/`)**
   - Serves as the primary entry point for frontend requests.
   - Handles orchestration of AI workflows by directly communicating with the Python Agent server.
   - Provides streaming responses via Server-Sent Events (SSE) to the frontend (e.g., `/api/analyze` route).

2. **Python Agent Server (`forge-app/agents/`)**
   - A modular, Agno-powered backend executing the core business logic: research paper analysis and SaaS conceptualization.
   - Exposes a REST API on port `8321`.
   - Utilizes a 3-agent flow (Analyst -> Architect -> Strategist) leveraging AWS Bedrock.

3. **Supabase PostgreSQL Database (`forge-app/supabase/`)**
   - Serves as the primary data store and vector database (using `pgvector`).
   - Stores ingested arXiv papers (`forge_papers`) and AI-generated SaaS opportunity paths (`forge_opportunities`).
   - Supports approximate nearest neighbor search via IVFFlat indexes.

4. **MCP Server (`mcp-server/`)**
   - A Node.js backend service acting as an AI tool provider.
   - Connects local resources (Excalidraw, filesystem) and external services (GitHub Actions, issues) into the AI context via the Model Context Protocol.

## System Workflow Pipeline

The typical "Analyze" workflow functions as follows:

1. The user inputs an arXiv query/URL to the Next.js frontend.
2. The request hits Next.js `/api/analyze` backend.
3. The Next.js API calls the Python Agent Server (`http://127.0.0.1:8321`) multiple times sequentially.
   - `forge-analyst`: Extracts the paper's core breakthrough.
   - `product-architect`: Generates potential SaaS features based on the breakthrough.
   - `market-strategist`: Builds a go-to-market plan for the top SaaS feature.
4. Next.js combines these results, saves an entry in the Supabase `forge_opportunities` table, and streams the structured output back to the frontend.
