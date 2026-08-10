# Kallen Wang — Engineering Blog

A Hugo-powered engineering blog and technical portfolio focused on backend systems, cloud-native delivery, enterprise integration, and applied AI.

## Local development

```bash
git submodule update --init --recursive
hugo server -D
```

The site is built with Hugo and Stack. Pushes to `master` are deployed to GitHub Pages through GitHub Actions.

## Content structure

- `content/posts/` — long-form engineering articles
- `content/about.md` — professional profile and writing principles
- `content/projects.md` — selected project case studies
- `archetypes/default.md` — reusable engineering article template
- `assets/scss/` — site-specific visual styling
