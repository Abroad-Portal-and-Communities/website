# APC Website — agent guide

Hugo (extended) + Hextra static site for Abroad Portal and Communities. Production: [abroad-portal-and-communities.github.io/website/](https://abroad-portal-and-communities.github.io/website/).

## Repository map

| Path | Purpose |
| --- | --- |
| `content/` | Pages (docs, events intro, survey, about, home) |
| `data/events.yaml` | Sharing sessions (upcoming + past); drives `/events/` |
| `data/survey.yaml` | Community survey options |
| `layouts/` | Hugo overrides (events, related sessions, footer, social links, shortcode URL fixes) |
| `static/` | Favicon and web manifest assets |
| `config/_default/hugo.yaml` | Site config, menu, `params.social`, Supabase param placeholders |
| `config/_default/languages.yaml` | English + Indonesian (`id`) multilingual config |
| `i18n/en.yaml`, `i18n/id.yaml` | UI strings and menu labels |
| `config/development/hugo.yaml` | Local Supabase keys (**gitignored**) |
| `docs/` | Maintainer guides (not published in site nav) |
| `docs/event-registration.md` | Event registration (Luma recommended; Google Forms appendix) |
| `skills/apc-site-content/SKILL.md` | Detailed content/event authoring (incl. shortcode link rules) |
| `scripts/lint-markdown.sh` | Markdownlint via Docker (matches CI) |
| `supabase/` | SQL schema and migrations |

## Workflows

1. **Branch** from `main`, make focused changes.
2. **Verify** Hugo build: `hugo mod tidy && hugo --minify`
3. **Lint Markdown** (same as CI): `./scripts/lint-markdown.sh` (uses Docker + npx)

4. **Open PR** with [Conventional Commits](https://www.conventionalcommits.org/) title (lowercase subject), e.g. `feat: add backend sharing session`

Do **not** commit: `config/development/hugo.yaml`, `hugo.local.yaml`, `.env`, `public/`, `_vendor/`.

## Multilingual (English + Indonesian)

- Languages: `config/_default/languages.yaml` (`en` default, `id` Bahasa Indonesia).
- Page translations: sibling files `page.id.md` next to `page.md` (Hextra/Hugo filename pattern).
- UI strings: `i18n/id.yaml` (menu uses `identifier` in `hugo.yaml` → translated via i18n).
- Data: `data/events.id.yaml`, `data/survey.id.yaml` for Indonesian event/survey copy.

## Content tasks

Use the project skill **apc-site-content** ([skills/apc-site-content/SKILL.md](skills/apc-site-content/SKILL.md)) when adding:

- Sharing sessions → `data/events.yaml`
- Doc pages → `content/docs/...`
- Events page copy → `content/events/_index.md`

## Events and tags

- **Upcoming:** `register` URL (Luma or Google Form) in `data/events.yaml` and `data/events.id.yaml` — see `docs/event-registration.md`.
- **Past:** `youtube` recording URL.
- **Tags** link events to career/working-abroad pages (e.g. `devops`, `eu`, `working-abroad`). Match slugs from URL paths or survey job IDs in `data/survey.yaml`.

## Social links

Configured in `config/_default/hugo.yaml` under `params.social`. Rendered in the footer via `layouts/partials/social-links.html` and listed on About pages.

## GitHub Pages URLs

Site is served under `/website/`. Internal shortcode links (`card`, `hero-button`, `feature-card`) must use root-relative paths (`/docs/...`, `/events`) — see `skills/apc-site-content/SKILL.md`. Layout overrides in `layouts/_partials/shortcodes/card.html` and `layouts/_shortcodes/hextra/` apply `relURL` for the subpath.

## Security

- Never put Supabase **service role** or **Secret** keys in the repo or Hugo config committed to git.
- Production uses GitHub secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Publishable key only).

## CI

- `lint.yaml` — Hugo build + markdownlint on `content/**` and `README.md`
- `conventional-pr.yaml` — PR title format
- `pages.yaml` — deploy to GitHub Pages on `main` only
