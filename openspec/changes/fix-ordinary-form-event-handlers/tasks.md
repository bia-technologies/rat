## 1. Reproduction and Scope

- [x] 1.1 Reproduce or precisely document issue #35 with RAT enabled, thick client runtime, and an ordinary form opening path.
- [x] 1.2 Locate the RAT event subscription that references `РатПередЗаписьюДокумента` and record its target module, handler name, event source, and runtime context.
- [x] 1.3 Inspect the target handler module metadata, export flags, and preprocessor directives to identify why the handler is unavailable in the failing context.

## 2. Implementation

- [x] 2.1 Apply the minimal metadata/module change that makes each RAT event subscription handler resolvable in the runtime contexts where the platform can trigger it.
- [x] 2.2 Keep the handler body thin and delegate existing object-write behavior through `РатИнформационнаяБаза` and `РатИнформационнаяБазаПереопределяемый.ПередЗаписьюОбъекта`.
- [x] 2.3 Avoid adding UI-form business logic, broad client-mode abstractions, or unrelated metadata cleanup.

## 3. Regression Coverage

- [x] 3.1 Add or adjust the smallest fixture/scenario needed to open an ordinary form with the RAT extension enabled.
- [x] 3.2 Ensure the regression exercises opening the ordinary form with the RAT extension enabled.
- [x] 3.3 Preserve existing RAT object write coverage for create/update flows that call the pre-write extension point.

## 4. Verification and Review

- [x] 4.1 Run the ordinary-form regression command and capture the exact command/result.
- [x] 4.2 Run the narrow existing RAT data-write or Vanessa scenario that proves object write behavior still works.
- [x] 4.3 Run `openspec validate fix-ordinary-form-event-handlers --strict`.
- [x] 4.4 Review the diff for minimal scope, runtime-context correctness, and missing tests before marking implementation complete.
