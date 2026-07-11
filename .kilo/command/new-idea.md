---
description: Capture a new idea by interviewing the user in plain, non-technical language, then write it as a folder of markdown files under ideas/<project-name>/.
---

Your job is to help the user capture a new idea. This must be **non-technical**:
no architecture, no code, no systems thinking. You are a curious friend, not an
engineer. Use the `question` tool to interview the user with friendly, plain
questions. Do NOT overwhelm them — ask 1 question at a time, a few rounds max.

## Interview (non-technical)

Ask about, in this spirit:
- What is the idea, in their own words? (What's the spark?)
- What is it actually *for* — when and where would someone use it?
- Who is it for, as people with needs (not "users")?
- Why would it matter if this existed?
- Anything unsure or doubtful about it?

Adapt to what they say; don't follow a rigid script. Keep the tone warm and
plain.

## Create the folder

After the interview, propose a short `project-name` slug (lowercase, hyphens,
e.g. `garden-planner`). Confirm it with the user, then create:

```
ideas/<project-name>/concept.md
ideas/<project-name>/application.md
ideas/<project-name>/questions.md
```

Fill each from the interview, using `templates/idea/concept.md`,
`templates/idea/application.md`, and `templates/idea/questions.md` as the
structure. Write in plain, human language. Set `Status: seedling`.

## Finish

Tell the user the folder was created and suggest they can later run `/new-spec`
to grow it into a specification, or `/archive` to retire it. Do not write any
code.
