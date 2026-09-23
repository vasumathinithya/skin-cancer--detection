from flask import Flask, jsonify, request, session
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sqlite3
import bcrypt
from datetime import datetime
from werkzeug.utils import secure_filename
import numpy as np
import io
from PIL import Image, ImageOps
import tensorflow as tf
from functools import wraps


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

# ============================================================
# ADMIN AUTHENTICATION
# ============================================================

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "").strip()
SECRET_KEY = os.getenv("SECRET_KEY", "").strip()

if not ADMIN_EMAIL or not ADMIN_PASSWORD_HASH or not SECRET_KEY:
    print("WARNING: Admin authentication environment variables are not fully configured.")


# ============================================================
# LOAD ML MODEL
# ============================================================

try:
    if os.path.exists('skin_cancer_model.h5'):
        ml_model = tf.keras.models.load_model('skin_cancer_model.h5')
        print("Real ML Model loaded successfully.")
    else:
        ml_model = None
        print("Real ML Model not found. Run train_model.py first.")

except ImportError:
    ml_model = None
    print("TensorFlow not installed. ML predictions disabled.")

except Exception as e:
    ml_model = None
    print("Error loading ML model:", e)


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)

app.config.update(
    SECRET_KEY=SECRET_KEY,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False
)

# Restricted CORS instead of wildcard *
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

CORS(
    app,
    origins=[FRONTEND_URL],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)


# ============================================================
# DATABASE
# ============================================================

# Use /tmp for SQLite on cloud hosts such as Render
DB_PATH = (
    os.path.join('/tmp', 'skin_cancer.db')
    if os.environ.get('RENDER')
    else 'skin_cancer.db'
)


def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # --------------------------------------------------------
    # Appointments table
    # --------------------------------------------------------

    c.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientName TEXT,
            patientEmail TEXT,
            doctorName TEXT,
            date TEXT,
            time TEXT,
            location TEXT,
            status TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # --------------------------------------------------------
    # Users table
    # --------------------------------------------------------

    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # --------------------------------------------------------
    # Safe migration:
    # Add phone column if old database does not have it
    # --------------------------------------------------------

    try:
        c.execute('ALTER TABLE users ADD COLUMN phone TEXT')
    except sqlite3.OperationalError:
        pass

    # --------------------------------------------------------
    # Scans table
    # --------------------------------------------------------

    c.execute('''
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            user_name TEXT,
            disease_name TEXT,
            category TEXT,
            severity TEXT,
            confidence TEXT,
            scan_type TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()


init_db()


# ============================================================
# PASSWORD SECURITY
# ============================================================

def hash_password(password):
    """
    Securely hash a password using bcrypt.

    bcrypt automatically generates a unique salt for every
    password.
    """
    return bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')


def verify_password(password, password_hash):
    """
    Verify a plain-text password against a bcrypt hash.
    """
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'),
            password_hash.encode('utf-8')
        )
    except (ValueError, TypeError):
        return False


# ============================================================
# HEALTH
# ============================================================

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "online",
        "app": "Skin Cancer Detection Backend",
        "version": "2.0.0"
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Python Backend (SQLite) is running!"
    })


# ============================================================
# AUTHENTICATION
# ============================================================

@app.route('/api/register', methods=['POST'])
def register():

    data = request.get_json(silent=True) or {}

    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')

    # --------------------------------------------------------
    # Required field validation
    # --------------------------------------------------------

    if not name or not email or not phone or not password:
        return jsonify({
            "error": "All fields (Name, Email, Phone, Password) are required"
        }), 400

    # --------------------------------------------------------
    # Phone validation
    # --------------------------------------------------------

    if not phone.isdigit() or len(phone) != 10:
        return jsonify({
            "error": "Invalid phone number"
        }), 400

    # --------------------------------------------------------
    # Password validation
    # --------------------------------------------------------

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long"
        }), 400

    try:

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()

        # Secure bcrypt password hash
        password_hash = hash_password(password)

        c.execute(
            '''
            INSERT INTO users
            (name, email, phone, password_hash)
            VALUES (?, ?, ?, ?)
            ''',
            (
                name,
                email,
                phone,
                password_hash
            )
        )

        conn.commit()
        conn.close()

        return jsonify({
            "message": "User registered successfully",
            "user": {
                "name": name,
                "email": email,
                "phone": phone
            }
        }), 201

    except sqlite3.IntegrityError:

        return jsonify({
            "error": "Email already registered"
        }), 409

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# LOGIN
# ============================================================

@app.route('/api/login', methods=['POST'])
def login():

    data = request.get_json(silent=True) or {}

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    try:

        conn = sqlite3.connect(DB_PATH)

        conn.row_factory = sqlite3.Row

        c = conn.cursor()

        # ----------------------------------------------------
        # Find user by email only
        # ----------------------------------------------------

        c.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        )

        user = c.fetchone()

        conn.close()

        # ----------------------------------------------------
        # Verify bcrypt password
        # ----------------------------------------------------

        if user and verify_password(
            password,
            user['password_hash']
        ):

            return jsonify({
                "message": "Login successful",
                "user": {
                    "name": user['name'],
                    "email": user['email']
                }
            }), 200

        return jsonify({
            "error": "Invalid email or password"
        }), 401

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# SCANS
# ============================================================

@app.route('/api/scans', methods=['POST'])
def save_scan():

    data = request.get_json(silent=True) or {}

    try:

        conn = sqlite3.connect(DB_PATH)

        c = conn.cursor()

        c.execute(
            '''
            INSERT INTO scans
            (
                user_email,
                user_name,
                disease_name,
                category,
                severity,
                confidence,
                scan_type
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                data.get('user_email', 'anonymous'),
                data.get('user_name', 'Guest'),
                data.get('disease_name'),
                data.get('category'),
                data.get('severity'),
                data.get('confidence'),
                data.get('scan_type', 'upload')
            )
        )

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Scan saved"
        }), 201

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@app.route('/api/scans', methods=['GET'])
def get_scans():

    conn = sqlite3.connect(DB_PATH)

    conn.row_factory = sqlite3.Row

    c = conn.cursor()

    c.execute(
        "SELECT * FROM scans ORDER BY created_at DESC"
    )

    rows = c.fetchall()

    conn.close()

    return jsonify([
        dict(row)
        for row in rows
    ])


# ============================================================
# ML PREDICTION
# ============================================================

@app.route('/api/predict', methods=['POST'])
def predict_skin_disease():

    if 'image' not in request.files:
        return jsonify({
            "error": "No image part in request"
        }), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({
            "error": "No selected file"
        }), 400

    if not ml_model:

        return jsonify({
            "error": "The Machine Learning model is not trained/loaded yet.",
            "instructions": "Please run train_model.py to train the real dataset model and generate skin_cancer_model.h5."
        }), 503

    try:

        # ----------------------------------------------------
        # Read uploaded image
        # ----------------------------------------------------

        img_bytes = file.read()

        if not img_bytes:
            return jsonify({
                "status": "invalid",
                "message": "Empty image file.",
                "image_type": "Rejected",
                "prediction": "Invalid format",
                "confidence": "0%"
            }), 400

        # ----------------------------------------------------
        # Classes
        # ----------------------------------------------------

        classes = [
            "actinic_keratosis",
            "basal_cell_carcinoma",
            "benign_keratosis",
            "dermatofibroma",
            "melanocytic_nevus",
            "melanoma",
            "normal_skin",
            "vascular_lesion"
        ]

        code_to_id = {
            "actinic_keratosis": 5,
            "basal_cell_carcinoma": 4,
            "benign_keratosis": 3,
            "dermatofibroma": 7,
            "melanocytic_nevus": 1,
            "melanoma": 2,
            "normal_skin": 8,
            "vascular_lesion": 6
        }

        # ----------------------------------------------------
        # Image preprocessing
        # ----------------------------------------------------

        try:

            img = Image.open(
                io.BytesIO(img_bytes)
            )

            img = ImageOps.exif_transpose(img)

            img = img.convert('RGB')

            # Reject very small images
            if img.size[0] < 50 or img.size[1] < 50:

                raise ValueError("Image too small")

            # Resize to model input
            img = img.resize((224, 224))

        except Exception:

            return jsonify({
                "status": "invalid",
                "message": "Invalid image format. Please upload a clear skin image.",
                "image_type": "Rejected",
                "prediction": "Invalid format",
                "confidence": "0%"
            }), 400

        # ----------------------------------------------------
        # IMAGE VALIDATION
        # ----------------------------------------------------

        img_arr_raw = np.array(img).astype(float)

        r = img_arr_raw[:, :, 0]
        g = img_arr_raw[:, :, 1]
        b = img_arr_raw[:, :, 2]

        # ----------------------------------------------------
        # Step 1: Basic skin-color validation
        # ----------------------------------------------------

        skin_mask = (
            (r > 50)
            & (g > 30)
            & (b > 10)
            & (r > g)
            & (r > b)
            & (np.abs(r - g) > 15)
            & (
                np.maximum(
                    np.maximum(r, g),
                    b
                )
                -
                np.minimum(
                    np.minimum(r, g),
                    b
                )
                > 15
            )
        )

        skin_ratio = (
            np.sum(skin_mask)
            /
            (224 * 224)
        )

        if skin_ratio < 0.20:

            return jsonify({
                "status": "invalid",
                "message": "This image does not contain human skin. Please upload a close-up image of a skin area.",
                "image_type": "Rejected",
                "prediction": "Not human skin",
                "confidence": "0%"
            }), 400

        # ----------------------------------------------------
        # Step 2: Image quality validation
        # ----------------------------------------------------

        lum = (
            0.299 * r
            + 0.587 * g
            + 0.114 * b
        )

        contrast = (
            np.percentile(lum, 95)
            -
            np.percentile(lum, 5)
        )

        from scipy.signal import convolve2d

        laplacian_kernel = np.array([
            [0, 1, 0],
            [1, -4, 1],
            [0, 1, 0]
        ])

        lap_var = np.var(
            convolve2d(
                lum,
                laplacian_kernel,
                mode='valid'
            )
        )

        median_lum = np.median(lum)

        pigment_mask = (
            np.abs(lum - median_lum) > 30
        )

        cluster_ratio = (
            np.sum(pigment_mask)
            /
            (224 * 224)
        )

        # Reject blurry / uniform images
        if (
            lap_var < 10
            or (
                lap_var < 20
                and cluster_ratio < 0.01
                and contrast < 20
            )
        ):

            return jsonify({
                "status": "invalid",
                "message": "Image is too blurry or uniform. Please upload a clear image of a skin area.",
                "image_type": "Rejected",
                "prediction": "Poor image quality",
                "confidence": "0%"
            }), 400

        # ----------------------------------------------------
        # Neural Network Prediction
        # ----------------------------------------------------

        img_array = tf.keras.preprocessing.image.img_to_array(img)

        img_array = np.expand_dims(
            img_array,
            axis=0
        ) / 255.0

        raw_predictions = ml_model.predict(
            img_array,
            verbose=0
        )[0]

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        class_idx = int(
            np.argmax(raw_predictions)
        )

        confidence = float(
            raw_predictions[class_idx]
        )

        predicted_class_code = classes[class_idx]

        # ----------------------------------------------------
        # Debug information
        # ----------------------------------------------------

        print("====== PREDICTION DEBUG LOGS ======")

        print(
            f"Prediction probabilities: {raw_predictions}"
        )

        print(
            f"Predicted class index: {class_idx}"
        )

        print(
            f"Predicted class name: {predicted_class_code}"
        )

        print(
            f"Confidence value: {confidence:.4f}"
        )

        print(
            "==================================="
        )

        # ----------------------------------------------------
        # Condition
        # ----------------------------------------------------

        condition = (
            "Cancer"
            if predicted_class_code == "melanoma"
            else "Non-Cancer"
        )

        category_id = code_to_id.get(
            predicted_class_code,
            1
        )

        display_confidence_percentage = (
            f"{round(confidence * 100, 1)}%"
        )

        is_normal = (
            predicted_class_code
            ==
            "normal_skin"
        )

        # ----------------------------------------------------
        # Final response
        # ----------------------------------------------------

        return jsonify({

            "status": "success",

            "message":
                "No skin lesion detected. This appears to be normal skin."
                if is_normal
                else
                "Skin condition classification completed.",

            "prediction":
                predicted_class_code,

            "confidence":
                display_confidence_percentage,

            "success":
                True,

            "category_id":
                category_id,

            "image_type":
                "Normal"
                if is_normal
                else
                "Selected",

            "predicted_code":
                predicted_class_code,

            "is_normal":
                is_normal,

            "condition":
                condition
        })

    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# APPOINTMENTS
# ============================================================

@app.route('/api/appointments', methods=['GET'])
def get_appointments():

    conn = sqlite3.connect(DB_PATH)

    conn.row_factory = sqlite3.Row

    c = conn.cursor()

    c.execute(
        "SELECT * FROM appointments ORDER BY created_at DESC"
    )

    rows = c.fetchall()

    conn.close()

    return jsonify([
        dict(row)
        for row in rows
    ])


@app.route('/api/appointments', methods=['POST'])
def create_appointment():

    data = request.get_json(silent=True) or {}

    try:

        conn = sqlite3.connect(DB_PATH)

        c = conn.cursor()

        # ----------------------------------------------------
        # Check whether doctor/time slot is already booked
        # ----------------------------------------------------

        c.execute(
            '''
            SELECT *
            FROM appointments
            WHERE doctorName = ?
            AND date = ?
            AND time = ?
            ''',
            (
                data.get("doctorName"),
                data.get("date"),
                data.get("time")
            )
        )

        if c.fetchone():

            conn.close()

            return jsonify({
                "error": "This appointment slot is already booked."
            }), 409

        # ----------------------------------------------------
        # Create appointment
        # ----------------------------------------------------

        c.execute(
            '''
            INSERT INTO appointments
            (
                patientName,
                patientEmail,
                doctorName,
                date,
                time,
                location,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                data.get("patientName"),
                data.get("patientEmail"),
                data.get("doctorName"),
                data.get("date"),
                data.get("time"),
                data.get("location"),
                "Pending"
            )
        )

        conn.commit()

        conn.close()

        return jsonify({
            "message": "Appointment Created Successfully"
        }), 201

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# ADMIN ANALYTICS
# ============================================================

# ============================================================
# ADMIN AUTHENTICATION
# ============================================================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json(silent=True) or {}

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({
            "success": False,
            "error": "Email and password are required."
        }), 400

    if not ADMIN_EMAIL or not ADMIN_PASSWORD_HASH:
        return jsonify({
            "success": False,
            "error": "Admin authentication is not configured."
        }), 503

    try:
        password_valid = bcrypt.checkpw(
            password.encode('utf-8'),
            ADMIN_PASSWORD_HASH.encode('utf-8')
        )
    except (ValueError, TypeError):
        password_valid = False

    if email != ADMIN_EMAIL or not password_valid:
        return jsonify({
            "success": False,
            "error": "Invalid admin credentials."
        }), 401

    session['is_admin'] = True
    session['admin_email'] = ADMIN_EMAIL

    return jsonify({
        "success": True,
        "message": "Admin login successful."
    }), 200


@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.clear()

    return jsonify({
        "success": True,
        "message": "Admin logged out successfully."
    }), 200


def admin_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        if session.get('is_admin') is not True:
            return jsonify({
                "error": "Admin authentication required."
            }), 401

        return view_function(*args, **kwargs)

    return wrapped_view

@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def admin_stats():

    try:

        conn = sqlite3.connect(DB_PATH)

        conn.row_factory = sqlite3.Row

        c = conn.cursor()

        # ----------------------------------------------------
        # Total users
        # ----------------------------------------------------

        c.execute(
            "SELECT COUNT(*) as count FROM users"
        )

        total_users = c.fetchone()['count']

        # ----------------------------------------------------
        # Total scans
        # ----------------------------------------------------

        c.execute(
            "SELECT COUNT(*) as count FROM scans"
        )

        total_scans = c.fetchone()['count']

        # ----------------------------------------------------
        # Total appointments
        # ----------------------------------------------------

        c.execute(
            "SELECT COUNT(*) as count FROM appointments"
        )

        total_appointments = c.fetchone()['count']

        # ----------------------------------------------------
        # Detection breakdown
        # ----------------------------------------------------

        c.execute(
            '''
            SELECT disease_name, COUNT(*) as count
            FROM scans
            GROUP BY disease_name
            ORDER BY count DESC
            '''
        )

        detection_breakdown = [
            {
                "name": r['disease_name'],
                "count": r['count']
            }
            for r in c.fetchall()
        ]

        # ----------------------------------------------------
        # Weekly scans
        # ----------------------------------------------------

        c.execute(
            '''
            SELECT DATE(created_at) as day,
                   COUNT(*) as count
            FROM scans
            WHERE created_at >= DATE('now', '-7 days')
            GROUP BY DATE(created_at)
            ORDER BY day ASC
            '''
        )

        weekly_raw = {
            r['day']: r['count']
            for r in c.fetchall()
        }

        from datetime import date, timedelta

        weekly_scans = []

        for i in range(6, -1, -1):

            d = (
                date.today()
                -
                timedelta(days=i)
            ).strftime('%Y-%m-%d')

            day_label = (
                date.today()
                -
                timedelta(days=i)
            ).strftime('%a')

            weekly_scans.append({
                "day": day_label,
                "date": d,
                "scans": weekly_raw.get(d, 0)
            })

        # ----------------------------------------------------
        # Severity breakdown
        # ----------------------------------------------------

        c.execute(
            '''
            SELECT severity, COUNT(*) as count
            FROM scans
            GROUP BY severity
            '''
        )

        severity_breakdown = [
            {
                "severity": r['severity'],
                "count": r['count']
            }
            for r in c.fetchall()
        ]

        # ----------------------------------------------------
        # Recent users
        # ----------------------------------------------------

        c.execute(
            '''
            SELECT name, email, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
            '''
        )

        recent_users_raw = c.fetchall()

        recent_users = []

        for u in recent_users_raw:

            c.execute(
                '''
                SELECT COUNT(*) as count
                FROM scans
                WHERE user_email = ?
                ''',
                (u['email'],)
            )

            scan_count = c.fetchone()['count']

            c.execute(
                '''
                SELECT severity
                FROM scans
                WHERE user_email = ?
                ORDER BY created_at DESC
                LIMIT 1
                ''',
                (u['email'],)
            )

            last_scan = c.fetchone()

            risk = (
                last_scan['severity']
                if last_scan
                else
                'N/A'
            )

            recent_users.append({
                "name": u['name'],
                "email": u['email'],
                "joined": u['created_at'],
                "scans": scan_count,
                "risk": risk
            })

        # ----------------------------------------------------
        # Total reports
        # ----------------------------------------------------

        c.execute(
            "SELECT COUNT(*) as count FROM scans"
        )

        total_reports_generated = (
            c.fetchone()['count']
        )

        # ----------------------------------------------------
        # High-risk scans
        # ----------------------------------------------------

        c.execute(
            '''
            SELECT COUNT(*) as count
            FROM scans
            WHERE severity = 'High'
            '''
        )

        high_risk_scans = (
            c.fetchone()['count']
        )

        conn.close()

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return jsonify({

            "total_users":
                total_users,

            "total_scans":
                total_scans,

            "total_appointments":
                total_appointments,

            "total_reports":
                total_reports_generated,

            "detection_breakdown":
                detection_breakdown,

            "weekly_scans":
                weekly_scans,

            "severity_breakdown":
                severity_breakdown,

            "recent_users":
                recent_users,

            "high_risk_count":
                high_risk_scans
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == '__main__':

    port = int(
        os.getenv("PORT", 5000)
    )

    app.run(
        debug=False,
        port=port,
        host='0.0.0.0'
    )