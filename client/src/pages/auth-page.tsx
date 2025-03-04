import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema, type InsertUser, StaffRole } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const patientForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      name: "",
      role: "patient",
      phone: "",
      medicalHistory: "",
    },
  });

  const staffForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      name: "",
      role: "doctor",
      phone: "",
      specialization: "",
    },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="p-8 flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Welcome to ClinicFlow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username" 
                        {...loginForm.register("username")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        {...loginForm.register("password")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="patient">
                <form onSubmit={patientForm.handleSubmit((data) => registerMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name">Full Name</Label>
                      <Input 
                        id="patient-name" 
                        {...patientForm.register("name")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-email">Email</Label>
                      <Input 
                        id="patient-email" 
                        type="email" 
                        {...patientForm.register("email")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-username">Username</Label>
                      <Input 
                        id="patient-username" 
                        {...patientForm.register("username")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-password">Password</Label>
                      <Input 
                        id="patient-password" 
                        type="password" 
                        {...patientForm.register("password")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-confirm">Confirm Password</Label>
                      <Input 
                        id="patient-confirm" 
                        type="password" 
                        {...patientForm.register("confirmPassword")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-phone">Phone (optional)</Label>
                      <Input 
                        id="patient-phone" 
                        {...patientForm.register("phone")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Register as Patient"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="staff">
                <form onSubmit={staffForm.handleSubmit((data) => registerMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-role">Staff Role</Label>
                      <Select 
                        onValueChange={(value) => staffForm.setValue("role", value)}
                        defaultValue={staffForm.getValues("role")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={StaffRole.DOCTOR}>Doctor</SelectItem>
                          <SelectItem value={StaffRole.RECEPTIONIST}>Receptionist</SelectItem>
                          <SelectItem value={StaffRole.ADMIN}>Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-name">Full Name</Label>
                      <Input 
                        id="staff-name" 
                        {...staffForm.register("name")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-email">Email</Label>
                      <Input 
                        id="staff-email" 
                        type="email" 
                        {...staffForm.register("email")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-username">Username</Label>
                      <Input 
                        id="staff-username" 
                        {...staffForm.register("username")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-password">Password</Label>
                      <Input 
                        id="staff-password" 
                        type="password" 
                        {...staffForm.register("password")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-confirm">Confirm Password</Label>
                      <Input 
                        id="staff-confirm" 
                        type="password" 
                        {...staffForm.register("confirmPassword")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    {staffForm.watch("role") === StaffRole.DOCTOR && (
                      <div className="space-y-2">
                        <Label htmlFor="staff-specialization">Specialization</Label>
                        <Input 
                          id="staff-specialization" 
                          {...staffForm.register("specialization")}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Register as Staff"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-primary/5 to-blue-50">
        <div className="max-w-md mx-auto space-y-6">
          <CalendarDays className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Streamlined Healthcare Scheduling
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Efficiently manage your medical appointments with our integrated scheduling system.
            Book consultations, track appointments, and receive timely reminders all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}