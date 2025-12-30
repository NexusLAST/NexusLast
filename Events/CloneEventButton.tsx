import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants?: number;
  isPremiumEvent?: boolean;
}

interface CloneEventButtonProps {
  event: Event;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showTooltip?: boolean;
}

export function CloneEventButton({
  event,
  size = "sm",
  variant = "outline",
  className = "",
  showTooltip = true,
}: CloneEventButtonProps) {
  const navigate = useNavigate();
  const [isCloning, setIsCloning] = useState(false);

  const handleCloneEvent = async () => {
    setIsCloning(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create clone data with updated date (7 days from today)
      const today = new Date();
      const cloneDate = new Date(today);
      cloneDate.setDate(today.getDate() + 7);

      const cloneData = {
        ...event,
        id: undefined, // Remove ID so a new one will be generated
        title: `${event.title} (Kopya)`,
        date: cloneDate.toISOString(),
        isClone: true,
        originalEventId: event.id,
      };

      // Store clone data in sessionStorage to prefill the form
      sessionStorage.setItem("cloneEventData", JSON.stringify(cloneData));

      toast({
        title: "Etkinlik Kopyalandı!",
        description: "Etkinlik bilgileri ile yeni etkinlik formu açılıyor...",
      });

      // Navigate to create event page
      navigate("/create-event?mode=clone");
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik kopyalanırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

  const buttonContent = (
    <Button
      size={size}
      variant={variant}
      onClick={handleCloneEvent}
      disabled={isCloning}
      className={`${className} ${isCloning ? "opacity-50" : ""}`}
    >
      {isCloning ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <>
          <RotateCcw className="h-4 w-4 mr-1" />
          {size === "sm" ? "Tekrarla" : "Etkinliği Tekrarla"}
        </>
      )}
    </Button>
  );

  if (!showTooltip) {
    return buttonContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent>
          <p>Bu etkinliği aynı bilgilerle tekrar oluştur</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
