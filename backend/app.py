import os
import sqlite3
from flask import Flask, jsonify, redirect, url_for, session, send_file
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

# =========================================================
# 🔐 SESSION CONFIG
# =========================================================
app.secret_key = "smart-booking-secret-key"


# =========================================================
# 🔐 GOOGLE OAUTH SETUP
# =========================================================
oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)


# =========================================================
# 🗄️ INIT DATABASE
# =========================================================
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admin (
        admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        last_login DATETIME
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rooms (
        room_id TEXT PRIMARY KEY,
        room_name TEXT NOT NULL,
        capacity INTEGER
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER,
        room_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        date DATE NOT NULL,
        time_from TIME NOT NULL,
        time_to TIME NOT NULL,
        booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
        FOREIGN KEY (room_id) REFERENCES rooms(room_id)
    )
    """)

    conn.commit()
    conn.close()

    print("DATABASE INITIALISED ✔")


# =========================================================
# 🏠 HOME (LANDING PAGE)
# =========================================================
@app.route("/")
def landing():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, "..", "LANDING-PAGE", "index.html")

    print("DEBUG PATH:", file_path)

    return send_file(file_path)


# =========================================================
# 🔐 LOGIN PAGE (USING YOUR OWN FILE)
# =========================================================
@app.route("/login-page")
def login_page():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.abspath(
        os.path.join(base_dir, "..", "LOGIN", "frontend", "login.html")
    )
    return send_file(file_path)

# =========================================================
# 🔐 GOOGLE OAUTH START
# =========================================================
@app.route("/auth/google")
def login():
    redirect_uri = url_for('callback', _external=True)
    return google.authorize_redirect(redirect_uri)


# =========================================================
# 🔐 GOOGLE CALLBACK
# =========================================================
@app.route("/callback")
def callback():
    token = google.authorize_access_token()
    user = token.get('userinfo')

    user_email = user['email']

    # ==============================
    # 🗄️ SAVE USER (FIRST TIME ONLY)
    # ==============================
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR IGNORE INTO admin (email)
        VALUES (?)
    """, (user_email,))

    conn.commit()
    conn.close()

    # ==============================
    # 🔐 CREATE SESSION (EVERY LOGIN)
    # ==============================
    session['admin_logged_in'] = True
    session['admin_email'] = user_email

    # ==============================
    # 🚀 REDIRECT TO DASHBOARD
    # ==============================
    return redirect("/admin-dashboard")

# =========================================================
# 🔐 ADMIN DASHBOARD (PROTECTED)
# =========================================================
@app.route("/admin-dashboard")
def admin_dashboard():

    if not session.get("admin_logged_in"):
        return redirect("/login-page")

    return f"""
    <h1>Admin Dashboard</h1>
    <p>Welcome {session.get('admin_email')}</p>
    <a href="/logout">Logout</a>
    """


# =========================================================
# 🚪 LOGOUT
# =========================================================
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login-page")


# =========================================================
# 📦 ROOMS API
# =========================================================
@app.route("/rooms")
def get_rooms():

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("SELECT room_id, room_name, capacity FROM rooms")
    rows = cursor.fetchall()

    conn.close()

    return jsonify([
        {
            "room_id": r[0],
            "room_name": r[1],
            "capacity": r[2]
        }
        for r in rows
    ])


# =========================================================
# ▶️ START APP
# =========================================================
if __name__ == "__main__":
    init_db()
    app.run(debug=True)