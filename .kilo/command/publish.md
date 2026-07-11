---
description: Publish a Forge project's ideas and specs into a new game repo under .specs/, then archive the originals in the vibe repo.
---

Hand a Forge project off to implementation: copy its `ideas/<project>/` and
`specs/<project>/` into a new (or existing) game repository under a `.specs/`
folder, then archive the originals in `vibe` so the thinking space stays clean.

## Inputs

- `<project>` — project slug; must match `ideas/<project>/` and `specs/<project>/` in vibe.
- `<game-repo>` — target repo `owner/name` for the implementation (e.g. `Mahdikalantari555/lone-ant`).

## Steps

1. Verify `ideas/<project>/` and `specs/<project>/` exist in vibe. If either is missing, stop and tell the user.
2. Ensure the target repo exists. If `<game-repo>` does not exist on GitHub, create it:
   `gh repo create <game-repo> --public --description "..."`
   (Visibility is your call; public works for GitHub Pages testing.)
3. Clone `<game-repo>` to a temp dir (use `gh repo clone` or a token URL).
4. **Publish** into the game repo, mirroring the Forge structure so relative
   links keep resolving:
   - `.specs/ideas/<project>/` ← copy of `ideas/<project>/`
   - `.specs/specs/<project>/` ← copy of `specs/<project>/` (overview + `features/`)
   Commit and push. This `.specs/` folder is the agent-readable contract the
   coding agent uses to build the game.
5. **Archive** in vibe, again mirroring structure so internal links resolve:
   - `git mv ideas/<project> archive/<project>/ideas/<project>`
   - `git mv specs/<project> archive/<project>/specs/<project>`
   Commit and push vibe.
6. Report where the contract lives (`<game-repo>/.specs/...`) and where the
   originals were archived (`vibe/archive/<project>/...`).

## Rules

- Treat the published `.specs/` as a copy/handoff — never delete the source before archiving.
- Keep the contract and code in agreement: if the spec changes during build, re-run publish (or update `.specs/`) and push.
- Do not write implementation code in this step.
- Mirror the directory layout exactly (`.specs/ideas/...`, `.specs/specs/...`,
  `archive/<project>/ideas/...`, `archive/<project>/specs/...`) so the
  relative Markdown links in the specs keep resolving.
