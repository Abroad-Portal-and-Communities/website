---
name: apc-site-content
description: >-
  Add or update APC website sharing sessions (data/events.yaml), Hugo doc pages
  under content/docs, and related content. Use when adding events, posts, docs
  pages, or editing site copy for the APC Hugo site.
---

# APC site content

## Before editing

1. Read `data/events.yaml` and existing pages in the target section.
2. Run `hugo mod tidy && hugo --minify` after substantive changes.
3. Lint markdown: `./scripts/lint-markdown.sh` (Docker + npx; same as CI).
4. Open a PR; do not push secrets or edit gitignored config.

## Add a sharing session (event)

Edit **`data/events.yaml`** only (not a separate content file per event).

### Upcoming session

Add under `upcoming:`:

```yaml
  - title: "Sharing Session: <Topic>"
    date: 2026-09-15          # YYYY-MM-DD
    description: "One or two sentences for the events page."
    register: "https://..."   # Sign-up URL (required for upcoming)
    tags:
      - <slug>                 # e.g. devops, backend, working-abroad, eu
```

### Past session (recording)

Add under `past:`:

```yaml
  - title: "Sharing Session: <Topic>"
    date: 2026-03-01
    description: "Short summary."
    youtube: "https://www.youtube.com/watch?v=..."
    tags:
      - <slug>
```

### Tag rules

Tags connect events to docs pages and enable `/events/?tag=<slug>` filtering.

| Tag examples | Matches |
| --- | --- |
| `devops` | `/docs/career-plan/developer/devops/` |
| `backend` | `/docs/career-plan/developer/backend/` |
| `working-abroad` | Working abroad section |
| `eu`, `us`, `asia` | Regional guides under `content/docs/working-abroad/` |

Use the **page slug** (last path segment), not display titles. Avoid broad tags like `developer` unless the session applies to all developer roles.

### After adding an event

- Confirm register vs YouTube: upcoming → `register` only; past → `youtube` only.
- Replace placeholder `forms.gle/REPLACE_...` URLs with real registration links.

## Indonesian translations

When adding or updating English pages, add or update the Indonesian sibling **`*.id.md`** in the same folder (e.g. `content/docs/foo/_index.id.md` next to `_index.md`). Mirror front matter (`title`, `weight`, `prev`/`next`) and translate body copy. Add menu/UI strings to **`i18n/id.yaml`** if needed. For events or survey labels, edit **`data/events.id.yaml`** or **`data/survey.id.yaml`**.

## Add a doc page (guide / “post”)

Create or edit Markdown under **`content/docs/`** with front matter:

```yaml
---
title: Page Title
type: docs
weight: 3              # Sidebar order (lower = higher)
prev: docs/path/to/prev
next: docs/path/to/next
---
```

### Section layout

- Career role: `content/docs/career-plan/<track>/<role>/_index.md`
- Working abroad region: `content/docs/working-abroad/<region>/_index.md`
- New top-level section: add `_index.md` + entry in parent `_index.md` table if applicable

### Markdown rules

- Tables use spaced pipes: `| Col | Col |` and `| --- | --- |` separator rows.
- One blank line at end of file (MD012).
- Shortcodes allowed (Hextra); MD033/MD041 disabled in `.markdownlint.yaml`.

Related sharing sessions appear automatically on career/working-abroad pages when event tags match (no extra front matter required). Override with:

```yaml
eventTags:
  - custom-tag
```

## Edit Events page intro

`content/events/_index.md` — short intro only; session list comes from `data/events.yaml` via `layouts/events/list.html`.

## Do not

- Add `content/docs/survey-database/` or `content/docs/power-bi-survey/` to the public docs nav (maintainer docs live in `docs/*.md` only).
- Commit `config/development/hugo.yaml`, `hugo.local.yaml`, or Supabase secret keys.
- Push directly to `main` unless the user explicitly requests it.

## PR title

Conventional Commits, lowercase subject: `feat: add september devops sharing session`
