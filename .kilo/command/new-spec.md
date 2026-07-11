---
description: Turn an existing idea folder into a specification under specs/<project-name>/, following a spec-driven (contract) style with per-feature acceptance criteria.
---

Grow an idea into a specification. The spec is a **contract**, not an essay:
AI agents build against it, and "done" means the acceptance criteria pass.

## Pick the idea

Ask the user which idea to spec (list the folders under `ideas/` if helpful).
The `project-name` must match the idea folder exactly so the trail stays visible.

## Read first

Read the idea folder at `ideas/<project-name>/` (concept.md, application.md,
questions.md) to ground the spec in what the user already said.

## Create the spec (overview + features)

Create `specs/<project-name>/spec.md` from `templates/spec/spec.md` — the
product/overview contract: Purpose, Audience, Goals, Non-goals, Core loop,
Platform/tech, Constraints (three-tier), Assumptions (risk-tagged), whole-product
Acceptance criteria, Edge cases, Open questions, and links to feature specs.

Then create one file per behavioral area under
`specs/<project-name>/features/<feature>.md` from `templates/spec/feature.md`.
Each feature spec MUST have:

- **Requirements** using RFC 2119 keywords (SHALL / MUST, SHALL NOT / MUST NOT).
  One behavior per requirement, numbered (FR-1, FR-2, …).
- **Acceptance Criteria** that are **binary and verifiable** — Given/When/Then
  or explicit input→output. Each references the requirement(s) it satisfies.
  "Works correctly" is NOT a criterion. Each should be convertible to a test.
- **Constraints** as three tiers: ✅ Always / ⚠️ Ask first / 🚫 Never.
- **Edge Cases** (empty, error, concurrent, null, boundary).
- **Out of Scope** (what this feature explicitly does not do).
- **Validation** (how a human/agent confirms it — manual + automated).
- **Source map** (relative link to the idea and, later, key source files).

Keep each feature spec to roughly 30–60 lines. Split large areas into more
feature files rather than bloating one.

Set `source_idea` in the overview front-matter to `ideas/<project-name>/`.
Set overview `status: in-review` and require human approval before any code is
written (the spec is the source of truth; code follows it).

## Documentation style

Specs are read by humans AND agents. Write them to be **navigational and
explanatory, not exhaustive**: stable headings, explain what matters and why,
break design into systems/flows, state invariants, mark uncertainty explicitly,
and include a **source map** with relative Markdown links. The best spec is not
the longest — it is the one with no room to misread.

## Living document

If a decision changes during implementation, update the spec section **first**,
then implement. A spec that drifts from reality misleads the agent.

## Finish

Tell the user where the spec was created, that it needs their approval before
building, and that the idea can later be moved with `/archive` once built or
abandoned. Do not write implementation code.
