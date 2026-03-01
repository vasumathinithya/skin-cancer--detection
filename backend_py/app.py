from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sqlite3
import hashlib
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

# Use /tmp for SQLite on cloud hosts (Render, Railway etc.)
DB_PATH = os.path.join('/tmp', 'skin_cancer.db') if os.environ.get('RENDER') else 'skin_cancer.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Appointments table
    c.execute('''CREATE TABLE IF NOT EXISTS appointments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  patientName TEXT, patientEmail TEXT,
                  doctorName TEXT, date TEXT, time TEXT,
                  location TEXT, status TEXT,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP)''')

    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP)''')

    # Scans table — stores every AI detection result
    c.execute('''CREATE TABLE IF NOT EXISTS scans
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_email TEXT,
                  user_name TEXT,
                  disease_name TEXT,
                  category TEXT,
                  severity TEXT,
                  confidence TEXT,
                  scan_type TEXT,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP)''')

    conn.commit()
    conn.close()

init_db()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ── Health ────────────────────────────────────────────────────────────
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "✅ online", "app": "Skin Cancer Detection Backend", "version": "2.0.0"})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Python Backend (SQLite) is running!"})

# ── Auth ──────────────────────────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                  (name, email, hash_password(password)))
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully", "user": {"name": name, "email": email}}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE email = ? AND password_hash = ?",
                  (email, hash_password(password)))
        user = c.fetchone()
        conn.close()

        if user:
            return jsonify({"message": "Login successful", "user": {"name": user['name'], "email": user['email']}}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Scans ─────────────────────────────────────────────────────────────
@app.route('/api/scans', methods=['POST'])
def save_scan():
    data = request.json
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO scans (user_email, user_name, disease_name, category, severity, confidence, scan_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                data.get('user_email', 'anonymous'),
                data.get('user_name', 'Guest'),
                data.get('disease_name'),
                data.get('category'),
                data.get('severity'),
                data.get('confidence'),
                data.get('scan_type', 'upload'),
            )
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Scan saved"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scans', methods=['GET'])
def get_scans():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM scans ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

# ── Appointments ──────────────────────────────────────────────────────
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM appointments ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

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
        return jsonify({"message": "Appointment Created Successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Admin Analytics ───────────────────────────────────────────────────
@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        # Total users
        c.execute("SELECT COUNT(*) as count FROM users")
        total_users = c.fetchone()['count']

        # Total scans
        c.execute("SELECT COUNT(*) as count FROM scans")
        total_scans = c.fetchone()['count']

        # Total appointments
        c.execute("SELECT COUNT(*) as count FROM appointments")
        total_appointments = c.fetchone()['count']

        # Detection breakdown by disease
        c.execute("SELECT disease_name, COUNT(*) as count FROM scans GROUP BY disease_name ORDER BY count DESC")
        detection_breakdown = [{"name": r['disease_name'], "count": r['count']} for r in c.fetchall()]

        # Weekly scans (last 7 days)
        c.execute("""
            SELECT DATE(created_at) as day, COUNT(*) as count
            FROM scans
            WHERE created_at >= DATE('now', '-7 days')
            GROUP BY DATE(created_at)
            ORDER BY day ASC
        """)
        weekly_raw = {r['day']: r['count'] for r in c.fetchall()}

        # Fill in all 7 days even if no scans
        from datetime import date, timedelta
        weekly_scans = []
        for i in range(6, -1, -1):
            d = (date.today() - timedelta(days=i)).strftime('%Y-%m-%d')
            day_label = (date.today() - timedelta(days=i)).strftime('%a')
            weekly_scans.append({"day": day_label, "date": d, "scans": weekly_raw.get(d, 0)})

        # Severity breakdown
        c.execute("SELECT severity, COUNT(*) as count FROM scans GROUP BY severity")
        severity_breakdown = [{"severity": r['severity'], "count": r['count']} for r in c.fetchall()]

        # Recent users
        c.execute("SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 10")
        recent_users_raw = c.fetchall()

        recent_users = []
        for u in recent_users_raw:
            c.execute("SELECT COUNT(*) as count FROM scans WHERE user_email = ?", (u['email'],))
            scan_count = c.fetchone()['count']

            c.execute("SELECT severity FROM scans WHERE user_email = ? ORDER BY created_at DESC LIMIT 1", (u['email'],))
            last_scan = c.fetchone()
            risk = last_scan['severity'] if last_scan else 'N/A'

            recent_users.append({
                "name": u['name'],
                "email": u['email'],
                "joined": u['created_at'],
                "scans": scan_count,
                "risk": risk
            })

        # Report downloads approximation (scans where severity is High = likely downloaded)
        c.execute("SELECT COUNT(*) as count FROM scans WHERE severity = 'High'")
        high_risk_scans = c.fetchone()['count']

        conn.close()

        return jsonify({
            "total_users": total_users,
            "total_scans": total_scans,
            "total_appointments": total_appointments,
            "total_reports": int(total_scans * 0.72),  # Approximation
            "detection_breakdown": detection_breakdown,
            "weekly_scans": weekly_scans,
            "severity_breakdown": severity_breakdown,
            "recent_users": recent_users,
            "high_risk_count": high_risk_scans,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=False, port=port, host='0.0.0.0')
