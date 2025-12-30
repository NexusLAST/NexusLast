/**
 * User Role Badge Component
 * Feature 7: User Roles in Events
 */

import { Badge } from "@/components/UI/badge";
import { GraduationCap, User, Crown, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "organizer" | "attendee" | "co-organizer" | "moderator";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserRoleBadge({
  role,
  className,
  size = "md",
}: UserRoleBadgeProps) {
  const roleConfig = {
    organizer: {
      label: "Organizer",
      icon: GraduationCap,
      bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      emoji: "🎓",
    },
    "co-organizer": {
      label: "Co-Organizer",
      icon: Crown,
      bgColor:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      emoji: "👑",
    },
    moderator: {
      label: "Moderator",
      icon: Users,
      bgColor:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      emoji: "🛡️",
    },
    attendee: {
      label: "Attendee",
      icon: User,
      bgColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      emoji: "🧍",
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <Badge
      className={cn(
        config.bgColor,
        sizeClasses[size],
        "flex items-center gap-1 w-fit",
        className,
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </Badge>
  );
}

/**
 * Hook to get user role for an event
 * In demo mode, returns mock roles
 */
export function useUserRole(eventId: string, userId?: string) {
  // Demo mode: return mock roles based on eventId pattern
  const getMockRole = (eventId: string): UserRole => {
    const hash = eventId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const roles: UserRole[] = [
      "organizer",
      "attendee",
      "co-organizer",
      "moderator",
    ];
    return roles[Math.abs(hash) % roles.length];
  };

  // In production, this would fetch from Supabase:
  // const { data } = await supabase
  //   .from('event_roles')
  //   .select('role')
  //   .eq('event_id', eventId)
  //   .eq('user_id', userId)
  //   .single();

  return {
    role: getMockRole(eventId),
    isOrganizer: getMockRole(eventId) === "organizer",
    isModerator: ["organizer", "co-organizer", "moderator"].includes(
      getMockRole(eventId),
    ),
  };
}
