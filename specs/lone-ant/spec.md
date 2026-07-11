---
title: "Lone Ant — a single-ant colony survival game"
date: 2026-07-11
status: draft
source_idea: ideas/lone-ant/
---

# Lone Ant

## Purpose

A small, finishable Android/web game where you **live as one ant** in a colony
that keeps living and growing around you. The player controls a single ant,
forages and carries food back to the nest, and watches automatic worker ants
keep the colony alive. Progress saves on the device so the world resumes
exactly where you left it. The goal is a cozy, low-pressure "tiny living world"
that a hobbyist can actually ship with AI agents building most of it, developed
from a phone with a fast test loop.

## Questions this spec answers

- What is the player actually doing moment to moment? (Forage & carry.)
- What systems make the colony feel alive? (Worker ants, pheromones, nest storage.)
- What is the threat and how often does it show up? (Spiders, tuned for tension not stress.)
- How does progress persist between sessions? (Save on close, resume on open.)
- What platform and build path gives the fastest finish? (Web first via Phaser, APK later via Capacitor.)
- What is explicitly out of scope for Version 1? (See [Non-goals](#non-goals).)

## Audience

Hobby game tinkerers — people who enjoy poking at games and game-making more
than being a passive user. They want:

- A world that feels alive and continues without them.
- Something they can actually finish and show a friend, not a half-built dream.
- A short, low-pressure loop they return to across days.

They are fine with simple graphics and simple sound. What they want is the
*feeling* of being one small ant in a bigger living thing. See
[ideas/lone-ant/application.md](../ideas/lone-ant/application.md) for the
full human framing.

## Goals

- Controllable single ant whose main activity is foraging and carrying food home.
- A colony that visibly grows and stores food because of what ants (player + workers) do.
- Progress saved on the device: closing and reopening resumes exactly where left off (colony size, stored food, unlocks).
- Runs in a web browser with no install; can later be wrapped as an Android APK for the home screen.
- Built mostly by AI agents, from a phone, with a fast build-and-test loop.

## Non-goals

Out of scope for Version 1:

- Multiplayer, accounts, or any server.
- Real-time simulation while the game is closed (the world is *saved*, not *running*, while away).
- Rival colonies, genetics, seasons, larvae, queens, procedural worlds, or multiple insect species.
- Polished art or music; simple shapes and simple sound are acceptable.
- A native-only build path requiring Android Studio up front.

These belong to later versions if the core proves fun (see [Milestones](#milestones)).

## Core loop

The player's normal session is **forage & carry**:

1. Steer the ant through the world (tap/drag or on-screen controls on phone).
2. Find a food item and pick it up.
3. Carry it back along (or laying) a pheromone trail to the nest entrance.
4. Drop it into storage; the colony stock increases.
5. Repeat. Worker ants do the same in the background, so the world feels busy.

Persistence is **save-my-progress**, not a living simulation while away: when
you return, the colony size, stored food, and unlocks are as you left them.
The world does not advance on its own in the meantime.

## Systems

### Controllable ant

- One ant the player steers. Its responsibilities: move, pick up food, carry food, drop food at nest.
- Movement is top-down on a 2D map. Controls must work on a touchscreen phone.

### Worker ants

- Automatic ants the player does not control.
- They follow pheromone trails and gather food on their own, giving the world a sense of life even when the player only watches.
- Their gathering contributes to the same colony storage as the player's.

### Pheromone trails

- Ants leave scent paths between food and the nest.
- Trails guide movement so "where do I go" feels organic rather than menu-driven.
- Player trails and worker trails both persist on the map during a session.

### Nest and storage

- Food delivered by the player and workers fills a colony stock.
- In Version 1, "growth" means: more stored food lets the colony support more workers and a bigger visible nest.
- Storage is the concrete feedback that the player's actions matter.

### Spiders (threat)

- One or two spiders roam and can catch ants.
- Tension is real but simple: avoid being caught, and avoid leading danger home.
- Frequency is a balance question (see [Open questions](#open-questions)).

### Day/night cycle

- A visual cycle that changes light and mood.
- In Version 1 it is mostly atmosphere, not a hard mechanic.

### Save and load

- On close: store colony size, stored food, unlocks, and world layout on the device.
- On open: restore exactly that state. No server, no account.
- The world is paused, not simulated, while the game is closed.

## How the game works (flows)

### Foraging flow

- Trigger: player steers ant onto a food item.
- Steps: pick up → follow/leave trail → reach nest → drop into storage.
- State change: colony storage increases; pheromone trail strengthens.
- Success: food counted in storage. Failure: ant caught by spider (drops food, returns to nest).

### Colony growth flow

- Trigger: storage crosses a threshold.
- Steps: colony supports additional worker(s) and/or nest size increases.
- State change: more workers gather automatically; nest visually larger.
- This is the main long-term reward in Version 1.

### Session resume flow

- Trigger: player opens the game.
- Steps: load saved state from device storage → rebuild world from saved layout → place player ant at nest.
- Invariant: reopened state must match saved state exactly (no silent drift).

## Platform and deployment approach

- **Web first.** Build as a browser game (Phaser + TypeScript). Opens from a link, so it is testable on a phone instantly with no app store.
- **Phone later.** Wrap the same web game as an installable Android APK with Capacitor for home-screen install.
- This keeps the build-and-test loop fast, which is what lets a phone-only, agent-built project finish.
- The human owns game design (fun loop, balance, "why come back"); AI agents are the implementation team.

## Invariants and assumptions

- The player always controls exactly one ant.
- Stored food never decreases except by defined rules (no silent loss).
- Saved state on reopen must equal saved state on close.
- The world does not simulate while closed.
- No network, accounts, or servers are required to play or save.
- Worker ants share the same colony storage as the player.

## Open questions

- Does "forage and carry" stay fun past a few sessions, or is one extra job (defend, steer workers, choose dig spots) needed sooner than Version 2?
- What is the concrete reward for storing food — more workers, a bigger nest, or a new ability for the player ant?
- How often should a spider appear to be a real threat without constant stress?
- Confirm tooling: web-first via Phaser, APK via Capacitor.
- Does the colony save cleanly as a plain web page using on-device storage, or does offline persistence need the app wrapper?

## Milestones

Smallest useful thing first:

1. **Walking ant** — one ant moves on a small map with simple controls.
2. **Food + carry** — pick up food, carry to nest, watch storage increase.
3. **Worker ants + pheromones** — automatic ants follow trails and gather.
4. **Small nest + storage** — stored food visibly grows the colony.
5. **Spiders** — one roaming enemy that can catch ants; basic avoidance.
6. **Save/load** — progress persists on the device between sessions.
7. **Web deploy** — hosted so it opens from a link and plays on a phone.
8. **Polish** — day/night look, simple sound, basic balance pass.
9. **Android APK (optional)** — wrap with Capacitor for home-screen install.

Version 2 (later): larvae, queen, colony expansion, seasons, more insect species.
Version 3: rival colonies, procedural world, deeper ecosystem.

## Source map

This spec grew from the idea folder:

- [ideas/lone-ant/concept.md](../ideas/lone-ant/concept.md) — the plain-language spark.
- [ideas/lone-ant/application.md](../ideas/lone-ant/application.md) — who it's for and where it lives.
- [ideas/lone-ant/questions.md](../ideas/lone-ant/questions.md) — earlier doubts and the web-first tooling note.

When implementation begins, link the most important source files here (e.g. the ant controller, pheromone system, storage, save/load modules).

## Related docs

- Source idea: [ideas/lone-ant/](../ideas/lone-ant/)
- Forge workflow: see `README.md` and the `/new-idea`, `/new-spec`, `/archive` commands.
