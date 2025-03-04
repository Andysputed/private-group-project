import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DoctorAvailability } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import { Clock } from "lucide-react";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorAvailabilityPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: availability } = useQuery<DoctorAvailability[]>({
    queryKey: [`/api/availability/${user?.id}`],
    enabled: !!user?.id,
  });

  const setAvailabilityMutation = useMutation({
    mutationFn: async (data: { dayOfWeek: number; startTime: string; endTime: string }) => {
      const res = await apiRequest("POST", "/api/availability", {
        ...data,
        doctorId: user?.id,
        isAvailable: true,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/availability/${user?.id}`] });
      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
    },
  });

  const handleSetAvailability = (dayOfWeek: number, startTime: string, endTime: string) => {
    setAvailabilityMutation.mutate({ dayOfWeek, startTime, endTime });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <Navbar />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Set Your Availability
          </h1>
          <p className="text-slate-600">Configure your weekly schedule for patient appointments</p>
        </div>

        <div className="grid gap-6">
          {DAYS_OF_WEEK.map((day, index) => {
            const dayAvailability = availability?.find(a => a.dayOfWeek === index);
            
            return (
              <Card key={day} className="bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{day}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">Start Time</label>
                      <Input
                        type="time"
                        defaultValue={dayAvailability?.startTime || "09:00"}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        id={`start-${day}`}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">End Time</label>
                      <Input
                        type="time"
                        defaultValue={dayAvailability?.endTime || "17:00"}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        id={`end-${day}`}
                      />
                    </div>
                    <Button
                      className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                      onClick={() => {
                        const startTime = (document.getElementById(`start-${day}`) as HTMLInputElement).value;
                        const endTime = (document.getElementById(`end-${day}`) as HTMLInputElement).value;
                        handleSetAvailability(index, startTime, endTime);
                      }}
                    >
                      Set Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
