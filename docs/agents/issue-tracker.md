# Issue Tracker Configuration — GitHub Issues

## Location

Issues live in the **GitHub Issues** of this repo:  
`https://github.com/alexanderkif/photosXM/issues`

## Triage Labels (none configured)

No triage labels are currently active. If a `triage` skill is installed later, it can be added without changing existing workflows.

## Workflow Summary

| Action | How |
|--------|-----|
| Create issue | Via GitHub web UI or `gh issue create` CLI |
| Read issue | Open on GitHub Issues page; read description + comments |
| Link to code | Use the standard GitHub reference (`#123`) |
| PRs as request surface | **Off** (PRs are for changes, not tracked separately) |

## Engineering Skills That Consume This Tracker

The following skills will use this file to find and process issues:

- `to-tickets` — creates new GitHub Issues from feature specs or bug reports
- `triage` *(not installed yet)* — assigns triage labels when available
- `code-review` — reviews changes linked to existing issues
- `diagnosing-bugs` — looks up related issues before starting investigation

## Notes

- Edit this file directly if the issue tracker needs to be switched (e.g., moving to GitLab).
- Re-running the setup skill is only needed when changing trackers or restarting from scratch.
