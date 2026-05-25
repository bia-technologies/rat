## ADDED Requirements

### Requirement: RAT shall not block ordinary form opening
RAT SHALL allow ordinary forms in an infobase with the RAT extension enabled to open without platform errors caused by RAT event subscription handlers.

#### Scenario: Ordinary form opens in thick client runtime
- **WHEN** a user starts the infobase in the thick client runtime covered by issue #35 and opens an ordinary form with the RAT extension enabled
- **THEN** the form opens successfully and no error reports that `РатПередЗаписьюДокумента` or another RAT event handler was not found

### Requirement: RAT event subscription handlers shall be runtime-resolvable
Every RAT event subscription SHALL reference an existing exported handler whose containing module and preprocessor directives make the handler available in each runtime context where the subscription can be triggered.

#### Scenario: Platform resolves RAT write subscription handler
- **WHEN** the 1C platform initializes or triggers a RAT write-related event subscription in the failing ordinary-form/thick-client scenario
- **THEN** the referenced handler is found by name and runtime context before any RAT business logic is executed

### Requirement: RAT object write behavior shall remain unchanged
The compatibility fix SHALL preserve the existing RAT object write flow through `РатИнформационнаяБаза` and the `РатИнформационнаяБазаПереопределяемый.ПередЗаписьюОбъекта` extension point.

#### Scenario: RAT service writes an object after compatibility fix
- **WHEN** a RAT REST or Vanessa-driven scenario creates or updates an object through the existing service path
- **THEN** the object write still applies RAT pre-write preparation and still calls the переопределяемый `ПередЗаписьюОбъекта` hook with its current signature

### Requirement: Regression coverage shall exercise the failing runtime path
The change SHALL include verification that reproduces the ordinary-form opening path with RAT enabled, or document the exact environment limitation if the path cannot be executed locally.

#### Scenario: Regression fails on missing handler
- **WHEN** the regression verification is run against a build where a RAT event subscription points to an unavailable handler
- **THEN** verification fails before the change can be considered complete
