---
title: ""
date: ""
status: in-review
source_idea: ""   # path to the idea folder this grew from, e.g. ideas/<project>/
---

# <Project> — Product Specification

The product/overview contract. It states the *what* and *why*. Each behavioral
area lives in its own feature spec under `features/` with binary, testable
acceptance criteria. Code is built against those feature specs, not this prose.

## Purpose (why)

One or two sentences on what this is and why it should exist.

## Audience

Who benefits and what they care about. (Link to the idea's application.md.)

## Goals

- G1: …
- G2: … (make them measurable where possible)

## Non-goals (Version 1)

What is explicitly out of scope.

## Core loop

The moment-to-moment experience and how progress persists between sessions.

## Platform & tech approach

Stack, deploy target, tooling, offline story. Pin versions when known.

## Constraints (three-tier)

- ✅ Always: …
- ⚠️ Ask first: …
- 🚫 Never: …

## Assumptions (risk-tagged)

- A1 (Medium): … *If false, …*
- A2 (Low): …

## Acceptance criteria (whole-product, binary)

- AC-1: Given …, When …, Then … (maps to a feature spec)
- AC-2: …

## Edge cases (cross-cutting)

- E1: …
- E2: …

## Open questions (unresolved — human decides)

- OQ-1 (highest risk): …

## Feature specs

- [features/<feature>.md](features/<feature>.md)

## Source map

Grew from: [ideas/<project>/](../ideas/<project>/). Link key source files here
once implementation begins.

## Related docs

- Source idea: [ideas/<project>/](../ideas/<project>/)

## Status & approval

Status: **in-review**. Do not implement until the human approves this overview
and the linked feature specs. Update the relevant section first when a decision
changes.
