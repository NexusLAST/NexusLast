/**
 * Day/Night Time Filter Component
 * Feature 6: Day vs Night Event Filter
 */

import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Sun, Moon, Clock } from "lucide-react";
import { TimeFilter as TimeFilterType } from "@/lib/timeFilters";
import { cn } from "@/lib/utils";

interface TimeFilterProps {
  activeFilter: TimeFilterType;
  onFilterChange: (filter: TimeFilterType) => void;
  eventCounts?: {
    all: number;
    day: number;
    night: number;
  };
}

export function TimeFilter({
  activeFilter,
  onFilterChange,
  eventCounts,
}: TimeFilterProps) {
  const filters = [
    {
      key: "all" as const,
      label: "All Events",
      icon: Clock,
      count: eventCounts?.all || 0,
      bgColor: "bg-gray-500",
      activeBg: "bg-gray-600",
    },
    {
      key: "day" as const,
      label: "Day Events",
      icon: Sun,
      count: eventCounts?.day || 0,
      bgColor: "bg-yellow-500",
      activeBg: "bg-yellow-600",
    },
    {
      key: "night" as const,
      label: "Night Events",
      icon: Moon,
      count: eventCounts?.night || 0,
      bgColor: "bg-indigo-500",
      activeBg: "bg-indigo-600",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Event Time Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;

            return (
              <Button
                key={filter.key}
                variant={isActive ? "default" : "outline"}
                onClick={() => onFilterChange(filter.key)}
                className={cn(
                  "h-auto py-3 flex flex-col items-center gap-1",
                  isActive && filter.activeBg,
                  !isActive && "hover:bg-muted",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{filter.label}</span>
                <span className="text-xs opacity-75">
                  {filter.count} event{filter.count !== 1 ? "s" : ""}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Time Ranges Info */}
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="h-3 w-3" />
            <span>Gündüz: 06:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-3 w-3" />
            <span>Gece: 18:01 - 05:59</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
