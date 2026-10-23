# Spec Delta

## ADDED Requirements

### Requirement: Sentence check only for proposed ADRs
The check SHALL report sentences with more than 25 words only in ADRs with the status `proposed`. It SHALL NOT report them in a decided ADR, because a decided ADR must not change.

#### Scenario: Long sentence in a decided ADR
- **WHEN** an ADR with the status `accepted` has a sentence with 30 words
- **THEN** the check does not report the sentence

#### Scenario: Long sentence in a proposed ADR
- **WHEN** an ADR with the status `proposed` has a sentence with 30 words
- **THEN** the check reports the sentence
