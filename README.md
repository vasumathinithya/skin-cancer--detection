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
