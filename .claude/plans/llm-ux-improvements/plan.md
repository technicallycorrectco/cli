# Plan: LLM UX Improvements

Improvements to the `tc` CLI ordered by impact on LLM usability.
Identified by Claude during active use of the tool.

---

## Phase 1 — Unified settings file + default project

### - [x] [P1-T1] Migrate config to `~/.technicallycorrect/settings.json` with a `cli` key — updated config/index.ts, bootstrapped settings.json on disk

### - [x] [P1-T2] Support local settings file for project default — findLocalSettingsPath walks CWD upward; resolveProject helper used across all commands

### - [x] [P1-T3] Write local settings file from `tc init` — saveLocalConfig called on tc init <slug>

---

## Phase 2 — Consistent empty-state output

### - [x] [P2-T1] Return `{"data": []}` for empty list responses — printList normalizes null/missing data; also fixed BadMapError in server tasks controller

---

## Phase 3 — Requirement tree view

### - [x] [P3-T1] Add `--tree` flag to `tc r list` — client-side buildTree using identifier depth; --root filters to subtree

---

## Phase 4 — Richer `tc r show` with inline children

### - [x] [P4-T1] Add `--include-children` flag to `tc r show` — parallel fetch of child_urls, inlined under children key

---

## Phase 5 — Named flags for `tc i add` and `tc r edit`

### - [x] [P5-T1] Replace JSON argument with named flags on `tc i add` — --repo, --commit, --message, --description; JSON form dropped (sole user)

### - [x] [P5-T2] Add `--parent`, `--design` flags to `tc r edit` — text optional; at least one of text/--parent/--design required; tc d set removed

---

## Phase 6 — `tc t show` without a project requirement

### - [x] [P6-T1] Make `--project` optional on `tc t show` — resolveProject falls back to local settings set by tc init; no separate endpoint needed
