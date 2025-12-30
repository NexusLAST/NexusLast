import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/UI/card";
import { Button } from "@/UI/button";
import { Badge } from "@/UI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/UI/avatar";
import { EventDetailModal } from "@/Events/EventDetailModal";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

// Mock data for friends
const mockFriends = [
  {
    id: "friend-1",
    name: "Ahmet Yılmaz",
    avatar: undefined,
    purpose: "arkadaşlık",
  },
  {
    id: "friend-2",
    name: "Zeynep Kaya",
    avatar: undefined,
    purpose: "kariyer gelişimi",
  },
  {
    id: "friend-3",
    name: "Murat Özkan",
    avatar: undefined,
    purpose: "sosyal aktiviteler",
  },
];

// Mock events with friends attending
const mockFriendsEvents = [
  {
    id: "friends-event-1",
    title: "React Istanbul Meetup",
    description:
      "React geliştiricilerinin buluştuğu aylık teknik meetup. Bu ay state management konusunu ele alacağız.",
    date: "2024-02-25T14:00:00",
    location: "Maslak, İstanbul",
    category: "Teknoloji",
    participants: 35,
    maxParticipants: 50,
    createdBy: {
      name: "TechCamp İstanbul",
      avatar: undefined,
      rating: 4.9,
      isPremium: true,
    },
    friendsAttending: [mockFriends[0], mockFriends[1]], // Ahmet and Zeynep
    isPremiumEvent: false,
  },
  {
    id: "friends-event-2",
    title: "Photography Walk - Sultanahmet",
    description: "İstanbul'un tarihi mekanlarında fotoğraf çekimi turu.",
    date: "2024-02-27T16:00:00",
    location: "Sultanahmet, İstanbul",
    category: "Sanat",
    participants: 18,
    maxParticipants: 20,
    createdBy: {
      name: "Photo Club Istanbul",
      avatar: undefined,
      rating: 4.6,
      isPremium: false,
    },
    friendsAttending: [mockFriends[2]], // Murat
    isPremiumEvent: false,
  },
  {
    id: "friends-event-3",
    title: "Startup Networking Night",
    description:
      "Girişimciler ve yatırımcıların buluştuğu networking etkinliği.",
    date: "2024-02-28T19:00:00",
    location: "Beyoğlu, İstanbul",
    category: "Girişimcilik",
    participants: 45,
    maxParticipants: 60,
    createdBy: {
      name: "Startup Hub İstanbul",
      avatar: undefined,
      rating: 4.7,
      isPremium: true,
    },
    friendsAttending: [mockFriends[1]], // Zeynep
    isPremiumEvent: true,
  },
];

interface FriendsEventsProps {
  className?: string;
}

export function FriendsEvents({ className }: FriendsEventsProps) {
  const { user, isDemo } = useDemoUser();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Only show in demo mode or when user has friends
  if (!isDemo || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Yarın";
    if (diffDays > 1) return `${diffDays} gün sonra`;
    return "Geçmiş";
  };

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleJoinEvent = (eventId: string, eventTitle: string) => {
    toast({
      title: "Etkinliğe Katıl",
      description: `${eventTitle} etkinliğine katılım talebiniz gönderildi.`,
    });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-nexus-600" />
            👥 Arkadaşlarının Katıldığı Etkinlikler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockFriendsEvents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Henüz Etkinlik Yok</h3>
              <p className="text-muted-foreground">
                Arkadaşların henüz hiçbir etkinliğe katılmamış.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockFriendsEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {/* Event Info */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold line-clamp-1">
                              {event.title}
                            </h3>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {formatTimeUntil(event.date)}
                            </Badge>
                          </div>

                          {/* Friends Attending */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {event.friendsAttending.map((friend, index) => (
                              <div
                                key={friend.id}
                                className="flex items-center gap-1"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={friend.avatar} />
                                  <AvatarFallback className="text-xs bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                                    {friend.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-nexus-600 dark:text-nexus-400">
                                  {friend.name}
                                </span>
                                {index < event.friendsAttending.length - 1 && (
                                  <span className="text-muted-foreground text-sm">
                                    ,
                                  </span>
                                )}
                              </div>
                            ))}
                            <span className="text-sm text-muted-foreground">
                              katılıyor
                            </span>
                          </div>

                          {/* Event Details */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {event.participants}/
                                {event.maxParticipants || "∞"}
                              </span>
                            </div>
                          </div>

                          <Badge
                            variant="secondary"
                            className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                          >
                            {event.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex">
                        <Button
                          size="sm"
                          onClick={() => handleViewDetails(event)}
                          className="bg-gradient-to-r from-nexus-500 to-nexus-600 text-xs"
                        >
                          <ChevronRight className="h-3 w-3 mr-1" />
                          Etkinliği Gör
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* View All Button */}
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Tümünü Gör
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
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
    </div>
  );
}
