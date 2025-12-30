import { useState, useMemo } from "react";
import { EventCard } from "@/components/Events/EventCard";
import { CloneEventButton } from "@/components/Events/CloneEventButton";
import { ViewParticipantsModal } from "@/components/Events/ViewParticipantsModal";
import { EventFeedbackForm } from "@/components/Events/EventFeedbackForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  BarChart3,
  CheckCircle,
  Plus,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { mockMyEvents, type MockEvent } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface MyEventsProps {
  events?: MockEvent[];
}

export function MyEvents({ events = mockMyEvents }: MyEventsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { user } = useDemoUser();

  const categories = [
    "all",
    "Teknoloji",
    "Girişimcilik",
    "Sağlık",
    "Spor",
    "Sanat",
  ];

  const { upcomingEvents, within24hEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );

    const upcoming = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate > twentyFourHoursFromNow && event.status === "upcoming";
    });

    const within24h = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate > now &&
        eventDate <= twentyFourHoursFromNow &&
        event.status === "upcoming"
      );
    });

    const past = events.filter(
      (event) => event.status === "completed" || new Date(event.date) <= now,
    );

    return {
      upcomingEvents: upcoming,
      within24hEvents: within24h,
      pastEvents: past,
    };
  }, [events]);

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

  const handleViewParticipants = (event: MockEvent) => {
    if (event.participants_data && event.participants_data.length > 0) {
      setSelectedEvent(event);
      setIsParticipantsModalOpen(true);
    } else {
      toast({
        title: "Katılımcı Bilgisi Yok",
        description: "Bu etkinlik için katılımcı bilgisi mevcut değil.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveFeedback = (event: MockEvent) => {
    setSelectedEvent(event);
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    // Simulate API call to save feedback
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real app, this would save to event_feedback table
    console.log("Saving feedback:", {
      eventId: selectedEvent?.id,
      rating,
      comment,
      userId: user?.id,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Yaklaşan";
      case "ongoing":
        return "Devam Ediyor";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return "Bilinmiyor";
    }
  };

  const EventCard = ({
    event,
    eventType,
  }: {
    event: MockEvent;
    eventType: "upcoming" | "within24h" | "past";
  }) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const isPast = eventType === "past";
    const isWithin24h = eventType === "within24h";
    const canEdit = !isPast && !isWithin24h;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  {isWithin24h && (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 text-xs">
                      24 Saat İçinde
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description}
                </p>
              </div>
              <Badge className={getStatusColor(event.status)}>
                {eventType === "upcoming" && !isWithin24h
                  ? "Yaklaşan"
                  : isWithin24h
                    ? "Yaklaşan"
                    : getStatusText(event.status)}
              </Badge>
            </div>

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

            {isPast && event.averageRating && (
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-3 w-3 text-yellow-500" />
                <span>
                  Ortalama: {event.averageRating}/5 ({event.totalRatings}{" "}
                  değerlendirme)
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t">
              {isPast ? (
                <>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewParticipants(event)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Katılımcılar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleLeaveFeedback(event)}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Değerlendir
                    </Button>
                  </div>
                  <div className="flex justify-end">
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
                  <Button size="sm" variant="outline" className="flex-1">
                    Başvuruları Gör
                  </Button>
                  {canEdit ? (
                    <Button size="sm" variant="outline" className="flex-1">
                      Düzenle
                    </Button>
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

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Giriş Yapın</h3>
          <p className="text-muted-foreground">
            Oluşturduğunuz etkinlikleri görmek için giriş yapmanız gerekiyor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Oluşturduğun Etkinlikler</h2>
          <p className="text-muted-foreground">
            Toplam {events.length} etkinlik •{" "}
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
                <EventCard key={event.id} event={event} eventType="upcoming" />
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
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-700 dark:text-orange-300">
                    Yaklaşan Etkinlikler
                  </span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Bu etkinlikler 24 saat içinde başlayacak. Artık düzenleme
                  yapılamaz, sadece başvuruları yönetebilirsiniz.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterEvents(within24hEvents).map((event) => (
                  <EventCard
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
                <EventCard key={event.id} event={event} eventType="past" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
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

      {selectedEvent && (
        <EventFeedbackForm
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            setSelectedEvent(null);
          }}
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            description: selectedEvent.description,
            date: selectedEvent.date,
            location: selectedEvent.location,
            category: selectedEvent.category,
            createdBy: {
              name: selectedEvent.createdBy.name,
              avatar: selectedEvent.createdBy.avatar,
            },
          }}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
