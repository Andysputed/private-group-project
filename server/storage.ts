import { IStorage } from "./types";
import { User, Appointment, DoctorAvailability, InsertUser, InsertAppointment, InsertDoctorAvailability } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private doctorAvailability: Map<number, DoctorAvailability>;
  public sessionStore: session.Store;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.doctorAvailability = new Map();
    this.currentId = { users: 1, appointments: 1, doctorAvailability: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDoctors(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'doctor'
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId.appointments++;
    const newAppointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.doctorId === doctorId
    );
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.patientId === patientId
    );
  }

  async updateAppointment(id: number, update: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) throw new Error('Appointment not found');
    const updated = { ...appointment, ...update };
    this.appointments.set(id, updated);
    return updated;
  }

  async setDoctorAvailability(availability: InsertDoctorAvailability): Promise<DoctorAvailability> {
    const id = this.currentId.doctorAvailability++;
    const newAvailability = { ...availability, id };
    this.doctorAvailability.set(id, newAvailability);
    return newAvailability;
  }

  async getDoctorAvailability(doctorId: number): Promise<DoctorAvailability[]> {
    return Array.from(this.doctorAvailability.values()).filter(
      (avail) => avail.doctorId === doctorId
    );
  }
}

export const storage = new MemStorage();
