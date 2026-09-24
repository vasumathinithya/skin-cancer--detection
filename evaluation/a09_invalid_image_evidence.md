# A09 — Invalid-Image Evaluation Evidence

## Scope

This document records the recovered evidence for invalid-image validation in the P140 project.

## Historical Claim

The historical project record reported 95% invalid-image rejection accuracy.

This value is treated as **unverified** because the recovered repository does not contain the underlying labeled valid/invalid test set, reference standard, sampling protocol, case-level predictions, or confusion matrix required to independently reproduce the result.

## Recovered Implementation Evidence

The Flask backend contains image-validation logic in ackend_py/app.py.

The current validation path includes:

1. Image-format handling and EXIF normalization.
2. Minimum image-size validation.
3. Skin-content estimation using an RGB-based skin mask.
4. Skin-ratio thresholding.
5. Image-quality checks using luminance contrast.
6. Laplacian variance for blur detection.
7. Pigment/cluster ratio calculation.
8. Rejection of images considered too blurry or uniform.

These checks demonstrate that invalid-image validation is implemented in the recovered software.

However, implementation logic alone does not establish a measured rejection accuracy.

## Existing Evaluation Artifacts

The repository contains:

- evaluation/ham10000_test_manifest.csv
- evaluation/case_predictions.csv
- evaluation/evaluation_metrics.json
- evaluation/ham10000_evaluation_config.json

These artifacts evaluate HAM10000 diagnostic-class classification.

They do not contain a labeled valid-image/invalid-image evaluation set or invalid-image rejection predictions and therefore are not used as A09 rejection evidence.

## Evidence Status

**Historical 95% invalid-image rejection accuracy: UNVERIFIED**

**Current invalid-image validation implementation: VERIFIED IN SOURCE CODE**

No numerical invalid-image rejection performance is claimed from the recovered repository.

## Missing Evidence

To establish a reproducible invalid-image rejection result, the following should be collected:

- Immutable valid/invalid test manifest
- Definition of valid and invalid images
- Reference-standard procedure
- Sampling method and test-set composition
- Code commit used for evaluation
- Validation thresholds/configuration
- Case-level rejection predictions
- Confusion matrix
- Sensitivity and specificity
- Confidence intervals or other uncertainty estimates
- Exclusion rules, including prevention of training-image leakage

## Future Evaluation

A future A09 evaluation should freeze the test manifest and validation configuration, run the validation path against every test case, retain case-level predictions, and calculate the confusion matrix and derived metrics from those predictions.

The resulting report should identify the exact code commit, test-set manifest hash, configuration, and evaluation environment.

## Conclusion

The recovered project contains implemented invalid-image validation logic, but the historical 95% rejection-accuracy claim cannot be independently reproduced from the available repository evidence.

Accordingly, the 95% value is retained only as an unverified historical claim and is not presented as validated project performance.
