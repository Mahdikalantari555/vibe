# AGENTS.md

This repository is **Forge** — a workshop for forging ideas and writing
specifications for future projects. It is not a codebase; it is a thinking space.

## Purpose

- Capture raw ideas in `ideas/<project-name>/`.
- Refine surviving ideas into specifications in `specs/<project-name>/`.
- Retire built or abandoned work into `archive/<project-name>/`.

The goal is clarity, not code. Decide *what* and *why* here; *how* happens
later, elsewhere. Everything is organized by **project name**: each idea, spec,
and archived project lives in its own folder.

## Structure

```
ideas/<project-name>/     # Raw, unpolished thoughts about one project.
specs/<project-name>/     # A refined specification for one project.
archive/<project-name>/   # Retired, deferred, or superseded projects.
templates/idea/           # Boilerplate for a new idea folder.
templates/spec/           # Boilerplate for a new spec folder.
scripts/                  # Setup and helper scripts.
```

A new idea folder contains several markdown files (e.g. `concept.md`,
`application.md`, `questions.md`) so a single idea can be explored from
different angles.

## Commands

These Kilo commands drive the workflow:

- `/new-idea` — interview the user (plain, non-technical) and create
  `ideas/<project-name>/` with multiple markdown files.
- `/new-spec` — read an idea folder and write `specs/<project-name>/spec.md`.
- `/publish` — copy a project's `ideas/` and `specs/` into a new game repo under `.specs/`, then archive the originals in `vibe`.
- `/archive` — move an idea or spec folder into `archive/<project-name>/`.
- `/init` (built-in) — generate this `AGENTS.md`.
- `/init` (forge command) — scaffold the directories and templates via
  `scripts/forge-init.sh`.

## Conventions

- Write in Markdown.
- Name every project folder with a lowercase, hyphenated slug
  (`garden-planner`), used consistently across `ideas/`, `specs/`, `archive/`.
- A spec must address: Problem, Users, Goals, Non-goals, Approach,
  Open questions, Milestones. Use `templates/spec/spec.md` as the base.
- Use `templates/idea/` for new ideas (front-matter + plain-language body).
- Link the source idea from a spec's `source_idea` field (path to the idea
  folder) so the trail is visible.
- Prefer short, honest entries over long, vague ones.

## Setup

On a fresh clone, run `/init` to generate `AGENTS.md`, then run the forge
`/init` (or `bash scripts/forge-init.sh`) to scaffold the directories and
templates. The script is idempotent and will not overwrite existing files.

## For agents

- When asked to record a new idea, run `/new-idea`. Do not ask technical
  questions; explore the idea's real-world application in plain language.
- When asked to write a spec, run `/new-spec` and link back to its source idea.
- When asked to retire work, run `/archive`.
- Do not write implementation code here unless explicitly asked.
