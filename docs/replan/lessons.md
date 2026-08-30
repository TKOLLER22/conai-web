# Replan Lessons Learned

> Curated guidance. Both /replan and /recheck inject this file into every subagent prompt
> (wrapped with context-marking tags). Keep entries short and concrete. Remove entries that
> no longer apply.

---

## Scripted string-replacement edits must assert their match

When patching files via sed/str.replace, a non-matching pattern silently no-ops and the "fix" vanishes — this shipped a whole-site layout bug (72rem vs 88rem Container) that survived two review rounds. Always assert the pattern was found (or verify the diff) after scripted edits. Corollary from the same run: apply performance recommendations behind a measurement — a font weight-pinning "fix" scored worse than the baseline and had to be reverted.

> Added 2026-08-30 after /recheck on plan 3084bbb found a silently-failed edit behind a critical layout finding.
