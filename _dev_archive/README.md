# _dev_archive

This folder contains development-only files that are **not needed for production**.
They were moved here during production cleanup to keep the source tree lean.

## Contents

| Folder | Contents |
|---|---|
| `docs/` | Project documentation (README.md, AI-SEO-ENGINE.md) |
| `backend_debug/` | Debug scripts (debug_login.py, debug_schema.py, etc.) |
| `backend_seeds/` | One-off seed scripts (seed_team_block.py, seed_hf_blocks.py, etc.) |
| `backend_tests/` | Backend pytest suite (test_auth.py, test_crud.py, test_upload.py) |
| `reports/` | Build output and ESLint reports |
| `tasks/` | Dev task tracking (todo.md) |
| `github_instructions/` | AI coding workflow instructions |

## Restoring

To restore any file, move it back to its original location. The original paths
are reflected in the folder names (e.g., `backend_debug/` files came from `backend/`).
