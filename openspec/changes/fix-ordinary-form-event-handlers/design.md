## Context

RAT is delivered as a 1C extension that adds REST/test automation behavior to a target infobase. Issue #35 shows that the extension can break unrelated user work: opening an ordinary form fails because the platform tries to resolve the `РатПередЗаписьюДокумента` event subscription handler and reports that the handler is missing.

The current source has RAT object-write logic in `РатИнформационнаяБаза`, an exported customization point in `РатИнформационнаяБазаПереопределяемый.ПередЗаписьюОбъекта`, and multiple common modules with explicit client/server availability flags. The fix must respect 1C runtime context rules for ordinary forms, thick managed client mode, and server-side service execution.

## Goals / Non-Goals

**Goals:**

- Make RAT event subscription handlers resolvable in every runtime context where the 1C platform can trigger the subscription.
- Prevent RAT from blocking ordinary-form opening or normal document work when no RAT request is being processed.
- Keep the existing object write extension point and REST/test automation behavior intact.
- Add a regression path that fails if a RAT event subscription references an unavailable handler.

**Non-Goals:**

- Redesign RAT event processing or the REST API.
- Add a generic compatibility layer for every 1C client mode beyond the failing ordinary-form/thick-client scenario.
- Remove the `ПередЗаписьюОбъекта` customization point or change its public signature.
- Introduce broad formatting, module moves, or unrelated metadata cleanup.

## Decisions

1. Fix handler availability at the metadata/module boundary.

   The platform error is raised while resolving an event subscription handler, before useful business logic can run. The implementation should align the event subscription target, common module availability flags, export/preprocessor directives, and handler signatures so the platform can always find the handler in the failing runtime context. Alternative considered: catch or suppress the error in RAT service code. That would not work because handler resolution happens before the service code controls execution.

2. Keep RAT write behavior behind the existing service path.

   Existing object-save behavior already routes through `РатИнформационнаяБаза.ПередЗаписьюОбъекта` and then `РатИнформационнаяБазаПереопределяемый.ПередЗаписьюОбъекта`. The fix should preserve this flow and avoid duplicating write preparation logic inside UI forms or event handlers. Alternative considered: special-case ordinary forms in the write service. That would couple UI/runtime compatibility to data-write logic and would not address missing handler resolution.

3. Add a focused ordinary-form regression fixture or scenario.

   Verification should reproduce the user-visible failure: RAT extension enabled, thick client/runtime matching the issue, ordinary form opened, no missing-handler error. If the existing fixture cannot run ordinary forms directly, implementation should add the smallest fixture metadata or scenario needed to cover this path. Alternative considered: only static-searching handler names in source. Static checks are useful but insufficient because the failure depends on platform runtime availability.

## Risks / Trade-offs

- Missing exact reproduction mode -> Capture the client mode, form type, and launch command in the verification notes before changing behavior.
- Handler made available in too many contexts -> Keep handler bodies thin and delegate to existing service modules so extra availability does not introduce duplicated logic.
- Regression test depends on local 1C tooling -> Prefer the repo's existing v8-runner/Vanessa workflow where possible and document any environment-specific command that cannot run locally.
- Metadata-only changes are hard to review -> Keep changes near the event subscription/module metadata and pair them with a scenario that proves ordinary forms open successfully.
