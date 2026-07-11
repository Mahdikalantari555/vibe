---
title: "Lone Ant — a single-ant colony survival game"
date: 2026-07-11
status: draft
source_idea: ideas/lone-ant/
---

# Lone Ant

## Problem

People who like tinkering with games rarely finish one. The gap between "cool
idea" and "playable thing on my phone" is full of tooling friction: emulators,
app stores, build cycles measured in minutes per try. At the same time, the
kind of cozy, living-world game that SimAnt fans remember doesn't really exist
on the phone in a small, finishable form. The human problem is two-sided: we
want a tiny world we can live in for a few minutes at a time, and we want to
actually ship it instead of drowning in setup.

## Users

Hobby game tinkerers — people who enjoy poking at games and game-making more
than they enjoy being a passive "user." They care about:

- A world that feels alive and continues without them.
- Something they can actually finish and show a friend, not a half-built dream.
- A short, low-pressure loop they can return to across days.

They are fine with simple graphics and simple sound; what they want is the
*feeling* of being one small ant in a bigger living thing.

## Goals

- A playable game where you control one ant and spend your time foraging and
  carrying food back to the nest.
- A colony that visibly grows and stores food because of what ants (you and the
  automatic workers) do.
- Progress that saves on the device, so closing the game and reopening later
  resumes exactly where you left off (colony size, stored food, unlocks).
- Runs in a web browser with no install, and can later be wrapped as an Android
  app (APK) for the home screen.
- Built with AI agents doing most of the implementation, from a phone, with a
  fast test loop.

## Non-goals

For Version 1 (explicitly out of scope):

- Multiplayer, accounts, or any server.
- Real-time simulation while the game is closed (the world is *saved*, not
  *running*, while you're away).
- Rival colonies, genetics, seasons, larvae, queens, procedural worlds, or
  multiple insect species.
- Polished art or music; simple shapes and simple sound are fine.
- A native-only build path that needs Android Studio up front.

These belong to later versions if the core proves fun.

## Approach

The shape of the solution, in plain terms:

- **One controllable ant.** You steer it (tap/drag or on-screen controls on the
  phone). Its job is to walk the world, find food, pick it up, and carry it
  back to the nest entrance.
- **Automatic worker ants.** The colony has other ants you don't control. They
  follow pheromone trails and gather on their own, so the world feels busy and
  alive even when you're just watching.
- **Pheromone trails.** Ants leave scent paths between food and the nest. Your
  trails and the workers' trails guide movement and make "where do I go" feel
  organic rather than menu-driven.
- **A small nest with storage.** Food you and the workers deliver fills a
  colony stock. That stock is what "growth" means in Version 1: more stored
  food lets the colony support more workers and a bigger visible nest.
- **Spiders as the threat.** A spider (or two) roams and can hurt ants. The
  tension is real but simple: don't get caught, and don't lead danger home.
- **Day/night as atmosphere.** A visual cycle that changes light and mood. In
  Version 1 it is mostly flavor, not a hard mechanic.
- **Save = your progress.** On close, we store colony size, stored food,
  unlocks, and the world layout on the device. Reopen and it's exactly as you
  left it. The world does not simulate while closed.
- **Web first, phone later.** Build as a browser game (Phaser + TypeScript).
  It opens from a link, so it's testable on a phone instantly with no app
  store. Later, wrap the same game as an installable Android APK with Capacitor
  for people who want it on their home screen. This keeps the build-and-test
  loop fast, which is what lets a phone-only, agent-built project actually
  finish.

The human stays the game designer (the fun loop, the balance, the "why come
back"); the AI agents are the implementation team.

## Open questions

- Does "forage and carry" stay fun for more than a few sessions, or do we need
  one extra job (defend, steer workers, choose dig spots) sooner than Version 2?
- What is the concrete reward for storing food — more workers, a bigger nest,
  or something the player ant can do that it couldn't before?
- How often should a spider appear so it's a real threat without being
  constant stress?
- Confirm the tooling: web-first via Phaser, APK via Capacitor. Acceptable?
- Does the colony save cleanly as a plain web page using on-device storage, or
  does offline persistence need the app wrapper?

## Milestones

Rough stepping stones, smallest useful thing first:

1. **Walking ant.** One ant moves on a small map with simple controls.
2. **Food + carry.** Pick up a food item, carry it to the nest, watch storage
   go up.
3. **Worker ants + pheromones.** Automatic ants follow trails and gather, so
   the world feels alive.
4. **Small nest + storage.** Stored food visibly grows the colony.
5. **Spiders.** One roaming enemy that can catch ants; basic avoidance.
6. **Save/load.** Progress persists on the device between sessions.
7. **Web deploy.** Hosted so it opens from a link and plays on a phone.
8. **Polish.** Day/night look, simple sound, basic balance pass.
9. **Android APK (optional).** Wrap with Capacitor for home-screen install.

Version 2 (later, not now): larvae, queen, colony expansion, seasons, more
insect species. Version 3: rival colonies, procedural world, deeper ecosystem.
