import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCountdownProps {
  eventDate: string;
  className?: string;
  compact?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function EventCountdown({
  eventDate,
  className,
  compact = false,
}: EventCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const difference = eventTime - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
    };
  };

  useEffect(() => {
    // Calculate initial time
    setTimeRemaining(calculateTimeRemaining());

    // Update every minute (not every second to save performance)
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute

    // Also update every second for the last minute for more accuracy
    const lastMinuteTimer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      if (
        remaining.days === 0 &&
        remaining.hours === 0 &&
        remaining.minutes <= 1
      ) {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(lastMinuteTimer);
    };
  }, [eventDate]);

  const formatTimeText = () => {
    if (timeRemaining.isExpired) {
      return "Etkinlik başladı";
    }

    const parts = [];

    if (timeRemaining.days > 0) {
      parts.push(`${timeRemaining.days} gün`);
    }

    if (timeRemaining.hours > 0) {
      parts.push(`${timeRemaining.hours} saat`);
    }

    if (timeRemaining.days === 0 && timeRemaining.minutes > 0) {
      parts.push(`${timeRemaining.minutes} dakika`);
    }

    // Show seconds only in the last minute
    if (
      timeRemaining.days === 0 &&
      timeRemaining.hours === 0 &&
      timeRemaining.minutes <= 1
    ) {
      return `${timeRemaining.minutes}:${timeRemaining.seconds.toString().padStart(2, "0")} dakika`;
    }

    if (parts.length === 0) {
      return "Az önce başladı";
    }

    if (compact) {
      return parts.slice(0, 2).join(" ");
    }

    return parts.join(" ");
  };

  const getUrgencyColor = () => {
    if (timeRemaining.isExpired) {
      return "text-gray-500 dark:text-gray-400";
    }

    const totalMinutes =
      timeRemaining.days * 24 * 60 +
      timeRemaining.hours * 60 +
      timeRemaining.minutes;

    if (totalMinutes <= 60) {
      // Less than 1 hour
      return "text-red-600 dark:text-red-400";
    } else if (totalMinutes <= 24 * 60) {
      // Less than 1 day
      return "text-orange-600 dark:text-orange-400";
    } else if (totalMinutes <= 7 * 24 * 60) {
      // Less than 1 week
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-green-600 dark:text-green-400";
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1 text-sm",
          getUrgencyColor(),
          className,
        )}
      >
        <Clock className="h-3 w-3" />
        <span>⏳ {formatTimeText()}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center gap-1", getUrgencyColor())}>
        <Clock className="h-4 w-4" />
        <span className="font-medium">⏳ Starts in:</span>
      </div>
      <span className={cn("font-semibold", getUrgencyColor())}>
        {formatTimeText()}
      </span>
    </div>
  );
}
