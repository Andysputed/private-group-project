import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@shared/schema";
import { CalendarCheck, Clock, UserCheck, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: [user?.role === 'doctor' ? `/api/appointments/doctor/${user.id}` : `/api/appointments/patient/${user.id}`],
  });

  const stats = {
    upcoming: appointments?.filter(a => a.status === 'scheduled').length || 0,
    completed: appointments?.filter(a => a.status === 'completed').length || 0,
    cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments?.slice(0, 5).map((apt) => (
                <div key={apt.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(apt.dateTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(apt.dateTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        apt.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === 'patient' && (
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/appointments">Book New Appointment</Link>
                </Button>
              )}
              {user?.role === 'doctor' && (
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/appointments">View Schedule</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
