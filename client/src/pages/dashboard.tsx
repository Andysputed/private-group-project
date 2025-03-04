import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@shared/schema";
import { CalendarCheck, Clock, UserCheck, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: [user?.role === 'doctor' ? `/api/appointments/doctor/${user?.id}` : `/api/appointments/patient/${user?.id}`],
  });

  const stats = {
    upcoming: appointments?.filter(a => a.status === 'scheduled').length || 0,
    completed: appointments?.filter(a => a.status === 'completed').length || 0,
    cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <Navbar />

      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Welcome, {user?.name}
        </h1>
        <p className="text-slate-600 mb-8">Here's an overview of your appointments and activities</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <CalendarCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.upcoming}</div>
              <p className="text-xs text-slate-600">Scheduled appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-slate-600">Past appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">-</div>
              <p className="text-xs text-slate-600">Current patients</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm hover:bg-white transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <p className="text-xs text-slate-600">Cancelled appointments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments?.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="p-4 rounded-lg bg-white border shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {new Date(apt.dateTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(apt.dateTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === 'patient' && (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity" 
                  asChild
                >
                  <Link href="/appointments">Book New Appointment</Link>
                </Button>
              )}
              {user?.role === 'doctor' && (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity" 
                  asChild
                >
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