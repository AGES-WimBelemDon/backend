<h1 style="text-align: center;">Contributing to WimBelemDon+ Frontend</h1>

Thank you for your contribution! This document outlines our guidelines for branch names, commit messages, pull requests and others.

<h2>Table of Contents</h2>

- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Requests](#pull-requests)
- [Secrets and Configuration](#secrets-and-configuration)
- [Language](#language)
- [Thank You](#thank-you)

## Branch Naming Conventions

We use **kebab-case** for branch names. Prefix branches according to the type of work:

| Type     | Prefix     | Example                     |
|----------|------------|-----------------------------|
| Feature  | `feature/` | `feature/add-login-button`  |
| Bugfix   | `fix/`     | `fix/fix-login-error`       |
| Chore    | `chore/`   | `chore/update-dependencies` |
| Test     | `test/`    | `test/add-login-tests`      |
| Docs     | `docs/`    | `docs/update-readme`        |
| CI       | `ci/`      | `ci/setup-ci-pipeline`      |
| Perf     | `perf/`    | `perf/improve-load-time`    |
| Refactor | `refactor/`| `refactor/cleanup-code`     |
| Build    | `build/`   | `build/update-packages`     |

> No spaces or special characters in branch names.

## Commit Message Guidelines

We follow **Conventional Commits**:

```
<type>(<scope>): <subject> (#<task-id>)
```

- **type**: `feat`, `fix`, `chore`, `test`, `docs`, `ci`, `perf`, `refactor`, `build`
- **scope**: optional, e.g., module or feature
- **subject**: short description, lowercase, no period at the end

**Examples:**

feat(auth): add login via Google OAuth
fix(ui): correct button alignment on homepage
chore(deps): upgrade react to 19.0.1
test(auth): add unit tests for login
docs(readme): update setup instructions
ci(pipeline): add linting step
perf(api): cache responses to reduce load times
refactor(ui): simplified conditional rendering
build(webpack): update configuration for production

Use imperative instead of past tense

If present, add the task id to the end of the commit title
ex: feat(auth): add login via Google OAuth (#123)

## Pull Requests

- Ensure your branch is up-to-date with the `develop` branch before opening a pull request.
- Keep an eye on the CI/CD pipeline for any issues.
- If there is a conflict preventing the merge, please resolve it locally and update your branch.
- Always open pull requests against the `develop` branch.
- Always assign yourself to the PR.
- Assign at least one other team member as a reviewer.
- Include a clear description of your changes, following the provided template.

## Secrets and Configuration

- Keep sensitive information, such as API keys and passwords, out of your code.
- Always double-check your changes for any exposed secrets before committing.
- Use environment variables or configuration files to manage secrets.
- Document any required environment variables in the appropriate file.

## Language

All code, comments, commit messages, documentation, pull request description and any other texts (non UI) **must be** written in English.

## Thank You

Thank you for taking the time to contribute to our project! Your efforts are greatly appreciated.