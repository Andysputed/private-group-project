import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const registerForm = useForm<InsertUser>({
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

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to ClinicFlow</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="login-username">Username</Label>
                      <Input id="login-username" {...loginForm.register("username")} />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" type="password" {...loginForm.register("password")} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" {...registerForm.register("name")} />
                    </div>
                    <div>
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" {...registerForm.register("email")} />
                    </div>
                    <div>
                      <Label htmlFor="reg-username">Username</Label>
                      <Input id="reg-username" {...registerForm.register("username")} />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" {...registerForm.register("password")} />
                    </div>
                    <div>
                      <Label htmlFor="reg-confirm">Confirm Password</Label>
                      <Input id="reg-confirm" type="password" {...registerForm.register("confirmPassword")} />
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Phone (optional)</Label>
                      <Input id="reg-phone" {...registerForm.register("phone")} />
                    </div>
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "Creating Account..." : "Register"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:flex flex-col justify-center p-8 bg-primary/5">
        <div className="max-w-md mx-auto">
          <CalendarDays className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-4">Streamlined Healthcare Scheduling</h2>
          <p className="text-muted-foreground">
            Efficiently manage your medical appointments with our integrated scheduling system.
            Book consultations, track appointments, and receive timely reminders all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
