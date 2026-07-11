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

## Create the spec

Create `specs/<project-name>/spec.md` from `templates/spec/spec.md`. Fill in,
in plain language:

- **Problem** — what's wrong or missing, from the human side.
- **Users** — who benefits and what they care about.
- **Goals** — what success looks like.
- **Non-goals** — what's explicitly out of scope.
- **Approach** — the shape of a solution, no code.
- **Open questions** — what still needs deciding.
- **Milestones** — rough stepping stones.

Set the front-matter `source_idea` to `ideas/<project-name>/` so the link back
is visible. Set `Status: draft`.

If something important is missing, ask the user 1–2 plain clarifying questions
before writing. Do not write implementation code.

## Finish

Tell the user where the spec was created and that the idea can later be moved
with `/archive` once built or abandoned.
