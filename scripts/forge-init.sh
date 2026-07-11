#!/usr/bin/env bash
set -euo pipefail

echo "Forging repository structure..."

mkdir -p ideas specs archive templates

for dir in ideas specs archive; do
  if [ ! -f "$dir/.gitkeep" ]; then
    touch "$dir/.gitkeep"
  fi
done

if [ ! -f templates/idea.md ]; then
  cat > templates/idea.md <<'EOF'
---
title: ""
date: ""
status: seedling
tags: []
---

# 

Write the raw thought here. No pressure, no polish.
EOF
fi

if [ ! -f templates/spec.md ]; then
  cat > templates/spec.md <<'EOF'
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

echo "Done. Created: ideas/ specs/ archive/ templates/"
echo "Templates ready: templates/idea.md, templates/spec.md"
