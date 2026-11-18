## MODIFIED Requirements

### Requirement: Build and deployment

A script without npm dependencies SHALL build the site from `website/` into one output folder. An Aspire AppHost SHALL run the site container locally and generate the Kamal configuration. A GitHub Actions workflow SHALL test the site container on each push to `main` and each pull request that changes the website, its build or the data it reads. It SHALL deploy the site with Kamal to the server of `sparc.apps.vensas.de` only after a verified release of sparc and on manual start.

#### Scenario: Build without dependencies

- **WHEN** a developer runs the build command in a clean checkout with Node.js and no `npm install`
- **THEN** the build completes and writes the site

#### Scenario: Local run

- **WHEN** a developer runs the AppHost with `aspire run`
- **THEN** the Aspire dashboard shows the site container, and its endpoint shows the landing page

#### Scenario: Deploy after a change

- **WHEN** a commit on `main` changes a file in `website/`
- **THEN** the workflow tests the container and does not deploy it; the next release deploys it

#### Scenario: Deploy after a release

- **WHEN** a release tag `v0.9.0` is pushed, and the publication workflow verified the release and created the GitHub release
- **THEN** the publication workflow tests the site and then deploys it with Kamal

#### Scenario: Failed release verification

- **WHEN** the release verification of a tag fails
- **THEN** the site is not deployed

#### Scenario: Manual start

- **WHEN** a maintainer starts the workflow `Website` by hand on `main`
- **THEN** the workflow tests the container and deploys it
