/**
 * Hook for post-event thank you and rating reminder
 * Feature 5: Post-Event Thank You + Rating Reminder
 */

import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDemoUser } from "@/contexts/DemoUserContext";

interface UserEvent {
  id: string;
  title: string;
  date: string;
  status: "accepted" | "pending" | "rejected";
}

const SHOWN_REMINDERS_KEY = "nexus-shown-reminders";

export function usePostEventReminder(userEvents: UserEvent[]) {
  const { user, isDemo } = useDemoUser();

  useEffect(() => {
    if (!user || !isDemo) return;

    const checkForCompletedEvents = () => {
      const now = new Date();
      const shownReminders = JSON.parse(
        localStorage.getItem(SHOWN_REMINDERS_KEY) || "[]",
      );

      const completedEvents = userEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const isCompleted = eventDate < now;
        const isAccepted = event.status === "accepted";
        const notShownBefore = !shownReminders.includes(event.id);

        // For demo: consider events from the last 24 hours as "just completed"
        const hoursSinceEvent =
          (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60);
        const isRecentlyCompleted = hoursSinceEvent > 0 && hoursSinceEvent < 24;

        return (
          isCompleted && isAccepted && notShownBefore && isRecentlyCompleted
        );
      });

      completedEvents.forEach((event) => {
        // Show thank you toast
        toast({
          title: "🎉 Thanks for attending!",
          description: `Don't forget to rate "${event.title}" ⭐`,
          duration: 8000,
        });

        // Mark as shown
        const updatedShownReminders = [...shownReminders, event.id];
        localStorage.setItem(
          SHOWN_REMINDERS_KEY,
          JSON.stringify(updatedShownReminders),
        );
      });
    };

    // Check immediately and then every 30 minutes
    checkForCompletedEvents();
    const interval = setInterval(checkForCompletedEvents, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userEvents, user, isDemo]);

  // Manual trigger for demo purposes
  const triggerDemoReminder = (eventTitle: string) => {
    toast({
      title: "🎉 Thanks for attending!",
      description: `Don't forget to rate "${eventTitle}" ⭐`,
      duration: 8000,
    });
  };

  return { triggerDemoReminder };
}
