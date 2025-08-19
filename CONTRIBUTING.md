# Contributing to WimBelemDon+ Backend

Thank you for contributing!
This document defines our guidelines for branch naming, commit messages, pull requests, secrets management, and language conventions.

## Table of Contents

- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Requests](#pull-requests)
- [Secrets and Configuration](#secrets-and-configuration)
- [Language](#language)
- [Thank You](#thank-you)

---

## Branch Naming Conventions

We use **kebab-case** for branch names. Branches must be prefixed according to the type of work:

| Type     | Prefix       | Example                         |
|----------|--------------|---------------------------------|
| Feature  | `feature/`   | `feature/add-student-controller`|
| Bugfix   | `fix/`       | `fix/fix-login-error`           |
| Chore    | `chore/`     | `chore/update-dependencies`     |
| Test     | `test/`      | `test/add-login-tests`          |
| Docs     | `docs/`      | `docs/update-readme`            |
| CI       | `ci/`        | `ci/setup-ci-pipeline`          |
| Perf     | `perf/`      | `perf/improve-load-time`        |
| Refactor | `refactor/`  | `refactor/cleanup-code`         |
| Build    | `build/`     | `build/update-packages`         |

> **Important:** Do not use spaces or special characters in branch names.

---

## Commit Message Guidelines

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject> (#<task-id>)
```

- **type**: one of `feat`, `fix`, `chore`, `test`, `docs`, `ci`, `perf`, `refactor`, `build`
- **scope**: optional (e.g., module, feature, or package)
- **subject**: short description in lowercase, written in the imperative, without a final period

### Examples

```
feat(auth): add login via Google OAuth
fix(ui): correct button alignment on homepage
chore(deps): upgrade react to 19.0.1
test(auth): add unit tests for login
docs(readme): update setup instructions
ci(pipeline): add linting step
perf(api): cache responses to reduce load times
refactor(ui): simplify conditional rendering
build(webpack): update configuration for production
```

When applicable, include the **task ID** at the end of the commit message:

```
feat(auth): add login via Google OAuth (#123)
```

---

## Pull Requests

- Always open pull requests against the **`develop`** branch.
- Make sure your branch is up to date with `develop` before creating a PR.
- Monitor the CI/CD pipeline and fix issues if they arise.
- Resolve merge conflicts locally and update your branch before re-opening the PR.
- Assign yourself to your PR.
- Request at least **one reviewer** from the team.
- Provide a clear and concise description, following the PR template.

---

## Secrets and Configuration

- Never commit sensitive information such as API keys, credentials, or private tokens.
- Use **environment variables** or dedicated configuration files to manage secrets.
- Double-check your code for accidentally exposed secrets before committing.
- Document all required environment variables in the appropriate configuration file.

---

## Language

All **code, comments, commit messages, documentation, and PR descriptions** must be written in **English** or **Portuguese**.

---