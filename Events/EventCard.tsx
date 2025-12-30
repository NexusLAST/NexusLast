import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloneEventButton } from "@/components/Events/CloneEventButton";
import { EventDetailModal } from "@/components/Events/EventDetailModal";
import { EventApplicationForm } from "@/components/Events/EventApplicationForm";
import { Calendar, MapPin, Users, Clock, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useDemoUser } from "@/contexts/DemoUserContext";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    createdBy: {
      name: string;
      avatar?: string;
      rating: number;
      isPremium: boolean;
    };
    participants: number;
    maxParticipants?: number;
    category: string;
    isPremiumEvent?: boolean;
  };
  className?: string;
  onApply?: () => void;
  showCloneButton?: boolean;
}

export function EventCard({
  event,
  className,
  onApply,
  showCloneButton = false,
}: EventCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { user } = useDemoUser();

  // Check if this is user's own event
  const isOwnEvent = user && event.createdBy.name === user.name;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = () => {
    setIsDetailModalOpen(true);
  };

  const handleApplyClick = () => {
    if (isOwnEvent) {
      toast({
        title: "Kendi Etkinliğin",
        description: "Kendi oluşturduğun etkinliğe başvuru yapamazsın.",
        variant: "destructive",
      });
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = async (introMessage: string) => {
    // Simulate API call to submit application
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Başvuru Gönderildi!",
      description: `${event.title} etkinliğine başvurun başarıyla iletildi. Organizatör sizinle iletişime geçecek.`,
    });

    if (onApply) {
      onApply();
    }
  };

  const handleDetailApply = () => {
    setIsDetailModalOpen(false);
    if (!isOwnEvent) {
      setIsApplicationModalOpen(true);
    }
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative",
        event.isPremiumEvent && "ring-2 ring-nexus-200 dark:ring-nexus-800",
        className,
      )}
    >
      {/* Clone Button - Positioned in top right corner */}
      {showCloneButton && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CloneEventButton
            event={event}
            size="sm"
            variant="outline"
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border shadow-sm hover:shadow-md"
            showTooltip={true}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
              >
                {event.category}
              </Badge>
              {event.isPremiumEvent && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                  Premium
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-nexus-600 dark:group-hover:text-nexus-400 transition-colors">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={event.createdBy.avatar} />
            <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
              {event.createdBy.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">
                {event.createdBy.name}
              </span>
              {event.createdBy.isPremium && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {event.createdBy.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-nexus-500" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-nexus-500" />
            <span>{formatTime(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-nexus-500" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-nexus-500" />
            <span>
              {event.participants}
              {event.maxParticipants && `/${event.maxParticipants}`} katılımcı
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detayları Gör
          </Button>

          {!isOwnEvent ? (
            <Button
              className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              size="sm"
              onClick={handleApplyClick}
            >
              Başvuru Yap
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1" disabled>
              Etkinliğin
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Modals */}
      <EventDetailModal
        event={event}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleDetailApply}
        isOwnEvent={isOwnEvent}
      />

      <EventApplicationForm
        event={event}
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSubmit={handleApplicationSubmit}
      />
    </Card>
  );
}
