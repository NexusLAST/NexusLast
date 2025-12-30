import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDemoUser } from "@/contexts/DemoUserContext";

// Mock events for today (demo mode)
const mockTodayEvents = [
  {
    id: "today-1",
    title: "React Workshop",
    time: "14:00",
    location: "Levent, İstanbul",
  },
  {
    id: "today-2",
    title: "Coffee Networking",
    time: "18:30",
    location: "Cihangir, İstanbul",
  },
];

export function useDailyEventReminder() {
  const { user, isDemo } = useDemoUser();

  useEffect(() => {
    if (!user) return;

    // Check if reminder was already shown today
    const today = new Date().toISOString().split("T")[0];
    const lastReminderDate = localStorage.getItem("lastEventReminderDate");

    if (lastReminderDate === today) {
      return; // Already showed reminder today
    }

    // Show reminder after a short delay (to let app load)
    const timer = setTimeout(() => {
      if (isDemo) {
        // Demo mode: show mock events
        if (mockTodayEvents.length > 0) {
          toast({
            title: "🔔 Bugün " + mockTodayEvents.length + " etkinliğiniz var!",
            description: mockTodayEvents
              .map((event) => `• ${event.title} (${event.time})`)
              .join("\n"),
            duration: 8000, // Show for 8 seconds
          });

          // Mark reminder as shown for today
          localStorage.setItem("lastEventReminderDate", today);
        }
      } else {
        // Real Supabase integration would go here
        // Query events for today and show reminder
        checkTodayEventsFromDatabase();
      }
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, [user, isDemo]);

  const checkTodayEventsFromDatabase = async () => {
    try {
      // This would be real Supabase query in production
      // const today = new Date().toISOString().split('T')[0];
      // const { data: events } = await supabase
      //   .from('user_events')
      //   .select(`
      //     events!inner(
      //       title,
      //       date,
      //       time,
      //       location
      //     )
      //   `)
      //   .eq('user_id', user?.id)
      //   .eq('events.date', today)
      //   .eq('status', 'accepted');

      // For now, fallback to demo behavior
      const today = new Date().toISOString().split("T")[0];
      const todayEvents = mockTodayEvents;

      if (todayEvents.length > 0) {
        toast({
          title: `🔔 Bugün ${todayEvents.length} etkinliğiniz var!`,
          description: todayEvents
            .map((event) => `• ${event.title} (${event.time})`)
            .join("\n"),
          duration: 8000,
        });

        localStorage.setItem("lastEventReminderDate", today);
      }
    } catch (error) {
      console.error("Error checking today events:", error);
    }
  };
}
