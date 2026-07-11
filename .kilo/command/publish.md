---
description: Publish a Forge project's ideas and specs into a game repo under .specs/ (copy only). Archiving in vibe is a separate, deliberate step that relocates within the vibe repo.
---

Hand a Forge project to implementation by copying its `ideas/<project>/` and
`specs/<project>/` into a game repository as a flat `.specs/` of Markdown files.

**Publish only COPIES — it never removes or moves files from the vibe repo.**
Archiving the project in `vibe` is a separate, deliberate step (see Step 5)
that relocates the files within the `vibe` repo, so nothing is deleted.

## Inputs

- `<project>` — project slug; must match `ideas/<project>/` and `specs/<project>/` in vibe.
- `<game-repo>` — target repo `owner/name` for the implementation (e.g. `Mahdikalantari555/lone-ant`).

## Steps

1. Verify `ideas/<project>/` and `specs/<project>/` exist in vibe. If either is missing, stop and tell the user.
2. Ensure the target repo exists. If `<game-repo>` does not exist on GitHub, create it:
   `gh repo create <game-repo> --public --description "..."`
   (Visibility is your call; public works for GitHub Pages testing. Private still serves Pages to you when logged in.)
3. Clone `<game-repo>` to a temp dir (use `gh repo clone` or `gh auth setup-git` + https remote).
4. **Publish (copy only — vibe is untouched):** flatten into `.specs/` with plain
   filenames (no project prefix):
   - `ideas/<project>/<name>.md` → `.specs/<name>.md`
     (e.g. `concept.md`, `application.md`, `questions.md`)
   - `specs/<project>/spec.md` → `.specs/spec.md`
   - `specs/<project>/features/<feat>.md` → `.specs/feature-<feat>.md`
     (the `feature-` prefix distinguishes feature specs from idea files)
   Rewrite the internal links to the flat names (see Link rewriting). Commit and
   push the game repo. This `.specs/` folder is the agent-readable contract the
   coding agent uses to build the game. **Do not modify the vibe repo in this step.**
5. **Archive in vibe (separate, optional step):** only when you decide the project
   is built or retired, relocate it within the vibe repo so the workspace stays
   clean:
   - `git mv ideas/<project> archive/<project>/ideas/<project>`
   - `git mv specs/<project> archive/<project>/specs/<project>`
   Commit and push vibe. This moves files inside the vibe repo; nothing is
   deleted from vibe. (Equivalent to the `/archive` command.)
6. Report where the contract lives (`<game-repo>/.specs/...`) and, if archived,
   where it moved (`vibe/archive/<project>/...`).

## Link rewriting (step 4)

For every published `.md`, replace:
- `features/<feat>.md` → `feature-<feat>.md`
- `../spec.md` → `spec.md` (including `../spec.md#anchor`)
- `../../ideas/<project>/<name>.md` → `<name>.md`

Also fix any stale link *text* that still reads `ideas/<project>/...` or points
at the removed `features/` folder, and set the `source_idea` front-matter to `.`.

## Rules

- **Publish never removes or moves files from the vibe repo.** Step 4 only copies outward.
- Archiving (step 5) only relocates within vibe (ideas/ → archive/); the content stays in the vibe repo.
- Keep the contract and code in agreement: if the spec changes during build, re-run publish (or update `.specs/`) and push.
- Do not write implementation code in this step.
- `.specs/` MUST be flat (plain filenames, no project prefix; feature specs use `feature-`). No `ideas/`, `specs/`, or `<project>/` subfolders inside it. One project per game repo is assumed.
