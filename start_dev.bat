@echo off
echo Starting Skin Cancer Detection App...

:: Start Backend in a new window
start "Python Backend" cmd /k "cd backend_py && echo Installing requirements... && pip install -r requirements.txt && echo Starting Flask Server... && python app.py"

:: Start Frontend in a new window
start "React Frontend" cmd /k "echo Installing dependencies... && npm install && echo Starting Vite Dev Server... && npm run dev"

echo both servers are starting...
