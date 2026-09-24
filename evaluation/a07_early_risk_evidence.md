# A07 — Early-Risk Detection Evidence

## Current implementation

The recovered `/api/predict` endpoint performs multiclass prediction by selecting the highest model output probability (`argmax`) and reports that probability as confidence.

The current prediction path does not define or evaluate a numerical early-risk detection threshold. The implementation labels a prediction as `"Cancer"` only when the selected class is `melanoma`; all other predicted classes are returned as `"Non-Cancer"`.

## Historical claim

The historical project evidence contains a 78% early-risk detection claim. The recovered repository does not contain sufficient evidence to independently reproduce that metric.

The following required elements were not recovered:

- operational definition of "early-risk detection"
- reference standard used to establish the true early-risk status
- denominator and eligible case definition
- decision threshold or cutoff
- case-level reference labels
- case-level predictions used for the reported calculation
- reproducible calculation producing the reported percentage

## Evidence status

The historical 78% early-risk detection result is therefore treated as **unverified**.

The current repository does not present the 78% value as validated model performance.

The database/admin use of severity or high-risk fields is not treated as an evaluation metric because those fields do not provide a documented reference-standard evaluation protocol.

## Future evaluation requirement

Any future early-risk detection claim should define the intended operational outcome, reference standard, eligible population, decision threshold, exclusions, and denominator before evaluation. The evaluation should preserve case-level reference labels and predictions so that the reported sensitivity, specificity, predictive values, and uncertainty can be independently recomputed.

The result should be reported only for the locked evaluation protocol and should not be presented as clinical diagnostic performance without appropriate clinical validation.
