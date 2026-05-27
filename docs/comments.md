# Comments (Giscus)

Doc pages can embed **[Giscus](https://giscus.app)** comments backed by [GitHub Discussions](https://github.com/Abroad-Portal-and-Communities/website/discussions).

## Requirements

1. **GitHub Discussions** enabled on the `website` repo (Settings → General).
2. **[Giscus GitHub App](https://github.com/apps/giscus)** installed on the repo.
3. Site config in `config/_default/hugo.yaml` under `params.comments.giscus` (repo + IDs from [giscus.app](https://giscus.app)).

## Enable on a page

Add to front matter:

```yaml
comments: true
```

Site default is `comments.enable: false`, so only pages with `comments: true` show the widget.

## Thread mapping

`mapping: pathname` — one discussion per page URL (e.g. Germany EN and Germany ID are separate threads).

## Moderation

Comments appear as Discussions in the **General** category. Manage them under the repo **Discussions** tab.
