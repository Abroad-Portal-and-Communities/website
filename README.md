# APC Websites

Static site built with [Hugo](https://gohugo.io/) and the [Hextra](https://github.com/imfing/hextra) theme.

## Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) (extended)
- [Go](https://go.dev/doc/install)
- [Git](https://git-scm.com/)

## Local development

```shell
hugo mod tidy
hugo server --disableFastRender -p 1313
```

Open [http://localhost:1313/](http://localhost:1313/)

## Build

```shell
hugo mod tidy
hugo --gc --minify
```

Output is written to `public/`.

## Update theme

```shell
hugo mod get -u github.com/imfing/hextra
hugo mod tidy
```

## Deploy (GitHub Pages)

Production and PR previews both publish to the **`gh-pages`** branch.

| Workflow | Trigger | Result |
|----------|---------|--------|
| [lint.yaml](.github/workflows/lint.yaml) | Pull request, push to `main` | Hugo build and Markdown lint |
| [conventional-pr.yaml](.github/workflows/conventional-pr.yaml) | Pull request | Validates Conventional Commits PR title |
| [pages.yaml](.github/workflows/pages.yaml) | Push to `main` | Production site |
| [preview.yaml](.github/workflows/preview.yaml) | Pull request | Preview URL posted as a PR comment |

### One-time setup

1. Push to GitHub and merge into **`main`** (not `master`).
2. **Settings → Pages**
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`
3. **Settings → Actions → General → Workflow permissions**
   - Select **Read and write permissions**
4. Wait for the first **Deploy to GitHub Pages** workflow on `main` to finish.

### URLs

| Environment | URL |
|-------------|-----|
| Production | [abroad-portal-and-communities.github.io/websites/](https://abroad-portal-and-communities.github.io/websites/) |
| PR preview | `.../websites/pr-preview/pr-<number>/` |

Each pull request gets a sticky comment with the preview link (and QR code). Previews are removed when the PR is closed.

### PR titles (Conventional Commits)

PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add events page`
- `fix: broken homepage link`
- `docs: update README`

The **Conventional PR** workflow fails if the title does not match. See [.github/pull_request_template.md](.github/pull_request_template.md).

### Custom domain (optional)

Add your domain under **Settings → Pages → Custom domain**, then add a `CNAME` file in `static/` if needed.
