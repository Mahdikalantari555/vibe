---
description: Retire a built or abandoned idea or spec by moving its project folder into archive/<project-name>/.
---

Move a project out of active development into the archive.

## Choose what to archive

Ask the user which project to archive. Look in `ideas/` and `specs/` for
`<project-name>` folders. Clarify whether they want to archive the idea,
the spec, or both.

## Move it

For each chosen folder, move it from its current location into `archive/`,
preserving the project-name folder:

- `ideas/<project-name>/`  -> `archive/<project-name>/`
- `specs/<project-name>/`  -> `archive/<project-name>/` (merge if an archived
  folder of that name already exists)

Use `git mv` if the folder is tracked, otherwise `mv`. Never overwrite an
existing archive folder without telling the user.

## Finish

Confirm what was moved and where. Note that archived projects are dormant, not
deleted — they can be revived by moving them back.
