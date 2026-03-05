# Python Agent Server

The Python backend (`forge-app/agents/`) handles the deeply nested analytical tasks of assessing research papers and outputting structured SaaS concepts. It is built conceptually around the **Agno framework**.

## Setup & Execution

- **Dependencies**: Managed via `uv`/`pip` (Python 3.10+).
- **Environment**: Reads from `forge-app/.env.local` (`AWS_BEARER_TOKEN_BEDROCK`, `SUPABASE_DB_URL`, etc.).
- **Execution**: `uv run python server.py` spins up the REST server on `http://localhost:8321`.

## The ForgeFlow 3-Agent System

The orchestration relies on three distinct AI agents that run in sequence:

1. **Forge Analyst (`forge-analyst`)**
   - **Role**: Reads the paper's abstract, title, and authors to extract purely technical essence.
   - **Output**: Generates a "Core Breakthrough" summary.
2. **Product Architect (`product-architect`)**
   - **Role**: Takes the Analyst's output and brainstorms 3-5 distinct commercialization directions or SaaS startup ideas.
   - **Output**: A shortlist of actionable concepts and one definitive recommendation.

3. **Market Strategist (`market-strategist`)**
   - **Role**: Inherits the Architect's recommendation to design a robust Go-To-Market (GTM) strategy, an MVP scope, and competitive moat analysis.
   - **Output**: A structured strategic plan.

## Design Principles

- **JSON Exclusivity**: All agents strictly output valid JSON to seamlessly pipe into the Next.js frontend.
- **Traceability**: All output from downstream agents (Architect, Strategist) must directly connect back to the Analyst's identified "Core Breakthrough".
- **Tooling Integrations**: `arxiv.py` (Arxiv context retrieval), `scholar.py` (Semantic Scholar), and Fallback web search (`DuckDuckGoTools`).
- **Knowledge Base**: Configured with `Supabase PgVector` integration (`knowledge.py`) to store embedded context.
