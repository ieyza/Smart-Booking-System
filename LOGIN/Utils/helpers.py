from flask import session

def create_admin_session(user_info):
    session['admin_logged_in'] = True
    session['admin_email'] = user_info['email']