## Why

The workflow `Website` deploys the site on each push to `main` that changes the website or the data it reads. The user wants the site to change only with a release of sparc, so that the site shows the version, the changelog and the record of a release, and not work in progress on `main`. The change add-landing-page chose the deploy on push, so that a fix of a legal text does not wait for a release. A manual start keeps this way open.

## What Changes

- The website deploys after a verified release: `publish.yml` calls the deploy of `website.yml` after it verified the release tag and created the GitHub release.
- A push to `main` and a pull request only test the site. They do not deploy.
- A manual start of the workflow `Website` still deploys, for an urgent fix (for example a legal text).

Out of scope:

- A deploy for each commit, a staging site, or a preview for pull requests.
- A change of the release steps of `/sparc:release`. The tag push stays as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `website`: the requirement "Build and deployment" deploys after a release and on manual start, not on push.

## Impact

- `.github/workflows/website.yml`, `.github/workflows/publish.yml`, the tests in `scripts/`, `AGENTS.md` (CI row), `README.md` ("Develop sparc"), `docs/architecture/canvas.md`, `docs/architecture/c4.md` (relation label).
