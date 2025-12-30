/**
 * Utility functions for day/night event filtering
 * Feature 6: Day vs Night Event Filter
 */

export type TimeFilter = "all" | "day" | "night";

export interface EventWithTime {
  id: string;
  date: string;
  [key: string]: any;
}

/**
 * Check if an event is during day time (06:00-18:00)
 */
export const isDayEvent = (eventDate: string): boolean => {
  const date = new Date(eventDate);
  const hour = date.getHours();
  console.log(
    "isDayEvent:",
    eventDate,
    "hour:",
    hour,
    "result:",
    hour >= 6 && hour < 18,
  );
  return hour >= 6 && hour < 18;
};

/**
 * Check if an event is during night time (18:01-05:59)
 */
export const isNightEvent = (eventDate: string): boolean => {
  const date = new Date(eventDate);
  const hour = date.getHours();
  console.log(
    "isNightEvent:",
    eventDate,
    "hour:",
    hour,
    "result:",
    hour >= 18 || hour <= 5,
  );
  // Night is from 18:01 (hour 18) to 05:59 (hour 5)
  return hour >= 18 || hour <= 5;
};

/**
 * Filter events based on time of day
 */
export const filterEventsByTime = <T extends EventWithTime>(
  events: T[],
  filter: TimeFilter,
): T[] => {
  switch (filter) {
    case "day":
      return events.filter((event) => isDayEvent(event.date));
    case "night":
      return events.filter((event) => isNightEvent(event.date));
    default:
      return events;
  }
};

/**
 * Get demo times for events (for demo mode)
 */
export const getDemoEventTime = (): string => {
  const hours = [
    "09:00",
    "10:30",
    "14:00",
    "16:00", // Day times
    "19:00",
    "20:30",
    "22:00",
    "23:30", // Night times
  ];
  return hours[Math.floor(Math.random() * hours.length)];
};
