import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EventDetailModal } from "@/components/Events/EventDetailModal";
import { EventFeedbackForm } from "@/components/Events/EventFeedbackForm";
import { EventStatusTag } from "@/components/MyEvents/EventStatusTag";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  MessageCircle,
  CalendarDays,
  User,
  AlertCircle,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { mockJoinedEvents, type MockEvent } from "@/data/mockMyEvents";
import { toast } from "@/hooks/use-toast";

export function JoinedEventsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { user, isDemo } = useDemoUser();

  // Categorize events by date
  const { upcomingEvents, completedEvents } = useMemo(() => {
    const now = new Date();

    const upcoming = mockJoinedEvents.filter(
      (event) => new Date(event.date) > now,
    );

    const completed = mockJoinedEvents.filter(
      (event) => new Date(event.date) <= now,
    );

    return {
      upcomingEvents: upcoming,
      completedEvents: completed,
    };
  }, []);

  const handleViewDetails = (event: MockEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleLeaveFeedback = (event: MockEvent) => {
    setSelectedEvent(event);
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    if (!selectedEvent) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, this would save to Supabase participants table with feedback
      console.log("Saving feedback:", {
        eventId: selectedEvent.id,
        userId: user?.id,
        rating,
        comment,
      });

      toast({
        title: "Değerlendirme Gönderildi",
        description: "Geri bildiriminiz başarıyla kaydedildi. Teşekkürler!",
      });

      setIsFeedbackModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Değerlendirme gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasUserRated = (event: MockEvent) => {
    return event.feedback?.some((feedback) => feedback.userId === user?.id);
  };

  const getUserRating = (event: MockEvent) => {
    return event.feedback?.find((feedback) => feedback.userId === user?.id);
  };

  const JoinedEventCard = ({
    event,
    isCompleted,
  }: {
    event: MockEvent;
    isCompleted: boolean;
  }) => {
    const eventDate = new Date(event.date);
    const userRating = getUserRating(event);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  <EventStatusTag
                    status={isCompleted ? "completed" : "upcoming"}
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-nexus-600" />
                <span>{eventDate.toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-nexus-600" />
                <span>
                  {eventDate.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-nexus-600" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-nexus-600" />
                <span>{event.createdBy.name}</span>
              </div>
            </div>

            {/* Category and Participants */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{event.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.participants} katılımcı</span>
              </div>
            </div>

            {/* User Rating (if completed and rated) */}
            {isCompleted && userRating && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-sm">
                    Değerlendirmeniz: {userRating.rating}/5
                  </span>
                </div>
                {userRating.comment && (
                  <p className="text-sm text-muted-foreground">
                    "{userRating.comment}"
                  </p>
                )}
              </div>
            )}

            {/* Event Rating (if completed) */}
            {isCompleted && event.averageRating && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>
                  {event.averageRating}/5 ({event.totalRatings} değerlendirme)
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleViewDetails(event)}
              >
                Detayları Gör
              </Button>

              {isCompleted && (
                <>
                  {!hasUserRated(event) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleLeaveFeedback(event)}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Puan Ver
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleLeaveFeedback(event)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Yorum Güncelle
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (mockJoinedEvents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Henüz Bir Etkinliğe Katılmadınız
          </h3>
          <p className="text-muted-foreground">
            İlginizi çeken etkinliklere katılarak sosyal ağınızı genişletin.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CalendarDays className="h-8 w-8 mx-auto mb-2 text-nexus-600" />
            <div className="text-2xl font-bold">{mockJoinedEvents.length}</div>
            <div className="text-sm text-muted-foreground">Toplam Etkinlik</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <div className="text-sm text-muted-foreground">Yaklaşan</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{completedEvents.length}</div>
            <div className="text-sm text-muted-foreground">Tamamlanan</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Yaklaşan Etkinlikler ({upcomingEvents.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <JoinedEventCard
                key={event.id}
                event={event}
                isCompleted={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Events */}
      {completedEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-green-600" />
            Tamamlanan Etkinlikler ({completedEvents.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedEvents.map((event) => (
              <JoinedEventCard
                key={event.id}
                event={event}
                isCompleted={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedEvent && (
        <EventDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}

      {selectedEvent && (
        <EventFeedbackForm
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSubmitFeedback={handleSubmitFeedback}
          existingRating={getUserRating(selectedEvent)}
        />
      )}
    </div>
  );
}
