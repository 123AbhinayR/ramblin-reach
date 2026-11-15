# Deleted branch recovery record

Captured before normal branch deletion on November 14, 2026. Each recorded tip was verified as an ancestor of main; its commits remain reachable from main. The pre-merge main is also preserved by the pushed `pre-merge-backup` tag.

- `refs/heads/backup/codex-handoff-2026-11-14` — `967478f614bedc142f507189d45936ed4c3f4ff3`
- `refs/heads/dev` — `0417631c35b866ac11dd6df6db5de1852d453f49`
- `refs/heads/feat/circles-quickreach` — `da93f29a753a816133056f79f0e3a11adb878663`
- `refs/remotes/origin/backup/codex-handoff-2026-11-14` — `967478f614bedc142f507189d45936ed4c3f4ff3`
- `refs/remotes/origin/dev` — `0417631c35b866ac11dd6df6db5de1852d453f49`
- `refs/remotes/origin/feat/circles-quickreach` — `da93f29a753a816133056f79f0e3a11adb878663`

Recover a branch with `git branch recovered-name <recorded-SHA>` (and push that recovery branch if desired). No force push or history rewrite was used.
