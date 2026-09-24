# A11 — Final Asset Verification

## Scope

This record documents the final assets recovered in the project repository and distinguishes repository/file presence from content-level verification. It does not treat an asset as verified merely because a link, filename, or historical reference exists.

## Repository Status

- Repository: `vasumathinithya/skin-cancer--detection`
- Branch: `main`
- Current recovered A10 commit: `89413cf`
- Working tree was clean before this evidence record was created.
- The repository contains source code, deployment configuration, README documentation, and evaluation artifacts.
- No separate final report, presentation deck, demo video, or participant-evidence package was recovered in the repository tree.

## Recovered Final Assets

| Asset | Repository path | Presence | Content verification |
|---|---|---|---|
| Project documentation | `README.md` | Present and Git-tracked | Verified from repository content |
| Frontend application | `src/` | Present and Git-tracked | Source files available for inspection |
| Flask backend | `backend_py/` | Present and Git-tracked | Source files available for inspection |
| Node backend | `server_py/` | Present and Git-tracked | Source files available for inspection |
| Model file | `backend_py/skin_cancer_model.h5` | Present and Git-tracked | File is present; clinical/model claims remain evidence-bounded |
| Evaluation evidence | `evaluation/` | Present and Git-tracked | A06–A10 evidence and recovered evaluation artifacts available |
| Deployment configuration | `vercel.json`, `backend_py/render.yaml` | Present and Git-tracked | Configuration files available for inspection |
| Environment template | `.env.example` | Present and Git-tracked | Template available; secrets are not treated as project evidence |
| Final report | Not recovered | Not present | Not verified |
| Presentation/deck | Not recovered | Not present | Not verified |
| Demo video | Not recovered | Not present | Not verified |
| Historical participant records | Not recovered | Not present | Not verified |
| Historical prototype evaluation package | Not recovered | Not present | Not verified |
| Original PoC workbook | Not recovered | Not present | Not verified |

## Evaluation Evidence Available in Repository

The following evidence files are present and Git-tracked:

- `evaluation/a06_endpoint_timings.csv`
- `evaluation/a06_latency_evidence.md`
- `evaluation/a06_latency_test.py`
- `evaluation/a07_early_risk_evidence.md`
- `evaluation/a08_access_time_user_evidence.md`
- `evaluation/a09_invalid_image_evidence.md`
- `evaluation/a10_longitudinal_reconciliation.md`
- `evaluation/case_predictions.csv`
- `evaluation/evaluation_metrics.json`
- `evaluation/ham10000_evaluation_config.json`
- `evaluation/ham10000_test_manifest.csv`
- `evaluation/reproducibility_manifest.json`
- `evaluation/requirements-evaluation.txt`
- `evaluation/run_ham10000_evaluation.py`
- `evaluation/smoke_test.py`
- `evaluation/smoke_test_log.txt`

These files provide recovered implementation/evaluation evidence but do not substitute for missing historical participant records, prototype records, PoC source workbook, report, deck, or other restricted assets.

## Claim-to-Asset Verification

| Claim/evidence area | Available asset | Verification status |
|---|---|---|
| Local prediction latency | A06 CSV + evidence + test script | Verified within documented local measurement boundary |
| Historical early-risk percentage | A07 evidence record | Historical value remains unverified |
| Historical care-access/user study | A08 evidence record | Historical claims remain unverified |
| Invalid-image rejection percentage | A09 evidence record | Historical percentage remains unverified |
| Longitudinal metric reconciliation | A10 evidence record | Reconciliation documented; historical improvement claims not established |
| Recovered model evaluation | Evaluation manifest, metrics, predictions | Recovered evaluation is documented in repository |
| Historical prototype-user metrics | No participant records recovered | Not independently verified |
| Historical report/deck/demo claims | No corresponding final assets recovered | Not independently verified |

## Duplicate or Ambiguous Assets

No separate presentation deck was recovered alongside the repository documentation. Therefore, no filename/type duplication between a final report and presentation deck can be independently resolved from the repository alone.

Where external or restricted assets are referenced outside this repository, their existence should be recorded separately from their content verification.

## Verification Boundary

Repository inspection establishes that the listed files exist in the recovered Git history/current working tree. It does not establish the existence, completeness, authenticity, or content of external/restricted assets that are not present in the repository.

Historical claims should therefore remain linked only to evidence that can be independently inspected and reproduced from the recovered project artifacts.

## Conclusion

The recovered repository provides inspectable source, configuration, README documentation, model, and evaluation assets. Separate historical report, deck, demo-video, participant-record, and original PoC-workbook assets were not recovered here and are therefore not treated as independently verified evidence.
