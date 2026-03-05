# Supabase Database Architecture

The data layer is managed in Supabase via PostgreSQL, heavily leveraging the `pgvector` extension for embeddings and semantic similarity. The schema is documented in `forge-app/supabase/schema.sql`.

## Core Tables

### 1. `forge_papers`

- **Purpose**: Stores the raw metadata of ingested arXiv papers.
- **Key Columns**:
  - `arxiv_id` (Unique identifier)
  - `title`, `abstract`, `authors`, `year`
  - `embedding` (`VECTOR(1536)`): AWS Titan generated embeddings for semantic matching.
  - `status`: Tracking insertion progress.
- **Indexes**: Includes GIN index for full-text text search on titles/abstracts, and an `ivfflat` index for vector cosine similarity queries.

### 2. `forge_opportunities`

- **Purpose**: A strictly 1:1 relationship via `paper_id` referencing `forge_papers`. Stores the AI-designed SaaS plans.
- **Key Columns**:
  - `analyst_summary` (JSONB)
  - `architect_design` (JSONB)
  - `strategist_plan` (JSONB)
  - `nova_score`: An aggregate integer (0-100) combining Novelty, Opportunity, Velocity, Advantage.
- **Indexes**: GIN indexes applied to all JSONB fields for fast nested queries.

## Row Level Security (RLS)

The database imposes strict security via RLS:

- **Public**: Has permissive read access (`SELECT`) to records.
- **Service Role**: Only the `service_role` (backend servers like Next.js or Python) can manage, insert, or update the records via `ALL` policies.

## Semantic Search Methods

- Exposes a `search_papers_by_similarity(query_embedding)` PL/pgSQL function taking a 1536-dimensional vector and a match threshold length, returning papers sorted by closest vector match.
