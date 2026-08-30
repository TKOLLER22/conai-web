# Replan Lessons Learned

> Curated guidance. Both /replan and /recheck inject this file into every subagent prompt
> (wrapped with context-marking tags). Keep entries short and concrete. Remove entries that
> no longer apply.

---

## Scripted string-replacement edits must assert their match

When patching files via sed/str.replace, a non-matching pattern silently no-ops and the "fix" vanishes — this shipped a whole-site layout bug (72rem vs 88rem Container) that survived two review rounds. Always assert the pattern was found (or verify the diff) after scripted edits. Corollary from the same run: apply performance recommendations behind a measurement — a font weight-pinning "fix" scored worse than the baseline and had to be reverted.

> Added 2026-08-30 after /recheck on plan 3084bbb found a silently-failed edit behind a critical layout finding.

## Gate checks must observe real exit codes and real wire responses

A lint gate piped through `tail`/`grep` reports the pipe's exit code, not the linter's — a red lint shipped in a "verified clean" commit this way; check gates with explicit exit codes. Likewise, headers "set" in middleware or next.config may never reach final responses (Next owns Vary on documents and rewrites drop appends) — verify security/caching headers with curl against a running build, per host and per response type.

> Added 2026-08-30 after /recheck on plan 05c4ee7 found a failing lint at HEAD and a Vary header that never reached the responses it was meant to protect.
