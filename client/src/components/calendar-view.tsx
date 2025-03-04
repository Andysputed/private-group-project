import { Calendar } from "@/components/ui/calendar";
import { Appointment } from "@shared/schema";
import { isSameDay } from "date-fns";

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
}

export default function CalendarView({
  appointments,
  onDateSelect,
  selectedDate,
}: CalendarViewProps) {
  const disabledDays = {
    before: new Date(),
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.dateTime), day));
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateSelect}
      disabled={disabledDays}
      modifiers={{
        booked: appointments.map((apt) => new Date(apt.dateTime)),
      }}
      modifiersStyles={{
        booked: {
          backgroundColor: "var(--primary)",
          color: "white",
        },
      }}
      className="rounded-md border"
    />
  );
}
