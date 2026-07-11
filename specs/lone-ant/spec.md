---
title: "Lone Ant — Product Specification"
date: 2026-07-11
status: in-review
source_idea: ideas/lone-ant/
---

# Lone Ant — Product Specification

This is the product/overview contract. It states the *what* and *why*. Each
behavioral area is broken into its own feature spec under
[features/](features/) with binary, testable acceptance criteria. Code is
built against those feature specs, not against this prose.

## Purpose (why)

A small, finishable web/Android game where you **live as one ant** in a colony
that keeps living and growing around you. The player controls a single ant,
forages and carries food home, and watches automatic worker ants keep the
colony alive. Progress saves on the device so the world resumes exactly where
left off. The point is a cozy, low-pressure "tiny living world" that a
hobbyist can actually ship with AI agents doing most of the build, developed
from a phone with a fast test loop.

## Audience

Hobby game tinkerers — people who enjoy poking at games and game-making more
than being a passive user. They want a world that feels alive, something they
can finish and show a friend, and a short loop they return to across days.
Simple graphics/sound are fine; the feeling of being one small ant in a bigger
living thing is what matters. See [ideas/lone-ant/application.md](../../ideas/lone-ant/application.md).

## Goals

- G1: Controllable single ant whose main activity is foraging and carrying food home.
- G2: A colony that visibly grows and stores food because of what ants (player + workers) do.
- G3: Progress saved on the device; closing and reopening resumes exactly where left off.
- G4: Runs in a web browser with no install; later wrappable as an Android APK.
- G5: Buildable mostly by AI agents, from a phone, with a fast build-and-test loop.

## Non-goals (Version 1)

- Multiplayer, accounts, or any server.
- Real-time simulation while the game is closed (the world is *saved*, not *running*).
- Rival colonies, genetics, seasons, larvae, queens, procedural worlds, multiple insect species.
- Polished art or music; simple shapes and simple sound are acceptable.
- A native-only build path requiring Android Studio up front.

## Core loop

The player's normal session is **forage & carry**: steer the ant → find food →
pick it up → carry it back along (or laying) a pheromone trail → drop it in the
nest → storage increases → repeat. Worker ants do the same in the background.
Persistence is **save-my-progress**: on return, colony size, stored food, and
unlocks are as left; the world does not advance on its own.

## Platform & tech approach

- **Stack:** Browser game, Phaser 3 + TypeScript. (Exact versions pinned when implementation starts — see [features/web-deploy.md](features/web-deploy.md).)
- **Deploy:** Web first (hosted, opens from a link, playable on a phone). Later wrapped as an Android APK with Capacitor.
- **Tooling:** Kilo Code edits the project; push to GitHub; GitHub Pages updates; open URL on phone to test; repeat.
- **Offline:** No server, no account. Save state lives on the device.

## Constraints (three-tier)

- ✅ Always: keep the player controllable as exactly one ant; keep all food/storage logic in shared colony state; save before the page unloads.
- ⚠️ Ask first: changing the core fun loop (e.g. adding defense/steering jobs before Version 2); adding a new dependency; changing the save schema.
- 🚫 Never: require a network connection or account to play or save; simulate the world while the game is closed; add features listed in Non-goals; delete or weaken tests to make them pass.

## Assumptions (risk-tagged)

- A1 (Medium): "Forage & carry" stays fun past a few sessions without an extra job. *If false, add one job in V1.*
- A2 (Medium): Stored food as the sole growth signal is enough reward. *If false, add a player-ant unlock.*
- A3 (Low): On-device web storage (localStorage/IndexedDB) is sufficient and persists between sessions on the target phones.
- A4 (Low): Phaser can render hundreds of ants at acceptable frame rate on mid-range Android. *If false, cap worker count / use spatial culling.*

## Acceptance criteria (Version 1, whole-product)

These are the binary, checkable conditions for "V1 is done." Each maps to a
feature spec.

- AC-1: Given the game loads, When the player steers, Then exactly one ant responds and moves on the 2D map (controllable-ant).
- AC-2: Given the player ant touches a food item, When the pickup input fires, Then the ant carries it and storage increases on drop at the nest (foraging).
- AC-3: Given the game runs, When workers exist, Then they follow pheromone trails and deliver food to storage without player input (worker-ants-and-pheromones).
- AC-4: Given storage crosses a threshold, When the colony updates, Then worker count and/or nest size increases and is visible (nest-and-storage).
- AC-5: Given a spider is present, When it contacts an ant, Then the ant is removed/returned and (if carrying) drops food (spiders).
- AC-6: Given the player closes the game, When it reopens, Then colony size, stored food, and unlocks match the pre-close state exactly (save-and-load).
- AC-7: Given the deployed URL, When opened on a phone browser, Then the game is playable with no install (web-deploy).

## Edge cases (cross-cutting)

- E1: Player ant dies/caught → respawns at nest; control is never lost.
- E2: No food on map → workers idle, no crash, storage unchanged.
- E3: Storage at zero → no negative values, no divide-by-zero in growth math.
- E4: Save corrupted or absent → start a fresh colony, do not crash.
- E5: Page closed mid-carry → on reopen, food is at nest or back in world, never duplicated.

## Open questions (unresolved — human decides)

- OQ-1 (highest risk): **The fun loop itself.** Coding is solvable; game design is not. Does forage-and-carry stay engaging, and what is the "why come back tomorrow"? This must be validated by playtesting, not assumed.
- OQ-2: Concrete reward for storing food (more workers / bigger nest / new player ability)?
- OQ-3: Spider frequency for tension without constant stress?
- OQ-4: Confirm web-first (Phaser) + Capacitor APK tooling.
- OQ-5: Does on-device web storage meet offline-persistence needs, or is the app wrapper required?

## Feature specs

- [features/controllable-ant.md](features/controllable-ant.md)
- [features/foraging.md](features/foraging.md)
- [features/worker-ants-and-pheromones.md](features/worker-ants-and-pheromones.md)
- [features/nest-and-storage.md](features/nest-and-storage.md)
- [features/spiders.md](features/spiders.md)
- [features/save-and-load.md](features/save-and-load.md)
- [features/web-deploy.md](features/web-deploy.md)

## Source map

Grew from:

- [ideas/lone-ant/concept.md](../../ideas/lone-ant/concept.md)
- [ideas/lone-ant/application.md](../../ideas/lone-ant/application.md)
- [ideas/lone-ant/questions.md](../../ideas/lone-ant/questions.md)

When implementation begins, link the key source files here (ant controller, pheromone system, storage, save/load, spider AI, deploy config).

## Related docs

- Source idea: [ideas/lone-ant/](../../ideas/lone-ant/)
- Forge workflow: `README.md`, and the `/new-idea`, `/new-spec`, `/archive` commands.

## Status & approval

Status: **in-review**. Do not start implementation until the human has approved
this overview and the linked feature specs, especially OQ-1 (the fun loop).
When a decision changes, update the relevant section *first*, then implement.
