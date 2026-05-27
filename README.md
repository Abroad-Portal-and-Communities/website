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

Uses GitHub’s official [Pages Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow) (`configure-pages`, `upload-pages-artifact`, `deploy-pages`).

| Workflow | Trigger | Result |
|----------|---------|--------|
| [lint.yaml](.github/workflows/lint.yaml) | Pull request, push to `main` | Hugo build and Markdown lint (skips jobs when unrelated files change) |
| [conventional-pr.yaml](.github/workflows/conventional-pr.yaml) | Pull request | Validates Conventional Commits PR title |
| [pages.yaml](.github/workflows/pages.yaml) | Push to `main`, pull request | Production deploy on `main`; PRs run build only (validates Hugo) |

### One-time setup

1. Push to GitHub and merge into **`main`**.
2. **Settings → Pages**
   - **Source:** **GitHub Actions** (not “Deploy from a branch”)
3. Wait for the first **Deploy to GitHub Pages** workflow on `main` to finish.

### URLs

| Environment | URL |
|-------------|-----|
| Production | [abroad-portal-and-communities.github.io/website/](https://abroad-portal-and-communities.github.io/website/) |
| PR preview | Not deployed by default (see note below) |

`configure-pages` sets Hugo’s `baseURL` automatically on deploy.

**PR deploys:** The `github-pages` environment is limited to `main` and `gh-pages`. Pull requests only run the **build** job so CI passes. To enable PR preview deploys, set **Settings → Environments → github-pages → Deployment branches** to **All branches**.

### PR titles (Conventional Commits)

PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add events page`
- `fix: broken homepage link`
- `docs: update README`

The **Conventional PR** workflow fails if the title does not match. See [.github/pull_request_template.md](.github/pull_request_template.md).

### Custom domain (optional)

Add your domain under **Settings → Pages → Custom domain**, then add a `CNAME` file in `static/` if needed.
