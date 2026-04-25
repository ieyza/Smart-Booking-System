from flask import Blueprint, redirect, url_for, session
from service.google_oauth_service import oauth
from utils.session_helper import create_admin_session

auth_bp = Blueprint('auth', __name__)

# 1. LOGIN REDIRECT TO GOOGLE
@auth_bp.route('/login')
def login():
    google = oauth.create_client('google')
    redirect_uri = url_for('auth.callback', _external=True)
    return google.authorize_redirect(redirect_uri)


# 2. CALLBACK FROM GOOGLE
@auth_bp.route('/callback')
def callback():
    google = oauth.create_client('google')
    token = google.authorize_access_token()

    user_info = token['userinfo']

    # create session
    create_admin_session(user_info)

    return redirect('/admin-dashboard')


# 3. LOGOUT
@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect('/')