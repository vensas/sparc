# Rule: Approval

sparc knows two kinds of approval: the approval of a change, and the explicit approval of other decisions.

## Approval of a change

- **Without pull requests:** when the user runs `/sparc:apply <id>`, this approves the change, its `proposed` ADRs and its mockups. Do not ask for an approval message. Do not wait for one.
- **With pull requests:** `/sparc:archive` opens one pull request for the change. A review with the state `APPROVED`, or the merge of the pull request, approves the change. On GitHub, the author cannot approve their own pull request. For a solo user, the merge is the approval.
- A review with the state `CHANGES_REQUESTED` sends the work back to `/sparc:apply`.
- The user can reject a `proposed` ADR of the change at any time. Then archive sets it to `rejected`.

Read the state of a pull request with `gh pr view <n> --json reviewDecision,state`.

## Explicit approval of other decisions

These decisions need an explicit approval:

- An ADR amendment, deprecation or supersede outside a change.
- The release version of `/sparc:release`.
- The update plan of `/sparc:update`.
- ADR-0001 in `/sparc:init`.

Explicit approval is a clear "yes" from the user in the chat for the named item, or an approved or merged pull request for the item.

1. Name the item. Show a short summary and a link to the file.
2. Wait for the approval. Silence is not approval. Approval for one item is not approval for another item.
3. Record the approval where the item needs it (for example an ADR amendment entry).
4. If there is no approval, stop. Do not continue with the step.
