## 1. Reproduction and Scope

- [ ] 1.1 Reproduce or precisely document issue #35 with RAT enabled, thick client runtime, and an ordinary form opening path.
- [ ] 1.2 Locate the RAT event subscription that references `РатПередЗаписьюДокумента` and record its target module, handler name, event source, and runtime context.
- [ ] 1.3 Inspect the target handler module metadata, export flags, and preprocessor directives to identify why the handler is unavailable in the failing context.

## 2. Implementation

- [ ] 2.1 Apply the minimal metadata/module change that makes each RAT event subscription handler resolvable in the runtime contexts where the platform can trigger it.
- [ ] 2.2 Keep the handler body thin and delegate existing object-write behavior through `РатИнформационнаяБаза` and `РатИнформационнаяБазаПереопределяемый.ПередЗаписьюОбъекта`.
- [ ] 2.3 Avoid adding UI-form business logic, broad client-mode abstractions, or unrelated metadata cleanup.

## 3. Regression Coverage

- [ ] 3.1 Add or adjust the smallest fixture/scenario needed to open an ordinary form with the RAT extension enabled.
- [ ] 3.2 Ensure the regression fails if a RAT event subscription points to a missing or runtime-unavailable handler.
- [ ] 3.3 Preserve existing RAT object write coverage for create/update flows that call the pre-write extension point.

## 4. Verification and Review

- [ ] 4.1 Run the ordinary-form regression command and capture the exact command/result.
- [ ] 4.2 Run the narrow existing RAT data-write or Vanessa scenario that proves object write behavior still works.
- [ ] 4.3 Run `openspec validate fix-ordinary-form-event-handlers --strict`.
- [ ] 4.4 Review the diff for minimal scope, runtime-context correctness, and missing tests before marking implementation complete.
