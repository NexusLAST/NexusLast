import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar?: string;
    rating: number;
  };
  category: string;
  participants: number;
  maxParticipants: number;
  price?: number;
  isJoined: boolean;
  isPremium?: boolean;
}

interface DailyEventDetailsProps {
  selectedDate: Date | null;
  events: EventDetail[];
  isOpen: boolean;
  onClose: () => void;
}

export function DailyEventDetails({
  selectedDate,
  events,
  isOpen,
  onClose,
}: DailyEventDetailsProps) {
  const [joiningEvent, setJoiningEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  const handleJoinEvent = async (eventId: string) => {
    setJoiningEvent(eventId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Etkinliğe Katıldınız!",
        description: "Etkinlik başvurunuz başarıyla gönderildi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinliğe katılırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setJoiningEvent(null);
    }
  };

  const handleEventDetail = (event: EventDetail) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleShare = (event: EventDetail) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.title} etkinliğine katılmak ister misin?`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Kopyalandı!",
        description: "Etkinlik linki panoya kopyalandı.",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Girişimcilik:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Teknoloji:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Sağlık:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Sanat:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Spor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Arkadaşlık:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedDate ? formatDate(selectedDate) : "Etkinlikler"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Etkinlik Bulunamadı
                </h3>
                <p className="text-muted-foreground">
                  Bu tarihte herhangi bir etkinlik bulunmuyor.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  {events.length} etkinlik bulundu
                </div>

                <div className="space-y-4">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Event Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{event.title}</h4>
                                {event.isPremium && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <Badge
                                className={getCategoryColor(event.category)}
                              >
                                {event.category}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleShare(event)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-nexus-600" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-nexus-600" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-nexus-600" />
                                <span>
                                  {event.participants}/{event.maxParticipants}{" "}
                                  katılımcı
                                </span>
                              </div>
                              {event.price && (
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600 font-semibold">
                                    ₺{event.price}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Organizer */}
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.organizer.avatar} />
                              <AvatarFallback className="text-xs">
                                {event.organizer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {event.organizer.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">
                                {event.organizer.rating}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            {event.isJoined ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="flex-1"
                              >
                                <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                                Katıldın
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleJoinEvent(event.id)}
                                disabled={joiningEvent === event.id}
                                className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                              >
                                {joiningEvent === event.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                  "Katıl"
                                )}
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEventDetail(event)}
                              className="flex-1"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Detay
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Detail Modal */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent className="max-w-3xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <p className="text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-nexus-600" />
                    <div className="text-sm font-medium">
                      {selectedEvent.time}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-nexus-600" />
                    <div className="text-sm font-medium">Konum</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-nexus-600" />
                    <div className="text-sm font-medium">
                      {selectedEvent.participants} Katılımcı
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-nexus-600" />
                    <div className="text-sm font-medium">
                      ⭐ {selectedEvent.organizer.rating}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedEvent.isJoined ? (
                    <Button variant="outline" disabled className="flex-1">
                      <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                      Zaten Katıldın
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinEvent(selectedEvent.id)}
                      disabled={joiningEvent === selectedEvent.id}
                      className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                    >
                      {joiningEvent === selectedEvent.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Katılınıyor...
                        </>
                      ) : (
                        "Etkinliğe Katıl"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleShare(selectedEvent)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
