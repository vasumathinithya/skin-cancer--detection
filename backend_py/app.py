from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sqlite3

load_dotenv()

app = Flask(__name__)

# Allow all origins in production (Vercel frontend + any device)
CORS(app, origins="*")

# Use /tmp for SQLite on cloud hosts (Render, Railway etc.)
DB_PATH = os.path.join('/tmp', 'skin_cancer.db') if os.environ.get('RENDER') else 'skin_cancer.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS appointments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  patientName TEXT, patientEmail TEXT, 
                  doctorName TEXT, date TEXT, time TEXT, 
                  location TEXT, status TEXT)''')
    conn.commit()
    conn.close()

# Initialize DB on start
init_db()

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "✅ online",
        "app": "Skin Cancer Detection Backend",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "get_appointments": "GET /api/appointments",
            "create_appointment": "POST /api/appointments"
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Python Backend (SQLite) is running!"})

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM appointments")
    rows = c.fetchall()
    conn.close()
    appointments = [dict(row) for row in rows]
    return jsonify(appointments)

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO appointments (patientName, patientEmail, doctorName, date, time, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (data.get("patientName"), data.get("patientEmail"), data.get("doctorName"),
             data.get("date"), data.get("time"), data.get("location"), "Pending")
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Appointment Created Successfully", "data": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=False, port=port, host='0.0.0.0')
