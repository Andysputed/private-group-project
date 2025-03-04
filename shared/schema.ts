import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const UserRole = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  ADMIN: 'admin'
} as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: Object.values(UserRole) }).notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  specialization: text("specialization"), // For doctors
  medicalHistory: text("medical_history") // For patients
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id),
  doctorId: integer("doctor_id").references(() => users.id),
  dateTime: timestamp("date_time").notNull(),
  status: text("status", { enum: ['scheduled', 'cancelled', 'completed'] }).notNull(),
  type: text("type", { enum: ['in-person', 'teleconsultation'] }).notNull(),
  notes: text("notes"),
  isEmergency: boolean("is_emergency").default(false)
});

export const doctorAvailability = pgTable("doctor_availability", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => users.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: text("start_time").notNull(), // HH:mm format
  endTime: text("end_time").notNull(), // HH:mm format
  isAvailable: boolean("is_available").default(true)
});

export const insertUserSchema = createInsertSchema(users).extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertDoctorAvailabilitySchema = createInsertSchema(doctorAvailability);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type DoctorAvailability = typeof doctorAvailability.$inferSelect;
export type InsertDoctorAvailability = typeof doctorAvailability.$inferInsert;
