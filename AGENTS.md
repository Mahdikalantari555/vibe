# AGENTS.md

This repository is **Forge** — a workshop for forging ideas and writing
specifications for future projects. It is not a codebase; it is a thinking space.

## Purpose

- Capture raw ideas in `ideas/`.
- Refine surviving ideas into specifications in `specs/`.
- Retire built or abandoned work into `archive/`.

The goal is clarity, not code. Decide *what* and *why* here; *how* happens later, elsewhere.

## Structure

```
ideas/      # Raw, unpolished thoughts. One file per idea.
specs/      # Refined specifications. Ready to hand to a builder.
archive/    # Dead, deferred, or superseded ideas and specs.
templates/  # Boilerplate for new ideas and specs.
scripts/    # Setup and helper scripts.
```

## Conventions

- Write in Markdown.
- Name idea files `ideas/YYYY-MM-DD-<slug>.md`.
- Name spec files `specs/<project-name>.md`.
- A spec must address: Problem, Users, Goals, Non-goals, Approach,
  Open questions, Milestones. Use `templates/spec.md` as the base.
- Use `templates/idea.md` for new ideas (front-matter + free-form body).
- Link the source idea from a spec's `source_idea` field so the trail is visible.

## Workflow

1. Capture an idea in `ideas/`.
2. When an idea survives, promote it to a spec in `specs/`.
3. Move built or abandoned entries to `archive/`.

## Setup

On a fresh clone, run `/init` (or `bash scripts/forge-init.sh`) to scaffold the
directories and templates. The script is idempotent and will not overwrite
existing files.

## For agents

- When asked to record a new idea, create it from `templates/idea.md` in `ideas/`.
- When asked to write a spec, create it from `templates/spec.md` in `specs/`
  and link back to its source idea.
- Prefer short, honest entries over long, vague ones.
- Do not write implementation code here unless explicitly asked.
