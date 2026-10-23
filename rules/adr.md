# Rule: Architecture decision records

sparc uses the MADR format (https://adr.github.io/madr/).
The template is `templates/project/docs/adr/0000-template.md`.

## Files

- Path: `docs/adr/NNNN-short-title.md`. `NNNN` is the next free number with 4 digits.
- Write one decision in one ADR.

## Status

| Status | Meaning |
|---|---|
| `proposed` | The decision is open for review. |
| `accepted` | The user approved the decision. |
| `rejected` | The user did not approve the decision. |
| `deprecated` | The decision is not valid now. No ADR replaces it. |
| `amended` | The user approved an addition. The addition does not change the initial decision. |
| `superseded by ADR-NNNN` | A new ADR replaces the decision. |

## Transitions

| From | To |
|---|---|
| `proposed` | `accepted`, `rejected` |
| `accepted` | `amended`, `deprecated`, `superseded by ADR-NNNN` |
| `amended` | `amended`, `deprecated`, `superseded by ADR-NNNN` |

`rejected`, `deprecated` and `superseded` are final.

## Decided ADRs do not change

An ADR is decided when its status is not `proposed`. Commit the decision. After that commit, only these changes are permitted:

- The front matter fields `status` and `date`.
- New entries at the end of the section `## Amendments`.

Use only the MADR front matter fields: `status`, `date`, `decision-makers`, `consulted` and `informed`.
`scripts/check.mjs` compares each decided ADR with its first committed decided version in git. It reports each other change.

## Amend or supersede

1. Write the proposed change.
2. Ask: "Does this change alter the context, the options, the decision or its consequences?"
3. If yes, write a new ADR. Set the old ADR to `superseded by ADR-NNNN`.
4. If no, show the addition to the user and ask for approval.
5. After approval, add an entry to `## Amendments`. Set the status to `amended`.

An amendment entry has this format:

```md
### YYYY-MM-DD: <short title>

Approved by: [@github-handle](https://github.com/github-handle), <chat | GitHub PR link>

<the addition>
```
