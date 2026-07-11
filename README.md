# Forge

A workshop for **forging ideas** and writing **specifications** for future projects.

This is not a codebase. It is a thinking space — a place to capture sparks,
sharpen them into concepts, and cool them into written specs ready to be built.

## Why this exists

- Ideas are fragile. Writing them down makes them real.
- Specs beat memory. A good spec is the cheapest version of the project you can fail at.
- Separation of concerns. Here we decide *what* and *why*. Building *how* happens later, elsewhere.

## How it's organized

```
ideas/      # Raw, unpolished thoughts. Anything goes. One file per idea.
specs/      # Refined specifications derived from ideas. Ready to hand to a builder.
archive/    # Dead, deferred, or superseded ideas and specs.
```

### Ideas

Loose and low-pressure. An idea can be a sentence or a paragraph. The goal is
volume and honesty, not polish. Use `ideas/YYYY-MM-DD-<slug>.md`.

### Specs

Specifications are the output of this forge. A good spec answers:

- **Problem** — what is wrong or missing?
- **Users** — who cares, and why?
- **Goals** — what does success look like?
- **Non-goals** — what is explicitly out of scope?
- **Approach** — the shape of a solution, not the code.
- **Open questions** — what we still don't know.
- **Milestones** — rough stepping stones toward done.

Use `specs/<project-name>.md`.

## Workflow

1. Capture an idea in `ideas/`.
2. When an idea survives a few days, promote it: turn it into a spec in `specs/`.
3. Link the source idea from the spec so the trail is visible.
4. When a spec is built, or abandoned, move it to `archive/`.

## Conventions

- Write in Markdown.
- Name files with dates or clear slugs.
- Prefer clarity over completeness. A short honest spec beats a long vague one.

---

*Forge ideas. Write specs. Build later.*
