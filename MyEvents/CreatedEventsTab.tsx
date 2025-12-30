import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloneEventButton } from "@/components/Events/CloneEventButton";
import { ViewParticipantsModal } from "@/components/Events/ViewParticipantsModal";
import { EventStatusTag } from "@/components/MyEvents/EventStatusTag";
import { EventStatisticsModal } from "@/components/MyEvents/EventStatisticsModal";
import { EventFeedbackModal } from "@/components/MyEvents/EventFeedbackModal";
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  BarChart3,
  CheckCircle,
  Plus,
  Filter,
  Edit,
  Settings,
  Eye,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { mockMyEvents, type MockEvent } from "@/data/mockMyEvents";
import { toast } from "@/hooks/use-toast";

export function CreatedEventsTab() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useDemoUser();

  const categories = [
    "all",
    "Teknoloji",
    "Girişimcilik",
    "Sağlık",
    "Spor",
    "Sanat",
  ];

  // Categorize events by time
  const { upcomingEvents, within24hEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );

    const upcoming = mockMyEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate > twentyFourHoursFromNow && event.status === "upcoming";
    });

    const within24h = mockMyEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate > now &&
        eventDate <= twentyFourHoursFromNow &&
        event.status === "upcoming"
      );
    });

    const past = mockMyEvents.filter(
      (event) => event.status === "completed" || new Date(event.date) <= now,
    );

    return {
      upcomingEvents: upcoming,
      within24hEvents: within24h,
      pastEvents: past,
    };
  }, []);

  const filterEvents = (eventList: MockEvent[]) => {
    let filtered = eventList;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "participants":
          return b.participants - a.participants;
        case "applications":
          return (b.participants || 0) - (a.participants || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleManageApplications = (event: MockEvent) => {
    if (event.participants_data && event.participants_data.length > 0) {
      setSelectedEvent(event);
      setIsParticipantsModalOpen(true);
    } else {
      toast({
        title: "Başvuru Yok",
        description: "Bu etkinlik için henüz başvuru bulunmuyor.",
        variant: "destructive",
      });
    }
  };

  const handleViewStatistics = (event: MockEvent) => {
    setSelectedEvent(event);
    setIsStatisticsModalOpen(true);
  };

  const handleViewFeedback = (event: MockEvent) => {
    setSelectedEvent(event);
    setIsFeedbackModalOpen(true);
  };

  const CreatedEventCard = ({
    event,
    eventType,
  }: {
    event: MockEvent;
    eventType: "upcoming" | "within24h" | "past";
  }) => {
    const eventDate = new Date(event.date);
    const isPast = eventType === "past";
    const isWithin24h = eventType === "within24h";
    const canEdit = !isPast && !isWithin24h;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  {isWithin24h && (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      24 Saat İçinde
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description}
                </p>
              </div>
              <EventStatusTag
                status={
                  eventType === "upcoming" && !isWithin24h
                    ? "upcoming"
                    : isWithin24h
                      ? "active"
                      : "completed"
                }
              />
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-nexus-600" />
                <span>{eventDate.toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-nexus-600" />
                <span>
                  {eventDate.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-nexus-600" />
                <span>
                  {event.participants}/{event.maxParticipants || "∞"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3 text-nexus-600" />
                <span>{event.participants || 0} başvuru</span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{event.category}</Badge>
              {isPast && event.averageRating && (
                <div className="flex items-center gap-1 text-sm">
                  <BarChart3 className="h-3 w-3 text-yellow-500" />
                  <span>
                    {event.averageRating}/5 ({event.totalRatings})
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t">
              {isPast ? (
                <>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewStatistics(event)}
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      İstatistikler
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewFeedback(event)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Yorumlar
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <CloneEventButton
                      event={{
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        date: event.date,
                        location: event.location,
                        category: event.category,
                        maxParticipants: event.maxParticipants,
                      }}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      showTooltip={true}
                    />
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleManageApplications(event)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {isWithin24h ? "Başvuruları Gör" : "Başvuruları Yönet"}
                  </Button>
                  {canEdit ? (
                    <Link
                      to={`/create-event?edit=${event.id}`}
                      className="flex-1"
                    >
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      disabled
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Düzenlenemez
                    </Button>
                  )}
                </div>
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

  if (mockMyEvents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Henüz Etkinlik Oluşturmadınız
          </h3>
          <p className="text-muted-foreground mb-4">
            İlk etkinliğinizi oluşturarak insanları bir araya getirin.
          </p>
          <Link to="/create-event">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Etkinlik Oluştur
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Oluşturduğunuz Etkinlikler</h2>
          <p className="text-muted-foreground">
            Toplam {mockMyEvents.length} etkinlik •{" "}
            {upcomingEvents.length + within24hEvents.length} aktif •{" "}
            {pastEvents.length} geçmiş
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Tarihe Göre</SelectItem>
              <SelectItem value="participants">Katılımcıya Göre</SelectItem>
              <SelectItem value="applications">Başvuruya Göre</SelectItem>
            </SelectContent>
          </Select>

          <Link to="/create-event">
            <Button className="bg-gradient-to-r from-nexus-500 to-nexus-600">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Etkinlik
            </Button>
          </Link>
        </div>
      </div>

      {/* Events Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Yaklaşan ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="within24h" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            24 Saat İçinde ({within24hEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Tamamlanan ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {filterEvents(upcomingEvents).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Yaklaşan Etkinlik Yok
                </h3>
                <p className="text-muted-foreground mb-4">
                  24 saatten fazla süre kalan aktif etkinliğiniz bulunmuyor.
                </p>
                <Link to="/create-event">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Etkinlik Oluştur
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterEvents(upcomingEvents).map((event) => (
                <CreatedEventCard
                  key={event.id}
                  event={event}
                  eventType="upcoming"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="within24h" className="mt-6">
          {filterEvents(within24hEvents).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  24 Saat İçinde Etkinlik Yok
                </h3>
                <p className="text-muted-foreground">
                  Önümüzdeki 24 saat içinde başlayacak etkinliğiniz bulunmuyor.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-700 dark:text-orange-300">
                    Yaklaşan Etkinlikler
                  </span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Bu etkinlikler 24 saat içinde başlayacak. Artık düzenleme
                  yapılamaz, sadece başvuruları görüntüleyebilirsiniz.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterEvents(within24hEvents).map((event) => (
                  <CreatedEventCard
                    key={event.id}
                    event={event}
                    eventType="within24h"
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {filterEvents(pastEvents).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Tamamlanan Etkinlik Yok
                </h3>
                <p className="text-muted-foreground">
                  Henüz tamamlanmış etkinliğiniz bulunmuyor.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterEvents(pastEvents).map((event) => (
                <CreatedEventCard
                  key={event.id}
                  event={event}
                  eventType="past"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Participants Modal */}
      {selectedEvent && selectedEvent.participants_data && (
        <ViewParticipantsModal
          isOpen={isParticipantsModalOpen}
          onClose={() => {
            setIsParticipantsModalOpen(false);
            setSelectedEvent(null);
          }}
          eventTitle={selectedEvent.title}
          participants={selectedEvent.participants_data}
        />
      )}

      {/* Statistics Modal */}
      {selectedEvent && (
        <EventStatisticsModal
          isOpen={isStatisticsModalOpen}
          onClose={() => {
            setIsStatisticsModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}

      {/* Feedback Modal */}
      {selectedEvent && (
        <EventFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
