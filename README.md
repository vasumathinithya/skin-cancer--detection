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
