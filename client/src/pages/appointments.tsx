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

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const { data: doctors } = useQuery<User[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: [user?.role === 'doctor' ? `/api/appointments/doctor/${user.id}` : `/api/appointments/patient/${user.id}`],
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
    createAppointmentMutation.mutate({
      patientId: user!.id,
      doctorId,
      dateTime: date.toISOString(),
      status: 'scheduled',
      type: 'in-person',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Appointments</h1>
          {user?.role === 'patient' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Book Appointment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Doctor</label>
                    <select
                      className="w-full p-2 border rounded"
                      onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                    >
                      <option value="">Choose a doctor</option>
                      {doctors?.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedDoctor && (
                    <CalendarView
                      appointments={appointments || []}
                      onDateSelect={setSelectedDate}
                      selectedDate={selectedDate}
                    />
                  )}
                  <Button
                    className="w-full"
                    disabled={!selectedDate || !selectedDoctor}
                    onClick={() => selectedDate && handleBookAppointment(selectedDate, selectedDoctor)}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(appointment.dateTime), "PPP")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.dateTime), "p")}
                    </p>
                    <p className="text-sm">{appointment.type}</p>
                  </div>
                  <div className="space-x-2">
                    {appointment.status === 'scheduled' && (
                      <Button
                        variant="destructive"
                        size="sm"
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
                      className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
