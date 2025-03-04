import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { UserRole } from "@shared/schema";

function checkRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Doctor routes
  app.get("/api/doctors", async (_req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  // Appointment routes
  app.post("/api/appointments", checkRole([UserRole.PATIENT, UserRole.RECEPTIONIST]), async (req, res) => {
    const appointment = await storage.createAppointment(req.body);
    res.status(201).json(appointment);
  });

  app.get("/api/appointments/doctor/:id", checkRole([UserRole.DOCTOR, UserRole.ADMIN]), async (req, res) => {
    const appointments = await storage.getAppointmentsByDoctor(parseInt(req.params.id));
    res.json(appointments);
  });

  app.get("/api/appointments/patient/:id", checkRole([UserRole.PATIENT, UserRole.RECEPTIONIST]), async (req, res) => {
    const appointments = await storage.getAppointmentsByPatient(parseInt(req.params.id));
    res.json(appointments);
  });

  app.patch("/api/appointments/:id", checkRole([UserRole.PATIENT, UserRole.RECEPTIONIST]), async (req, res) => {
    const appointment = await storage.updateAppointment(parseInt(req.params.id), req.body);
    res.json(appointment);
  });

  // Doctor availability routes
  app.post("/api/availability", checkRole([UserRole.DOCTOR, UserRole.ADMIN]), async (req, res) => {
    const availability = await storage.setDoctorAvailability(req.body);
    res.status(201).json(availability);
  });

  app.get("/api/availability/:doctorId", async (req, res) => {
    const availability = await storage.getDoctorAvailability(parseInt(req.params.doctorId));
    res.json(availability);
  });

  const httpServer = createServer(app);
  return httpServer;
}
