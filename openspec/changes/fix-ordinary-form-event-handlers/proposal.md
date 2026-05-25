## Why

Issue #35 reports that after installing RAT, opening an ordinary form in a thick managed client fails with the platform error that the `РатПередЗаписьюДокумента` event handler is not found. RAT must not break user work with ordinary forms when its extension functionality is present but not actively handling a REST/test request.

## What Changes

- Ensure RAT event subscriptions and their handler modules are available in the client/server runtime contexts where the 1C platform resolves them.
- Keep ordinary-form opening and document work unaffected by RAT initialization in thick managed client mode.
- Preserve the current RAT service behavior for object write flows, including the existing `ПередЗаписьюОбъекта` extension point in `РатИнформационнаяБазаПереопределяемый`.
- Add regression coverage for opening an ordinary form with RAT enabled so missing event handlers fail during verification, not in user databases.

## Capabilities

### New Capabilities

- `ordinary-form-compatibility`: RAT extension compatibility requirements for ordinary forms and thick managed client runtime contexts.

### Modified Capabilities

- None.

## Impact

- Affected extension metadata and BSL modules under `exts/rat/src`, especially event subscriptions and common modules that host event handlers.
- Affected verification assets under `fixtures/configuration` and/or `features_scenario` if a reproducible ordinary-form scenario is added.
- No public REST API, Vanessa step, or data format changes are expected.
