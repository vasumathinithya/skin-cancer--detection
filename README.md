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

