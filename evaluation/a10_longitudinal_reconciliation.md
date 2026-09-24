# A10 — Longitudinal Evidence Reconciliation

## Scope

This document reconciles the different cohorts, endpoints, datasets, units, and evaluation stages found in the recovered P140 project evidence.

## Historical MVP Stage

The historical MVP record reported:

- Six users
- 72% model accuracy
- Approximately seven-second prediction time
- 78% early-risk detection

These values are treated as historical annotations because the recovered repository does not contain sufficient underlying records to establish the original cohort, evaluation protocol, raw observations, or complete reproducibility.

## Historical Final Stage

The historical final record reported:

- Ten users
- A 30–40-day care-access baseline
- A software value below five seconds
- 95% invalid-image rejection accuracy
- Improvement after class balancing

These values use different constructs and evidence requirements and are not directly comparable with the MVP values.

The 30–40-day care-access baseline represents an external care-access construct, whereas software response time represents a technical system-performance construct. They must not be combined to imply measured reduction in clinical waiting time.

The ten-user historical evaluation is not independently reproducible because the recovered repository does not contain the required participant records, task protocol, raw timestamps, or related study evidence.

The historical 95% invalid-image rejection result is documented separately in evaluation/a09_invalid_image_evidence.md and remains unverified.

The historical class-balancing improvement is not treated as established because a directly comparable pre- and post-balancing evaluation under the same locked protocol is not available.

## Recovered Model Evaluation

The recovered evaluation package uses HAM10000 with:

- 10,015 dataset images
- 7,470 unique lesions
- 1,995 test images
- 1,494 test lesions
- Lesion-level stratified split
- Random state 42
- Seven evaluated diagnostic classes
- `normal_skin`
ormal_skin excluded from the HAM10000 accuracy calculation

The recovered evaluation reports 17.5939849624% accuracy across the seven evaluated HAM10000 diagnostic classes.

This is a recovered model evaluation and is not directly comparable with the historical 72% accuracy claim because the original training/evaluation protocol and evidence supporting that historical value are unavailable.

## Recovered Endpoint Latency

The recovered A06 measurement uses:

- POST /api/predict
- 10 consecutive local requests
- Local Flask development server at 127.0.0.1:5000
- Mean approximately 0.184 seconds
- Median approximately 0.172 seconds
- P95 approximately 0.291 seconds

This measurement is a local technical latency measurement. It is not directly comparable with the historical seven-second value because the historical measurement protocol, repetitions, environment, and raw timings were not preserved.

## Metric Reconciliation

| Stage | Cohort / Dataset | Endpoint / Construct | Unit | Status |
|---|---|---|---|---|
| Historical MVP | 6 users | User/model evaluation | 72% accuracy | Unverified |
| Historical MVP | Historical prototype | Prediction time | ~7 seconds | Unverified |
| Historical MVP | Historical evaluation | Early-risk detection | 78% | Unverified |
| Historical Final | 10 users | User evaluation | 10 users | Unverified |
| Historical Final | External care-access context | Access baseline | 30–40 days | Unverified |
| Historical Final | Software | Response-time value | <5 seconds | Historical, protocol unavailable |
| Historical Final | Invalid-image evaluation | Rejection accuracy | 95% | Unverified |
| Historical Final | Class balancing | Performance improvement | Not quantified in recovered evidence | Unverified |
| Recovered Evaluation | HAM10000 | Seven-class classification | 17.59% accuracy | Reproduced recovery evaluation |
| Recovered A06 | Local Flask endpoint | POST /api/predict | ~0.184 s mean | Reproduced local measurement |

## Interpretation

The historical MVP and final-stage values should not be presented as a single longitudinal performance series.

The observed differences cannot be interpreted as improvement or degradation unless the same endpoint, cohort definition, dataset, protocol, units, model/configuration, and evaluation procedure are held constant.

The recovered 17.59% classification result and approximately 0.184-second local endpoint measurement are documented separately as reproducible recovery evidence.

No claim of clinical improvement, reduced care-access time, diagnostic equivalence, or model-performance improvement is established by this reconciliation.

## Future Reconciliation Requirements

Future longitudinal comparisons should preserve:

- Dated evaluation stage
- Dataset and version
- Cohort definition
- Endpoint definition
- Unit
- Inclusion and exclusion criteria
- Model and code commit
- Preprocessing configuration
- Random seeds
- Evaluation protocol
- Case-level observations and predictions
- Calculation method

Any claimed improvement from class balancing should use directly comparable pre- and post-balancing evaluations under the same locked protocol.
