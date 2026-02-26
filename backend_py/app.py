from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pymongo
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)
CORS(app)

import sqlite3

def init_db():
    conn = sqlite3.connect('skin_cancer.db')
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

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Python Backend (SQLite) is running!"})

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    conn = sqlite3.connect('skin_cancer.db')
    conn.row_factory = sqlite3.Row # Return rows as dictionaries
    c = conn.cursor()
    c.execute("SELECT * FROM appointments")
    rows = c.fetchall()
    conn.close()
    
    # Convert Row objects to list of dicts
    appointments = [dict(row) for row in rows]
    return jsonify(appointments)

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    try:
        conn = sqlite3.connect('skin_cancer.db')
        c = conn.cursor()
        c.execute("INSERT INTO appointments (patientName, patientEmail, doctorName, date, time, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                  (data.get("patientName"), data.get("patientEmail"), data.get("doctorName"), 
                   data.get("date"), data.get("time"), data.get("location"), "Pending"))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Appointment Creates Success", "data": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port, host='0.0.0.0')
