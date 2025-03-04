import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, LayoutDashboard, LogOut, User, Clock } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-xl flex items-center hover:opacity-80 transition-opacity">
            <CalendarDays className="h-6 w-6 mr-2 text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ClinicFlow
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link href="/" className="space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link href="/appointments" className="space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Appointments</span>
              </Link>
            </Button>
            {user?.role === 'doctor' && (
              <Button variant="ghost" className="hover:bg-primary/10" asChild>
                <Link href="/availability" className="space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Set Availability</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 transition-all duration-200 hover:ring-2 hover:ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem className="flex items-center space-x-2" disabled>
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">{user?.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
              <span className="capitalize">{user?.role}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}