# Rule: Approval

Some steps need approval from the user. Examples: a proposal before apply, an ADR before `accepted`, an amendment.

## Valid approval

Approval is one of these:

1. A clear "yes" from the user in the chat for the named item.
2. A GitHub pull request review with the state `APPROVED`.
3. The label `sparc:approved` on the pull request or issue of the item.

## Procedure

1. Name the item that needs approval. Show a short summary and a link to the file.
2. Ask the user: "Approve in chat, or on GitHub?"
3. For GitHub, read the state with `gh pr view <n> --json reviewDecision,labels` or `gh issue view <n> --json labels`.
4. Record the approval where the item needs it (for example an ADR amendment entry).
5. If there is no approval, stop. Do not continue with the step.

Silence is not approval. Approval for one item is not approval for another item.
