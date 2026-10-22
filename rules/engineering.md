# Rule: Engineering principles

## Value first

- Build the smallest increment that gives value to a user (MVP).
- Build only what a spec or a task asks for. Write other ideas in the backlog.

## Simplicity

- Use the simplest solution that meets the spec.
- Add an abstraction only when two or more real uses need it.
- Do not add a dependency if 20 lines of clear code do the same work.

## DRY

- Keep each fact in one place. Link to it from other places.
- This applies to code, configuration and documents.

## SOLID

- Single responsibility: one module has one reason to change.
- Open/closed: add behavior with new code, not with changes to stable code.
- Liskov substitution: a subtype must keep the contract of its base type.
- Interface segregation: keep interfaces small and specific to the client.
- Dependency inversion: core logic depends on abstractions, not on I/O details.
- Use SOLID to make code easy to change. Do not use it to add layers without need.

## Tests

A good test:

- Tests behavior through a public interface, not implementation details.
- Fails when the behavior breaks and passes when you refactor the internals.
- Has one clear reason to fail and a name that tells this reason.
- Is fast, independent and gives the same result each time.
- Maps to a spec scenario when one exists.

A bad test:

- Mocks the unit that it tests, or mocks types that you do not own without need.
- Asserts on private state, call counts or log text without a reason.
- Passes when the feature is broken (for example it has no assertion).
- Depends on time, order or network without control.

## Refactor

After each task, do these steps:

1. Look for duplication, dead code and names that are not clear.
2. Look for code that you can make shorter without loss of clarity.
3. Refactor only with passing tests before and after.
4. If the refactor is large, do not do it. Write it in the backlog.
