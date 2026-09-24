# Skin Cancer Detection App

An AI-powered web application for detecting skin diseases and connecting with dermatologists.

## Project Structure

- **Frontend**: React + Vite (in root directory)
- **Backend**: Python Flask (in `backend_py` directory)

## Prerequisites

- Node.js & npm
- Python 3.x

## How to Run locally

### 1. Start the Backend Server (Termimal 1)

The backend handles appointments and data storage using SQLite.

```bash
# Navigate to backend directory
cd backend_py

# Install Python dependencies (only first time)
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend will start at `http://localhost:5000`.

### 2. Start the Frontend Application (Terminal 2)

The frontend provides the user interface.

```bash
# In the root project directory

# Install Node dependencies (only first time)
npm install

# Start the development server
npm run dev
```

The application will be available at **`http://localhost:5173`**.

## Features

- **AI Detection**: Upload or capture images to detect skin conditions.
- **Categorized Diseases**: Browse skin conditions by category.
- **Doctor Appointments**: Find and book appointments with specialists.
- **Medical Reports**: Generate PDF reports for your consultation.

## Clinical, Ethical, and Safety Scope

This project is a research and prototype system for exploring AI-assisted skin-disease image classification. It is **not a medical device and must not be used as a substitute for diagnosis, treatment, or advice from a qualified healthcare professional**.

The model outputs are experimental predictions and should not be interpreted as confirmed diagnoses. Users should consult a qualified dermatologist or other appropriate healthcare professional for clinical assessment.

### Intended Use

The system is intended for:
- research and educational evaluation of image-based skin-disease classification;
- demonstrating an AI-assisted screening-support workflow;
- exploring image validation, model inference, reporting, and dermatologist-connectivity features.

The system is not intended to:
- provide definitive diagnosis;
- prescribe or recommend treatment;
- replace clinical examination;
- determine whether a lesion is cancerous without professional assessment;
- make autonomous clinical decisions.

### Clinical Validation

Clinical deployment is outside the scope of this prototype. Before any clinical study or real-world clinical use, the system would require appropriate clinical review, a predefined reference standard established by qualified clinicians, prospective evaluation, subgroup analysis, privacy and consent procedures, and appropriate institutional/ethics approval where applicable.

### Human Oversight and Escalation

AI predictions should be reviewed by a qualified healthcare professional before any medical decision is made. Uncertain, unexpected, or concerning cases should be referred for professional clinical assessment rather than acted upon solely on the basis of the model output.

### Privacy and Research Data

Research evaluation should use appropriately authorized data and follow applicable privacy, consent, access-control, and data-retention requirements. Personal or identifiable health information should not be included in public evaluation artifacts.

### Model Limitations

Performance may vary across image quality, acquisition conditions, populations, and disease categories. The recovered evaluation artifacts demonstrate reproducibility of the available model and evaluation pipeline; they do not establish clinical efficacy, diagnostic accuracy, or readiness for clinical deployment.

## Literature and External Claims

No external literature performance result is used as the performance result of this project.

The recovered model evaluation reported in `evaluation/evaluation_metrics.json` is specific to the recovered model, evaluation manifest, and HAM10000 lesion-level test split documented in this repository. It should not be compared directly with accuracy values reported by other studies unless the datasets, reference standards, preprocessing, class definitions, and evaluation protocols are comparable.

External claims about clinical accuracy, disease prevalence, healthcare access, or clinical effectiveness are outside the scope of the recovered evidence and are not presented as findings of this project.

Any future literature review should cite the original peer-reviewed or authoritative source and clearly distinguish:
- published results from external studies;
- results reproduced from external studies; and
- measurements obtained from this project.

## Project Identity and Authorship Evidence

The recovered repository does not contain the authoritative project roster, final project sheet, or mentor/registrar confirmation required to independently reconcile team-member names, register numbers, and email aliases.

Therefore, authorship and identity reconciliation for the project cannot be independently verified from the recovered repository alone. No team-member identity, register number, or email information has been inferred or altered without authoritative supporting evidence.

For final institutional verification, the authoritative project roster and final submission records should be obtained from the appropriate project, department, mentor, or registrar records.

## Project Provenance Evidence

The recovered repository does not contain the original PoC workbook identified in the audit as the canonical project record. In particular, the workbook containing the referenced `Sheet1!A126:T126` project record is not available in the recovered project files.

Therefore, the SHA-256 hash and cell-level provenance of the original PoC workbook cannot be independently verified from the recovered repository. No replacement workbook, hash, or source record has been fabricated.

For institutional verification, the original PoC workbook should be obtained from the authoritative project registry or project-management records and its file hash and relevant project-record location should then be recorded in the project evidence register.

## Prototype Evaluation Evidence

The recovered repository does not contain the participant-level evidence required to independently verify the historical prototype evaluation claims of 95% engagement, task completion within 2 minutes, or 4.2% error. No participant roster, anonymized task records, survey/interview instruments, raw responses, timestamps, or calculation sheets for those claims were recovered.

The historical prototype commit referenced in the audit (`a3907bcb31706eaba818a184ad85a81763752548`) is not present in the recovered Git history and therefore cannot be independently inspected.

The current recovered implementation does contain a `/api/predict` backend path with TensorFlow model inference logic. It also contains mock/fallback AI response code in frontend utilities. Therefore, historical prototype prediction behavior is not asserted beyond what can be verified from the recovered current code.

The recovered model evaluation artifacts under `evaluation/` are separate from the historical prototype-user evaluation and must not be used as evidence for the participant engagement, task-completion, or prototype error-rate claims.

For institutional verification, the original prototype evaluation records and the referenced historical commit should be obtained from the authoritative project evidence source. If those records cannot be recovered, the historical prototype metrics should remain unverified rather than being reconstructed or estimated.


## Participant and Methods Evidence

The recovered repository does not contain the participant-level records required to independently verify the historical prototype evaluation methodology or participant count.

In particular, no de-identified participant roster, eligibility criteria, survey or interview instruments, consent records, raw response export, participant-level task records, or analysis sheet was recovered.

The historical evaluation description referenced a six-user evaluation using surveys/forms and structured interviews, but the recovered repository does not contain sufficient underlying records to independently verify the participant selection, consent basis, interview/survey questions, responses, or derived results.

Therefore, the historical participant-methods evidence is treated as unverified. No participant identities, responses, consent status, or methodological details have been inferred or reconstructed.

For institutional verification, the original evaluation protocol and de-identified participant evidence should be obtained from the authoritative project evidence source. Any future reproduction should document participant eligibility, recruitment, consent/ethics basis, instruments, anonymized participant identifiers, raw responses, task definitions, and analysis procedures.

## Model Performance Evidence

The recovered repository contains a reproducible evaluation package for the recovered model using HAM10000. The evaluation covers 10,015 dataset images and 7,470 unique lesions, with a lesion-level stratified test split containing 1,995 images from 1,494 lesions using random state 42.

The recovered evaluation reports 17.5939849624% accuracy across seven HAM10000 diagnostic classes. The model produces eight output classes; `normal_skin` is not a HAM10000 ground-truth class and was therefore excluded from the seven-class accuracy calculation. The evaluation also records per-class precision, recall, F1 scores, supports, a confusion matrix, and 1,995 case-level predictions.

The evaluation artifacts are versioned through recorded SHA-256 hashes for the model, test manifest, case predictions, and metrics file. The evaluation configuration records the dataset, class mapping, split method, random state, test-set size, and model output structure.

The historical 72% accuracy claim cannot be independently reproduced from the recovered project artifacts. The original training dataset/version, training split and grouping procedure, training configuration, preprocessing history, training run, and original case-level predictions required to establish that result are not available in the recovered repository.

Accordingly, the historical 72% result is treated as unverified and is not presented as the recovered model's validated performance. The 17.59% result is specifically the result of the documented recovery evaluation and should not be represented as the original training result.

Any future model-performance claim should use a frozen dataset and patient/lesion-independent evaluation protocol and retain the dataset/version, split manifest, model hash, code commit, preprocessing configuration, random seeds, case-level predictions, confusion matrix, and per-class metrics. Any claimed improvement from class balancing should be supported by directly comparable pre- and post-balancing evaluations using the same locked protocol; otherwise the improvement claim should be removed.

## A06 — Prediction Endpoint Latency Evidence

The recovered project includes a documented local endpoint latency measurement for `POST /api/predict`. The test used HAM10000 image `ISIC_0024306.jpg` and 10 consecutive requests to the local Flask development server at `127.0.0.1:5000`.

The measurement boundary covers the HTTP request, image upload/request handling, image validation and preprocessing, model inference, and response generation. All 10 requests returned HTTP 200.

| Metric | Result |
|---|---:|
| Runs | 10 |
| Successful requests | 10/10 |
| Mean | ~0.184 s |
| Median (P50) | ~0.172 s |
| P95 | ~0.291 s |
| Minimum | 0.099 s |
| Maximum | 0.318 s |
| CPU | 12th Gen Intel(R) Core(TM) i5-12450H |
| Python | 3.10.11 |
| TensorFlow | 2.15.0 |

The raw measurements are preserved in `evaluation/a06_endpoint_timings.csv`, with the protocol and interpretation documented in `evaluation/a06_latency_evidence.md`.

These measurements represent the local development environment only. They do not measure production infrastructure or internet/network latency. The historical 7-second prediction-time statement is therefore not treated as independently verified because its original measurement protocol, repetitions, environment, and raw timings were not preserved.

The measured latency should be reported together with its measurement boundary and environment rather than as a general production performance claim.

