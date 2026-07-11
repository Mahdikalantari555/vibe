---
description: Retire a built or abandoned idea or spec by moving its project folder into archive/<project-name>/.
---

Move a project out of active development into the archive.

## Choose what to archive

Ask the user which project to archive. Look in `ideas/` and `specs/` for
`<project-name>` folders. Clarify whether they want to archive the idea, the
spec, or both.

## Move it

For each chosen folder, move its *contents* into `archive/<project-name>/`,
keeping the `ideas/` or `specs/` category but NOT repeating the project name as
an extra nested folder:

- `ideas/<project-name>/`  -> `archive/<project-name>/ideas/`
- `specs/<project-name>/`  -> `archive/<project-name>/specs/`

Final layout: `archive/<project-name>/ideas/<files...>` and
`archive/<project-name>/specs/<files...>`. The project name appears **once**,
as the `archive/<project-name>` parent — never `archive/<project>/<project>/`.

Use `git mv` if the folder is tracked, otherwise `mv`. If
`archive/<project-name>/ideas` or `/specs` already exists, merge the files in
(do not overwrite existing files without telling the user).

## Finish

Confirm what was moved and where. Note that archived projects are dormant, not
deleted — they can be revived by moving them back.
