import bcrypt
from sendgrid.helpers.mail import Mail
from datetime import datetime
from app import sendgrid_client, twilio_client, redis_client
import os

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def send_email_notification(to_email: str, subject: str, content: str):
    message = Mail(
        from_email=os.getenv('SENDGRID_FROM_EMAIL'),
        to_emails=to_email,
        subject=subject,
        html_content=content
    )
    try:
        sendgrid_client.send(message)
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

def send_sms_notification(to_phone: str, message: str):
    try:
        twilio_client.messages.create(
            body=message,
            from_=os.getenv('TWILIO_PHONE_NUMBER'),
            to=to_phone
        )
        return True
    except Exception as e:
        print(f"Failed to send SMS: {str(e)}")
        return False

def cache_doctor_availability(doctor_id: str, date: datetime, available: bool):
    key = f"availability:{doctor_id}:{date.strftime('%Y-%m-%d')}"
    redis_client.setex(key, 86400, str(available))  # Cache for 24 hours

def get_cached_availability(doctor_id: str, date: datetime) -> bool:
    key = f"availability:{doctor_id}:{date.strftime('%Y-%m-%d')}"
    cached = redis_client.get(key)
    return cached.decode('utf-8') == 'True' if cached else None
