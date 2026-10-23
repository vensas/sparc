# Tasks

## 1. Check

- [ ] 1.1 Replace the lock in `scripts/check.mjs` with the git history protection, the amendment protection, the MADR field check and the no-git finding. Remove `adrHash`, `lockAdr` and `--lock`. Verify: `node --test 'scripts/*.test.mjs'` passes with a test for each scenario of `adr-management`. Documents: none.

## 2. sparc ADRs and documents

- [ ] 2.1 Remove the `locked:` lines from `docs/adr/`. Add ADR-0008 and set ADR-0004 to `superseded by ADR-0008`. Verify: `node scripts/check.mjs` reports no findings. Documents: ADRs, canvas.
- [ ] 2.2 Remove the lock from `rules/adr.md`, `skills/adr/SKILL.md`, `skills/init/SKILL.md`, `skills/archive/SKILL.md`, `skills/sync/SKILL.md`, `agents/architect.md`, the ADR template and `README.md`. Verify: `grep -rn -- '--lock\|locked' rules skills agents templates README.md` finds nothing, and `claude plugin validate .` passes. Documents: README.md.
- [ ] 2.3 Add the `CHANGELOG.md` Unreleased entries. Verify: `node scripts/check.mjs` passes. Documents: CHANGELOG.md.
