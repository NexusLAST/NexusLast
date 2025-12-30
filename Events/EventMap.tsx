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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";

interface MapEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
  participants: number;
  maxParticipants?: number;
  organizer: {
    name: string;
    rating: number;
  };
  isPremium?: boolean;
}

// Mock events with Istanbul coordinates
const mockMapEvents: MapEvent[] = [
  {
    id: "1",
    title: "React Workshop",
    description: "React ve TypeScript üzerine pratik workshop.",
    date: "2024-02-15",
    time: "14:00",
    location: "Levent, İstanbul",
    category: "Teknoloji",
    latitude: 41.082,
    longitude: 29.013,
    participants: 18,
    maxParticipants: 25,
    organizer: { name: "Ahmet Çelik", rating: 4.9 },
    isPremium: true,
  },
  {
    id: "2",
    title: "Startup Pitch Night",
    description: "Girişimcilerin projelerini sunduğu networking etkinliği.",
    date: "2024-02-24",
    time: "19:00",
    location: "Beyoğlu, İstanbul",
    category: "Girişimcilik",
    latitude: 41.037,
    longitude: 28.9857,
    participants: 35,
    maxParticipants: 50,
    organizer: { name: "Zeynep Kara", rating: 4.7 },
  },
  {
    id: "3",
    title: "Futbol Turnuvası",
    description: "5'er kişilik takımlarla düzenlenen dostane futbol turnuvası.",
    date: "2024-02-25",
    time: "10:00",
    location: "Maçka, İstanbul",
    category: "Spor",
    latitude: 41.043,
    longitude: 29.004,
    participants: 24,
    maxParticipants: 30,
    organizer: { name: "Barış Özdemir", rating: 4.4 },
  },
  {
    id: "4",
    title: "Sanat Galerisi Turu",
    description: "Modern sanat eserlerini keşfetmek için gezi.",
    date: "2024-02-20",
    time: "17:30",
    location: "Karaköy, İstanbul",
    category: "Sanat",
    latitude: 41.0255,
    longitude: 28.9755,
    participants: 12,
    maxParticipants: 15,
    organizer: { name: "Selin Yılmaz", rating: 4.6 },
  },
  {
    id: "5",
    title: "Yoga Seansı",
    description: "Hafta sonu rahatlaması için açık hava yoga.",
    date: "2024-02-18",
    time: "08:00",
    location: "Emirgan, İstanbul",
    category: "Sağlık",
    latitude: 41.1095,
    longitude: 29.053,
    participants: 15,
    maxParticipants: 20,
    organizer: { name: "Ayşe Demir", rating: 4.8 },
  },
  {
    id: "6",
    title: "Kitap Kulübü Buluşması",
    description: "Bu ayın kitabını tartışma ve kahve sohbeti.",
    date: "2024-02-16",
    time: "19:00",
    location: "Kadıköy, İstanbul",
    category: "Eğitim",
    latitude: 41.0082,
    longitude: 29.0283,
    participants: 9,
    maxParticipants: 12,
    organizer: { name: "Emre Şen", rating: 4.4 },
  },
];

const categories = [
  "Tümü",
  "Teknoloji",
  "Girişimcilik",
  "Spor",
  "Sanat",
  "Sağlık",
  "Eğitim",
];

interface EventMapProps {
  height?: string;
  showSearch?: boolean;
}

export function EventMap({
  height = "500px",
  showSearch = true,
}: EventMapProps) {
  const [events, setEvents] = useState<MapEvent[]>(mockMapEvents);
  const [filteredEvents, setFilteredEvents] =
    useState<MapEvent[]>(mockMapEvents);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { user, isDemo } = useDemoUser();

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "Tümü") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied:", error);
          // Default to Istanbul center
          setUserLocation({ lat: 41.0082, lng: 28.9784 });
        },
      );
    } else {
      // Default to Istanbul center
      setUserLocation({ lat: 41.0082, lng: 28.9784 });
    }
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "short",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Teknoloji: "bg-blue-500",
      Girişimcilik: "bg-green-500",
      Spor: "bg-red-500",
      Sanat: "bg-purple-500",
      Sağlık: "bg-teal-500",
      Eğitim: "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
  };

  // Simple map marker component
  const MapMarker = ({
    event,
    onClick,
  }: {
    event: MapEvent;
    onClick: () => void;
  }) => (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{
        left: `${((event.longitude - 28.8) / (29.2 - 28.8)) * 100}%`,
        top: `${(1 - (event.latitude - 40.9) / (41.2 - 40.9)) * 100}%`,
      }}
      onClick={onClick}
    >
      <div
        className={`w-4 h-4 rounded-full ${getCategoryColor(event.category)} ring-2 ring-white shadow-lg group-hover:scale-125 transition-transform`}
      ></div>
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {event.title}
      </div>
    </div>
  );

  const EventDetail = ({ event }: { event: MapEvent }) => (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
            >
              {event.category}
            </Badge>
            {event.isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{event.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-nexus-500" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-nexus-500" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-nexus-500" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-nexus-500" />
          <span>
            {event.participants}
            {event.maxParticipants && `/${event.maxParticipants}`} katılımcı
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <div className="text-sm">
          <span className="font-medium">Organizatör: </span>
          {event.organizer.name}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{event.organizer.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
          size="sm"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Etkinliğe Git
        </Button>
        <Button variant="outline" size="sm">
          <Navigation className="h-4 w-4 mr-2" />
          Yol Tarifi
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {showSearch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-nexus-600" />
              Harita Üzerinde Etkinlikler
            </CardTitle>
          </CardHeader>
          <CardContent>
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
            </div>

            {/* Category Legend */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.slice(1).map((category) => (
                <div key={category} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}
                  ></div>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div
            className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 overflow-hidden"
            style={{ height }}
          >
            {/* Simple Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simplified Istanbul map paths */}
                <path
                  d="M20,50 Q30,30 50,40 Q70,20 80,50 Q70,70 50,60 Q30,80 20,50"
                  fill="currentColor"
                  className="text-blue-200"
                />
                <path
                  d="M25,45 L75,45 M50,20 L50,80 M35,35 L65,65 M35,65 L65,35"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300"
                />
              </svg>
            </div>

            {/* User Location */}
            {userLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${((userLocation.lng - 28.8) / (29.2 - 28.8)) * 100}%`,
                  top: `${(1 - (userLocation.lat - 40.9) / (41.2 - 40.9)) * 100}%`,
                }}
              >
                <div className="w-3 h-3 bg-nexus-600 rounded-full ring-2 ring-white shadow-lg animate-pulse"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-nexus-600 text-white text-xs py-1 px-2 rounded">
                  Sen
                </div>
              </div>
            )}

            {/* Event Markers */}
            {filteredEvents.map((event) => (
              <MapMarker
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                <div className="text-xs font-medium text-center mb-1">
                  İstanbul
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {filteredEvents.length} etkinlik
                </div>
              </div>
            </div>

            {/* No events message */}
            {filteredEvents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Card>
                  <CardContent className="text-center py-8">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Etkinlik Bulunamadı
                    </h3>
                    <p className="text-muted-foreground">
                      Arama kriterlerinize uygun etkinlik bulunamadı.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-nexus-600" />
              Etkinlik Detayları
            </DialogTitle>
            <DialogDescription>
              Harita üzerinde seçtiğiniz etkinlik bilgileri
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && <EventDetail event={selectedEvent} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
