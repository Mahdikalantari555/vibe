---
description: Publish a Forge project's ideas and specs into a new game repo under .specs/, then archive the originals in the vibe repo.
---

Hand a Forge project off to implementation: copy its `ideas/<project>/` and
`specs/<project>/` into a new (or existing) game repository as a flat set of
Markdown files under `.specs/`, then archive the originals in `vibe` so the
thinking space stays clean.

## Inputs

- `<project>` — project slug; must match `ideas/<project>/` and `specs/<project>/` in vibe.
- `<game-repo>` — target repo `owner/name` for the implementation (e.g. `Mahdikalantari555/lone-ant`).

## Steps

1. Verify `ideas/<project>/` and `specs/<project>/` exist in vibe. If either is missing, stop and tell the user.
2. Ensure the target repo exists. If `<game-repo>` does not exist on GitHub, create it:
   `gh repo create <game-repo> --public --description "..."`
   (Visibility is your call; public works for GitHub Pages testing. Private still serves Pages to you when logged in.)
3. Clone `<game-repo>` to a temp dir (use `gh repo clone` or `gh auth setup-git` + https remote).
4. **Publish** into the game repo as a FLAT set of files directly under `.specs/`
   (no `ideas/` or `specs/` or `<project>/` subfolders). Prefix every file with
   the project slug to avoid collisions when multiple projects are published:
   - `ideas/<project>/<name>.md` → `.specs/<project>-<name>.md`
     (e.g. `concept.md` → `lone-ant-concept.md`, `application.md` → `lone-ant-application.md`)
   - `specs/<project>/spec.md` → `.specs/<project>-spec.md`
   - `specs/<project>/features/<feat>.md` → `.specs/<project>-feature-<feat>.md`
   - Commit and push. This `.specs/` folder is the agent-readable contract the
     coding agent uses to build the game.
5. **Rewrite internal links** in the published files so they point at the flat
   names (the copies still contain the old nested relative links). For every
   published `.md`, replace:
   - `features/<feat>.md` → `<project>-feature-<feat>.md`
   - `../spec.md` → `<project>-spec.md` (including `../spec.md#anchor`)
   - `../../ideas/<project>/<name>.md` → `<project>-<name>.md`
   Also fix any stale link *text* that still reads `ideas/<project>/...` or
   points at the removed `features/` folder, and update the `source_idea`
   front-matter to just `<project>`.
6. **Archive** in vibe, mirroring the original structure so the archived copy's
   links still resolve:
   - `git mv ideas/<project> archive/<project>/ideas/<project>`
   - `git mv specs/<project> archive/<project>/specs/<project>`
   Commit and push vibe.
7. Report where the contract lives (`<game-repo>/.specs/<project>-*.md`) and
   where the originals were archived (`vibe/archive/<project>/...`).

## Rules

- Treat the published `.specs/` as a copy/handoff — never delete the source before archiving.
- Keep the contract and code in agreement: if the spec changes during build, re-run publish (or update `.specs/`) and push.
- Do not write implementation code in this step.
- `.specs/` MUST be flat (all `.md` directly under `.specs/`, prefixed by project slug). Do not recreate `ideas/`, `specs/`, or `<project>/` subfolders inside it. The archived copy in vibe keeps the original nested layout.
