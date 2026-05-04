---
name: issue-workflow
description: Work on a repository issue from branch creation through commit and PR creation. Use when taking an issue into work, preparing an issue-scoped branch, implementing an issue fix, or publishing an issue PR.
---

# Issue Workflow

Use this skill when work is tied to a GitHub issue or another tracked issue id.
Branch creation is automatic only for issue-tracked work.
For non-issue tasks, stay on the current branch unless the user explicitly asks to create a branch.

## Required Inputs

- Issue id, for example `20`.
- Short issue title or task summary for the branch slug.

Stop and ask for the missing value if the issue id is not known. Do not create an issue branch without an issue id.

## Branch Contract

Create every issue branch from `develop`, not from the current feature branch.

Branch name format:

```text
feat/<id>-<slug>
```

Slug rules:

- Build the slug from the issue title or task summary.
- Use lowercase ASCII words separated by `-`.
- Keep it short, usually 3-6 meaningful words.
- Remove punctuation and filler words.

Example:

```bash
git switch develop
git pull --ff-only
git switch -c feat/20-fix-registry-picker
```

Before creating the branch:

1. Run `git status --short --branch`.
2. Ensure the working tree is clean or explicitly account for existing user changes.
3. Switch to `develop`.
4. Run `git pull --ff-only` on `develop`; if it fails, stop and report the divergence.
5. Create the issue branch with the required issue id and slug.

## Workflow

1. Requirements analysis: summarize requirements, assumptions, and risks.
2. Planning: list implementation steps and verification steps.
3. Implementation: make the smallest scoped change that resolves the issue and report changed file references.
4. Testing: run the narrowest relevant checks first, then report commands and results, or explain why tests were not run.
5. Review: inspect the diff for correctness, regressions, unnecessary scope, and missing tests; report findings or explicit `no findings`.

## Scope Rules

- Keep diffs minimal.
- Do not refactor unrelated code.
- Do not run broad formatting or lint cleanup unless the issue explicitly requires it.
- If work expands beyond the issue scope, stop and restate the boundary before continuing.

## Commit

Commit at the end with a Conventional Commit message.

Preferred format:

```text
fix: <short issue outcome>
```

Use `feat:`, `fix:`, `docs:`, `test:`, or `chore:` according to the actual change.

## Pull Request

Create a pull request at the end of the task.

PR title format:

```text
<issue-id> / <slug>
```

The PR title must start with the issue id, a slash separator, and the same slug used in the branch name.

Write the PR description in Russian. Include the issue closing line:

```text
Close: #<issue-id>
```
