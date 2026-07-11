#!/usr/bin/env bash
set -euo pipefail

echo "Forging repository structure..."

mkdir -p ideas specs archive templates/idea templates/spec

for dir in ideas specs archive templates/idea templates/spec; do
  if [ ! -f "$dir/.gitkeep" ]; then
    touch "$dir/.gitkeep"
  fi
done

if [ ! -f templates/idea/concept.md ]; then
  cat > templates/idea/concept.md <<'EOF'
# Concept

**Project:**
**Date:**
**Status:** seedling

## In plain language

Describe the idea here in the simplest terms you can.

## The one-liner

A single sentence that captures the essence of the idea.
EOF
fi

if [ ! -f templates/idea/application.md ]; then
  cat > templates/idea/application.md <<'EOF'
# Application

**Project:**

## What is it actually for?
## Who is it for?
## Where would it live?
## Why does it matter?
EOF
fi

if [ ! -f templates/idea/questions.md ]; then
  cat > templates/idea/questions.md <<'EOF'
# Open questions

**Project:**

- 
- 

## Doubts
EOF
fi

if [ ! -f templates/spec/spec.md ]; then
  cat > templates/spec/spec.md <<'EOF'
---
title: ""
date: ""
status: draft
source_idea: ""
---

# 

## Problem
## Users
## Goals
## Non-goals
## Approach
## Open questions
## Milestones
EOF
fi

echo "Done. Created: ideas/ specs/ archive/ templates/idea/ templates/spec/"
echo "Templates ready under templates/."
