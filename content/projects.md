---
title: "Projects"
description: "Selected engineering work and the lessons behind it."
date: 2026-08-10
showToc: true
image: "/og-stack.png"
---

These projects are presented as engineering case studies: the problem, the system boundary, and the lessons that can be reused elsewhere.

## Infrastructure Delivery Pipeline

An exploration of repeatable infrastructure provisioning and automated software delivery.

**Focus:** Infrastructure as Code, delivery pipelines, environment consistency, and operational feedback.

The important question is not simply whether a pipeline runs. It is whether the same process can safely promote a change across environments, expose failures early, and reduce configuration drift. A full write-up will cover the architecture, controls, and trade-offs without exposing private implementation details.

## LinkedIn Analysis

A Master of Information Technology capstone project focused on collecting LinkedIn data, processing it for analysis, and presenting the results through a web application.

**Stack:** Python, Selenium, BeautifulSoup, Node.js, JavaScript, and data visualization.

My contribution covered data collection, cleaning, extraction, and project reporting. The project is useful as an early example of connecting a data pipeline to a user-facing analytical product.

[View the public repository →](https://github.com/1kyte/Linkedin-Analysis)

## Personal Technical Blog

This site is itself a small delivery system: Hugo builds the content, Stack provides the card-based reading experience, and GitHub Actions publishes a versioned static artifact to GitHub Pages.

**Focus:** content architecture, automated builds, maintainable theming, search, RSS, SEO, and low-operational-cost hosting.

The repository is being consolidated so the source, build workflow, and public site have one clear ownership model.
