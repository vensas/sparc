# Rule: Write in ASD-STE100

Write all English text in ASD-STE100 Simplified Technical English (STE).
This rule applies to documents, specs, ADRs, comments, commit messages and reports.
It does not apply to code identifiers, quotes and product names.

## Words

- Use approved STE words in their approved meaning. If you are not sure, use a simpler word.
- Use one word for one meaning. Use one name for one thing in all documents.
- Use technical names (for example "container", "spec", "ADR") without change.
- Do not use phrasal verbs ("set up" → "install", "find out" → "find").
- Do not use contractions ("don't" → "do not").

## Sentences

- Procedures: write 20 words or fewer in one sentence. Write one instruction in one sentence.
- Descriptions: write 25 words or fewer in one sentence.
- Write one topic in one paragraph. Write 6 sentences or fewer in one paragraph.
- Use the active voice.
- Use the imperative in procedures ("Run the tests.").
- Use simple tenses: present, past, future.
- Write warnings and cautions before the step they apply to.

## Check

- `scripts/check.mjs` finds sentences that are too long. It cannot check vocabulary.
- The full STE dictionary is not in this repository. Do not say that a text "complies with STE". Say that it "follows the STE rules in sparc".
