import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventDetailModal } from "@/components/Events/EventDetailModal";
import { EventApplicationForm } from "@/components/Events/EventApplicationForm";
import {
  MapPin,
  Search,
  Calendar,
  Users,
  Clock,
  Star,
  Navigation,
  Filter,
  ZoomIn,
  ZoomOut,
  Locate,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventLocation {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  participants: number;
  maxParticipants?: number;
  organizer: {
    id: string;
    name: string;
    rating: number;
    type: "user" | "business";
    isPremium: boolean;
  };
  isPremium?: boolean;
  purpose?: string;
  activities?: string[];
  requirements?: string[];
  price?: number;
}

interface EventMapDetailedProps {
  className?: string;
}

// Mock event locations data (in real app, this would come from Supabase)
const mockEventLocations: EventLocation[] = [
  {
    id: "1",
    title: "Startup Networking Kahvaltısı",
    description: "Girişimciler ve yatırımcılarla networking imkanı",
    date: "2024-02-15T09:00:00",
    location: "Kadıköy, İstanbul",
    latitude: 40.9833,
    longitude: 29.0167,
    category: "Girişimcilik",
    participants: 24,
    maxParticipants: 30,
    organizer: {
      id: "org-1",
      name: "Startup Hub İstanbul",
      rating: 4.8,
      type: "business",
      isPremium: true,
    },
    isPremium: true,
    purpose: "Girişimci ekosisteminde networking ve proje paylaşımı",
    activities: [
      "Networking kahvaltısı",
      "Pitch sunumları",
      "Mentor buluşmaları",
    ],
    requirements: ["Startup projesi veya fikri"],
    price: 50,
  },
  {
    id: "2",
    title: "React Workshop",
    description: "Modern React geliştirme teknikleri",
    date: "2024-02-16T14:00:00",
    location: "Levent, İstanbul",
    latitude: 41.0814,
    longitude: 29.0093,
    category: "Teknoloji",
    participants: 18,
    maxParticipants: 25,
    organizer: { name: "Elif Demir", rating: 4.9 },
  },
  {
    id: "3",
    title: "Yoga ve Meditasyon",
    description: "Sabah yoga seansı ve rehberli meditasyon",
    date: "2024-02-17T08:00:00",
    location: "Maçka Parkı, İstanbul",
    latitude: 41.0473,
    longitude: 28.9903,
    category: "Sağlık",
    participants: 15,
    maxParticipants: 20,
    organizer: { name: "Zeynep Yılmaz", rating: 4.7 },
  },
  {
    id: "4",
    title: "Fotoğraf Turu",
    description: "Şehir fotoğrafçılığı ve teknik ipuçları",
    date: "2024-02-18T16:00:00",
    location: "Sultanahmet, İstanbul",
    latitude: 41.0058,
    longitude: 28.9784,
    category: "Sanat",
    participants: 12,
    maxParticipants: 15,
    organizer: { name: "Murat Özkan", rating: 4.6 },
  },
  {
    id: "5",
    title: "Basketbol Maçı",
    description: "Arkadaşça basketbol maçı ve sosyalleşme",
    date: "2024-02-19T17:00:00",
    location: "Kadıköy Sahili, İstanbul",
    latitude: 40.9833,
    longitude: 29.03,
    category: "Spor",
    participants: 10,
    maxParticipants: 16,
    organizer: { name: "Can Polat", rating: 4.5 },
  },
];

const categories = [
  "Tümü",
  "Girişimcilik",
  "Teknoloji",
  "Sağlık",
  "Sanat",
  "Spor",
  "Arkadaşlık",
  "Oyun",
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Girişimcilik: "#3b82f6", // blue
    Teknoloji: "#10b981", // green
    Sağlık: "#f59e0b", // yellow
    Sanat: "#8b5cf6", // purple
    Spor: "#ef4444", // red
    Arkadaşlık: "#ec4899", // pink
    Oyun: "#06b6d4", // cyan
  };
  return colors[category] || "#6b7280";
};

export function EventMapDetailed({ className }: EventMapDetailedProps) {
  const [events, setEvents] = useState<EventLocation[]>(mockEventLocations);
  const [filteredEvents, setFilteredEvents] =
    useState<EventLocation[]>(mockEventLocations);
  const [selectedEvent, setSelectedEvent] = useState<EventLocation | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 41.0082, lng: 28.9784 }); // Istanbul center
  const [zoom, setZoom] = useState(11);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
        },
        (error) => {
          console.log("Location access denied:", error);
        },
      );
    }
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "Tümü") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  const handleEventClick = (event: EventLocation) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
    setMapCenter({ lat: event.latitude, lng: event.longitude });
    setZoom(15);
  };

  const handleDetailApply = () => {
    setIsDetailModalOpen(false);
    if (selectedEvent) {
      setIsApplicationModalOpen(true);
    }
  };

  const handleApplicationSubmit = async (introMessage: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Başvuru Gönderildi!",
      description: `${selectedEvent?.title} etkinliğine başvurunuz başarıyla iletildi.`,
    });

    setIsApplicationModalOpen(false);
    setSelectedEvent(null);
  };

  const findNearbyEvents = () => {
    if (!userLocation) {
      toast({
        title: "Konum Erişimi Gerekli",
        description:
          "Yakınınızdaki etkinlikleri görmek için konum erişimi verin.",
        variant: "destructive",
      });
      return;
    }

    // Simple distance calculation (in real app, use proper geolocation library)
    const nearbyEvents = events.filter((event) => {
      const distance = Math.sqrt(
        Math.pow(event.latitude - userLocation.lat, 2) +
          Math.pow(event.longitude - userLocation.lng, 2),
      );
      return distance < 0.05; // Approximately 5km
    });

    if (nearbyEvents.length === 0) {
      toast({
        title: "Yakın Etkinlik Bulunamadı",
        description: "5km çapında herhangi bir etkinlik bulunmuyor.",
      });
    } else {
      setFilteredEvents(nearbyEvents);
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
      setZoom(13);
      toast({
        title: "Yakın Etkinlikler",
        description: `${nearbyEvents.length} yakın etkinlik bulundu.`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Etkinlik Haritası</h1>
        <p className="text-muted-foreground">
          Yakınınızdaki etkinlikleri keşfedin ve katılın
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Etkinlik veya konum ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={findNearbyEvents}
              className="w-full md:w-auto"
            >
              <Locate className="h-4 w-4 mr-2" />
              Yakınımdakiler
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Harita Görünümü</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(zoom + 1, 18))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(zoom - 1, 8))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simulated Map Display */}
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg h-96 overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className={
                        'w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
                      }
                    ></div>
                  </div>
                </div>

                {/* Event Markers */}
                {filteredEvents.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform group"
                    style={{
                      left: `${20 + ((index * 15) % 60)}%`,
                      top: `${30 + ((index * 10) % 40)}%`,
                    }}
                  >
                    <div className="relative">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                        style={{
                          backgroundColor: getCategoryColor(event.category),
                        }}
                      >
                        <MapPin className="h-3 w-3 text-white" />
                      </div>

                      {/* Marker Popup on Hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-xs whitespace-nowrap z-10 border">
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-muted-foreground">
                          {formatDate(event.date)}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* User Location Marker */}
                {userLocation && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: "50%", top: "50%" }}
                  >
                    <div className="w-4 h-4 bg-nexus-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-nexus-600 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}

                {/* Map Info */}
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                  <div className="font-semibold">İstanbul, Türkiye</div>
                  <div className="text-muted-foreground">
                    {filteredEvents.length} etkinlik gösteriliyor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Etkinlikler ({filteredEvents.length})
          </h3>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Filtreye uygun etkinlik bulunamadı
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {event.title}
                        </h4>
                        <Badge
                          className="text-xs ml-2"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                            color: "white",
                          }}
                        >
                          {event.category}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {event.participants}/{event.maxParticipants || "∞"}{" "}
                            katılımcı
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            description: selectedEvent.description,
            date: selectedEvent.date,
            location: selectedEvent.location,
            createdBy: {
              id: selectedEvent.organizer.id,
              name: selectedEvent.organizer.name,
              avatar: undefined,
              rating: selectedEvent.organizer.rating,
              isPremium: selectedEvent.organizer.isPremium,
              type: selectedEvent.organizer.type,
            },
            participants: selectedEvent.participants,
            maxParticipants: selectedEvent.maxParticipants,
            category: selectedEvent.category,
            isPremiumEvent: selectedEvent.isPremium,
            purpose: selectedEvent.purpose,
            activities: selectedEvent.activities,
            requirements: selectedEvent.requirements,
            price: selectedEvent.price,
          }}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEvent(null);
          }}
          onApply={handleDetailApply}
          isOwnEvent={false}
        />
      )}

      {/* Application Modal */}
      {selectedEvent && (
        <EventApplicationForm
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            description: selectedEvent.description,
            date: selectedEvent.date,
            location: selectedEvent.location,
            createdBy: {
              name: selectedEvent.organizer.name,
              avatar: undefined,
              rating: selectedEvent.organizer.rating,
              isPremium: selectedEvent.organizer.isPremium,
            },
            participants: selectedEvent.participants,
            maxParticipants: selectedEvent.maxParticipants,
            category: selectedEvent.category,
            isPremiumEvent: selectedEvent.isPremium,
          }}
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}
