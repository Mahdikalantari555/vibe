# Forge

A workshop for **forging ideas** and writing **specifications** for future projects.

This is not a codebase. It is a thinking space — a place to capture sparks,
sharpen them into concepts, and cool them into written specs ready to be built.

## Why this exists

- Ideas are fragile. Writing them down makes them real.
- Specs beat memory. A good spec is the cheapest version of the project you can fail at.
- Separation of concerns. Here we decide *what* and *why*. Building *how* happens later, elsewhere.

## How it's organized

Everything is grouped by **project**. Each idea, spec, and archived project
lives in its own folder, named with a lowercase, hyphenated slug:

```
ideas/<project-name>/     # Raw, unpolished thoughts. One folder per idea.
specs/<project-name>/     # A refined specification. One folder per project.
archive/<project-name>/   # Dead, deferred, or superseded projects.
```

### Ideas

Captured through a friendly, non-technical interview. A new idea folder holds
several markdown files exploring the idea from different angles, e.g.:

- `concept.md` — the idea in plain language.
- `application.md` — what it's for, who it's for, why it matters.
- `questions.md` — what's still uncertain.

### Specs

A specification is the output of this forge. A good spec answers:

- **Problem** — what is wrong or missing?
- **Users** — who cares, and why?
- **Goals** — what does success look like?
- **Non-goals** — what is explicitly out of scope?
- **Approach** — the shape of a solution, not the code.
- **Open questions** — what we still don't know.
- **Milestones** — rough stepping stones toward done.

## Commands

These Kilo commands drive the workflow:

- `/new-idea` — interview you (plain, non-technical) and create
  `ideas/<project-name>/` with multiple markdown files.
- `/new-spec` — read an idea folder and write `specs/<project-name>/spec.md`.
- `/publish` — copy a project's `ideas/` and `specs/` into a new game repo under `.specs/`, then archive the originals in `vibe`.
- `/archive` — move an idea or spec folder into `archive/<project-name>/`.

On a fresh clone, run `/init` (built-in) to generate `AGENTS.md`, then the
forge `/init` (or `bash scripts/forge-init.sh`) to scaffold the directories
and templates.

## Workflow

1. Run `/new-idea` to capture a thought in `ideas/<project-name>/`.
2. When an idea survives, run `/new-spec` to promote it to `specs/<project-name>/`.
3. Link the source idea from the spec so the trail is visible.
4. When built or abandoned, run `/archive` to move it to `archive/<project-name>/`.

## Conventions

- Write in Markdown.
- Use a lowercase, hyphenated slug for every project folder.
- Prefer clarity over completeness. A short honest entry beats a long vague one.

---

*Forge ideas. Write specs. Build later.*
