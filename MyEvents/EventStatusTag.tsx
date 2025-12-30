import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Calendar,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventStatusTagProps {
  status: "upcoming" | "active" | "completed" | "cancelled";
  className?: string;
}

export function EventStatusTag({ status, className }: EventStatusTagProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          label: "Yaklaşan",
          icon: Calendar,
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
      case "active":
        return {
          label: "Aktif",
          icon: Clock,
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        };
      case "completed":
        return {
          label: "Tamamlandı",
          icon: CheckCircle,
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };
      case "cancelled":
        return {
          label: "İptal",
          icon: XCircle,
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
      default:
        return {
          label: "Bilinmiyor",
          icon: AlertTriangle,
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        config.className,
        "flex items-center gap-1 text-xs font-medium",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
