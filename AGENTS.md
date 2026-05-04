## Multiagent Workflow (Required)
Each task must pass through the following stages, in order:
1. Requirements analysis.
2. Planning (implementation plan + verification plan).
3. Implementation.
4. Testing.
5. Review.

## Scope & Diff Constraints
- Minimal diffs only.
- No refactors, no formatting runs, no lint cleanup.
- Never do wide edits across unrelated files.
- If any agent proposes changes outside the current task scope: STOP and correct scope.

## Branching & Commits
- Create branches automatically only for issue-tracked work.
- Issue tasks use their own branch: `feat/<issue-i>-<short-description>`.
- Non-issue tasks stay on the current branch unless the user explicitly asks to create a branch.
- Commit at the end of the task using Conventional Commits (e.g., `feat: ...`, `fix: ...`, `chore: ...`).

## Roles
- Coordinator (default agent): owns the workflow, ensures every stage is completed and documented.
- Explorer: gather evidence only; no fixes unless requested.
- Worker: implement code changes as assigned by the coordinator.
- Reviewer: review changes for correctness, security, regressions, and missing tests.

## Stage Outputs
- Analysis: concise requirements, assumptions, and risks.
- Planning: bullet list of steps + how each step will be verified.
- Implementation: changes made with file references.
- Testing: commands run + results (or reason not run).
- Review: reviewer findings or explicit “no findings”.
