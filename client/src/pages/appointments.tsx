import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Appointment, InsertAppointment, User } from "@shared/schema";
import CalendarView from "@/components/calendar-view";
import Navbar from "@/components/layout/navbar";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const { data: doctors } = useQuery<User[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: [user?.role === 'doctor' ? `/api/appointments/doctor/${user?.id}` : `/api/appointments/patient/${user?.id}`],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: InsertAppointment) => {
      const res = await apiRequest("POST", "/api/appointments", newAppointment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/appointments/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
  });

  const handleBookAppointment = (date: Date, doctorId: number) => {
    if (!user) return;
    createAppointmentMutation.mutate({
      patientId: user.id,
      doctorId,
      dateTime: date,
      status: 'scheduled',
      type: 'in-person',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <Navbar />

      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-slate-600">Manage your appointments and schedules</p>
          </div>
          {user?.role === 'patient' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Book New Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Doctor</label>
                    <select
                      className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                      value={selectedDoctor || ""}
                    >
                      <option value="">Choose a doctor</option>
                      {doctors?.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedDoctor && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Date</label>
                      <div className="border rounded-lg p-4 bg-white">
                        <CalendarView
                          appointments={appointments || []}
                          onDateSelect={setSelectedDate}
                          selectedDate={selectedDate}
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                    disabled={!selectedDate || !selectedDoctor || createAppointmentMutation.isPending}
                    onClick={() => selectedDate && handleBookAppointment(selectedDate, selectedDoctor)}
                  >
                    {createAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Upcoming Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 rounded-lg bg-white border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {format(new Date(appointment.dateTime), "PPP")}
                      </p>
                      <p className="text-sm text-slate-600">
                        {format(new Date(appointment.dateTime), "p")}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {appointment.type}
                      </p>
                    </div>
                    <div className="space-x-2">
                      {appointment.status === 'scheduled' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:opacity-90 transition-opacity"
                          onClick={() =>
                            updateAppointmentMutation.mutate({
                              id: appointment.id,
                              status: 'cancelled',
                            })
                          }
                        >
                          Cancel
                        </Button>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled'
                            ? 'bg-primary/10 text-primary'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!appointments || appointments.length === 0) && (
                <div className="text-center py-8 text-slate-600">
                  No appointments found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}