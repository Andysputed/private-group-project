from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, username, email, name, role, password=None, phone=None, specialization=None, medical_history=None):
        self.username = username
        self.email = email
        self.password = password  # Hashed password will be stored
        self.name = name
        self.role = role  # 'patient', 'doctor', 'receptionist', 'admin'
        self.phone = phone
        self.specialization = specialization  # For doctors
        self.medical_history = medical_history  # For patients
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "phone": self.phone,
            "specialization": self.specialization,
            "medical_history": self.medical_history,
            "created_at": self.created_at
        }

class Appointment:
    def __init__(self, patient_id, doctor_id, date_time, status="scheduled", appointment_type="in-person", notes=None, is_emergency=False):
        self.patient_id = ObjectId(patient_id)
        self.doctor_id = ObjectId(doctor_id)
        self.date_time = date_time
        self.status = status  # 'scheduled', 'cancelled', 'completed'
        self.type = appointment_type
        self.notes = notes
        self.is_emergency = is_emergency
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "patient_id": str(self.patient_id),
            "doctor_id": str(self.doctor_id),
            "date_time": self.date_time,
            "status": self.status,
            "type": self.type,
            "notes": self.notes,
            "is_emergency": self.is_emergency,
            "created_at": self.created_at
        }

class DoctorAvailability:
    def __init__(self, doctor_id, day_of_week, start_time, end_time, is_available=True):
        self.doctor_id = ObjectId(doctor_id)
        self.day_of_week = day_of_week  # 0-6 for Sunday-Saturday
        self.start_time = start_time  # Format: "HH:MM"
        self.end_time = end_time  # Format: "HH:MM"
        self.is_available = is_available

    def to_dict(self):
        return {
            "doctor_id": str(self.doctor_id),
            "day_of_week": self.day_of_week,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "is_available": self.is_available
        }
