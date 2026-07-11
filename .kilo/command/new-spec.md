---
description: Turn an existing idea folder into a specification folder under specs/<project-name>/, following the spec template.
---

Grow an idea into a specification.

## Pick the idea

Ask the user which idea to spec (list the folders under `ideas/` if helpful).
The `project-name` must match the idea folder exactly so the trail stays visible.

## Read first

Read the idea folder at `ideas/<project-name>/` (concept.md, application.md,
questions.md) to ground the spec in what the user already said.

## Documentation style (follow this)

Specs are read by humans AND AI agents, often before any code exists. Write
them to be **navigational and explanatory, not exhaustive** (per the
repo-local documentation guidance). Specifically:

- Use **stable, clear Markdown headings** (easy to link to and grep).
- Explain **what matters and why**, not every implementation detail.
- Break the design into **systems** and **flows**: what each part does, its
  responsibilities, and how the important behaviors move step by step.
- State **invariants and assumptions** that must stay true.
- Mark **uncertainty explicitly** instead of guessing.
- Include a **source map** with relative Markdown links back to the idea
  folder and, later, to the key source files.
- Link related docs with **relative Markdown links** from the spec file.
- Prefer conciseness a reader can absorb before making changes.

The best spec is not the longest — it is the one that helps a reader
understand what matters, where the details live, and what could break.

## Create the spec

Create `specs/<project-name>/spec.md` from `templates/spec/spec.md`. Fill it
in plain language using the richer structure in the template: Purpose,
Questions this spec answers, Audience, Goals, Non-goals, Core loop, Systems,
Flows, Platform/deployment, Invariants, Open questions, Milestones, Source
map, Related docs.

Set the front-matter `source_idea` to `ideas/<project-name>/` so the link back
is visible. Set `Status: draft`.

If something important is missing, ask the user 1–2 plain clarifying questions
before writing. Do not write implementation code.

## Finish

Tell the user where the spec was created and that the idea can later be moved
with `/archive` once built or abandoned.
