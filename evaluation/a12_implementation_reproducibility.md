# A12 — Implementation Reproducibility Evidence

## Scope

This record documents the reproducibility of the recovered implementation and evaluation pipeline. It distinguishes what can be reproduced from the recovered repository from historical results for which the original training records are unavailable.

## Recovered Evaluation Configuration

- Dataset: `HAM10000`
- Dataset images: `10,015`
- Unique lesions: `7,470`
- Test images: `1,995`
- Test lesions: `1,494`
- Split method: lesion-level stratified split
- Random state: `42`
- Model: `backend_py/skin_cancer_model.h5`
- Model output classes: `8`
- Evaluated HAM10000 classes: `7`
- Excluded model class: `normal_skin`

The label mapping used by the recovered evaluation is recorded in `evaluation/ham10000_evaluation_config.json`.

## Reproducibility Artifacts

The repository contains:

- `evaluation/reproducibility_manifest.json`
- `evaluation/ham10000_evaluation_config.json`
- `evaluation/ham10000_test_manifest.csv`
- `evaluation/run_ham10000_evaluation.py`
- `evaluation/case_predictions.csv`
- `evaluation/evaluation_metrics.json`
- `evaluation/requirements-evaluation.txt`
- `evaluation/smoke_test.py`
- `evaluation/smoke_test_log.txt`

The reproducibility manifest records SHA-256 hashes for the recovered model, test manifest, case predictions, and evaluation metrics.

## Evaluation Environment

The recovered evaluation environment is pinned in `evaluation/requirements-evaluation.txt`:

- TensorFlow CPU `2.15.0`
- Keras `2.15.0`
- NumPy `1.26.4`
- pandas `2.3.3`
- Pillow `12.1.0`
- scikit-learn `1.7.2`
- SciPy `1.15.3`
- Flask `3.1.2`
- flask-cors `6.0.2`
- bcrypt `5.0.0`

## Smoke-Test Evidence

The recovered smoke test completed successfully.

Observed evidence:

- `A12 smoke test: PASS`
- TensorFlow model loaded successfully.
- Input shape: `(None, 224, 224, 3)`
- Output shape: `(None, 8)`
- Prediction vector length: `8`
- A prediction was produced successfully.

The smoke test demonstrates that the recovered model can be loaded and executed in the recovered environment.

## Evaluation Procedure

The recovered evaluation script:

1. Loads the pinned model.
2. Loads the versioned test manifest.
3. Maps HAM10000 diagnosis codes to the documented class names.
4. Loads each test image.
5. Converts images to RGB.
6. Resizes images to `224 x 224`.
7. Scales pixel values to `[0, 1]`.
8. Runs model inference.
9. Records case-level predictions and confidence values.
10. Calculates accuracy, classification report, and confusion matrix.
11. Saves predictions to `evaluation/case_predictions.csv`.
12. Saves metrics to `evaluation/evaluation_metrics.json`.

The evaluation script currently contains a machine-specific local dataset path. Therefore, another environment must configure the HAM10000 image location before executing the script.

## Recovered Evaluation Result

The recovered evaluation artifacts report an accuracy of approximately `17.59%` across the seven evaluated HAM10000 classes.

This result is specific to the recovered model, test manifest, preprocessing, class mapping, and evaluation procedure. It is not presented as clinical diagnostic performance.

## Historical Training Result Limitation

The historical project record referenced a `72%` accuracy value. The recovered repository does not contain the original training run, complete training history, original dataset/version record, original split manifest, or sufficient raw training evidence to independently reproduce that historical result.

Therefore:

- the historical `72%` value remains unverified;
- it must not be represented as a reproduced result from the recovered repository;
- the recovered `17.59%` evaluation result must not be presented as a direct re-run of the historical 72% experiment.

## Training Reproducibility Limitation

The recovered repository contains the model artifact and evaluation pipeline, but it does not contain a complete reproducible training bundle covering:

- original training dataset version;
- original training/validation/test split files;
- complete training history;
- original random seeds and training configuration;
- optimizer and learning-rate schedule history;
- epoch-by-epoch logs;
- original class-balancing run records;
- original pre/post-balancing predictions.

Consequently, the recovered evidence supports reproduction of the available evaluation/smoke-test workflow, but not reconstruction of the historical training experiment.

## Machine-Specific Path Limitation

`evaluation/run_ham10000_evaluation.py` currently references a local HAM10000 directory path. This is an implementation portability limitation rather than evidence of a failed evaluation.

For future reproduction, the dataset location should be supplied through a configurable environment variable or command-line argument rather than a user-specific absolute path.

## Reproducibility Boundary

### Reproducible from recovered repository

- Model loading
- Model input/output structure
- Evaluation environment versions
- Test manifest
- Lesion-level split metadata
- Preprocessing steps
- Case-level prediction generation
- Accuracy/classification-report/confusion-matrix calculation
- Evaluation artifact generation
- Smoke-test execution

### Not reproducible from recovered repository

- Historical 72% training result
- Original training run
- Original training history
- Original class-balancing comparison
- Missing historical participant/prototype evidence

## Conclusion

The recovered repository provides a reproducible implementation and evaluation pathway for the available model and locked evaluation artifacts, with a documented environment and SHA-256 integrity manifest.

The evidence does not support reconstruction of the historical training experiment or independent verification of the historical 72% result. The recovered evaluation result and smoke test should therefore be treated as evidence of the recovered implementation state, not as validation of the historical project claims.
