import { useState, useEffect } from "react";
import { EventCard } from "./EventCard";
import { EventApplicationModal } from "./EventApplicationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2 } from "lucide-react";
import { Event, supabase } from "@/lib/supabase";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface EventWithDetails extends Event {
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
}

// Mock data for demo mode when Supabase is not available
const mockEvents: EventWithDetails[] = [
  {
    id: "1",
    title: "Startup Networking Gecesi",
    description:
      "İstanbul'daki genç girişimcilerin buluşma etkinliği. Proje fikirlerinizi paylaşın, yeni ortaklar bulun ve networking yapın.",
    date: "2024-02-15T19:00:00",
    location: "Beyoğlu, İstanbul",
    created_by: "other-user-1",
    category: "Startup",
    is_premium: true,
    created_at: "2024-02-01T10:00:00",
    createdBy: {
      name: "Ahmet Yılmaz",
      avatar: "",
      rating: 4.8,
      isPremium: true,
    },
    participants: 12,
    maxParticipants: 20,
    isPremiumEvent: true,
  },
  {
    id: "2",
    title: "Basketbol Maçı",
    description:
      "Kadıköy sahilinde arkadaşça basketbol maçı. Tüm seviyelerden oyuncular katılabilir.",
    date: "2024-02-14T16:00:00",
    location: "Kadıköy Sahili, İstanbul",
    created_by: "other-user-2",
    category: "Spor",
    created_at: "2024-02-01T11:00:00",
    createdBy: {
      name: "Zeynep Kaya",
      avatar: "",
      rating: 4.5,
      isPremium: false,
    },
    participants: 8,
    maxParticipants: 10,
  },
  {
    id: "3",
    title: "Fotoğrafçılık Turu",
    description:
      "Sultanahmet'te gün batımı fotoğraf çekimi. Fotoğraf tutkunları için harika bir deneyim.",
    date: "2024-02-16T17:30:00",
    location: "Sultanahmet, İstanbul",
    created_by: "other-user-3",
    category: "Sanat",
    is_premium: true,
    created_at: "2024-02-01T12:00:00",
    createdBy: {
      name: "Murat Demir",
      avatar: "",
      rating: 4.9,
      isPremium: true,
    },
    participants: 5,
    maxParticipants: 8,
    isPremiumEvent: true,
  },
  {
    id: "4",
    title: "Kod Geliştirme Workshop'u",
    description:
      "React ve TypeScript üzerine pratik workshop. Başlangıç seviyesinden ileri seviyeye kadar.",
    date: "2024-02-17T14:00:00",
    location: "Levent, İstanbul",
    created_by: "other-user-4",
    category: "Teknoloji",
    created_at: "2024-02-01T13:00:00",
    createdBy: {
      name: "Elif Özkan",
      avatar: "",
      rating: 4.7,
      isPremium: false,
    },
    participants: 15,
    maxParticipants: 25,
  },
  {
    id: "5",
    title: "Yoga ve Meditasyon",
    description:
      "Haftanın stresini atalım! Açık havada yoga ve meditasyon seansı.",
    date: "2024-02-18T08:00:00",
    location: "Maçka Parkı, İstanbul",
    created_by: "other-user-5",
    category: "Sağlık",
    created_at: "2024-02-01T14:00:00",
    createdBy: {
      name: "Selin Arslan",
      avatar: "",
      rating: 4.6,
      isPremium: false,
    },
    participants: 18,
    maxParticipants: 25,
  },
  {
    id: "6",
    title: "Kitap Kulübü Buluşması",
    description:
      "Bu ayın kitabı 'Kırmızı Pazartesi'yi tartışıyoruz. Yeni üyeler de hoş geldin!",
    date: "2024-02-19T19:00:00",
    location: "Çukurcuma, İstanbul",
    created_by: "other-user-6",
    category: "Eğitim",
    created_at: "2024-02-01T15:00:00",
    createdBy: {
      name: "Emre Şen",
      avatar: "",
      rating: 4.4,
      isPremium: true,
    },
    participants: 9,
    maxParticipants: 12,
  },
];

const categories = [
  "Tümü",
  "Startup",
  "Spor",
  "Sanat",
  "Teknoloji",
  "Sağlık",
  "Eğitim",
  "Sosyal",
];

interface EventListProps {
  showMyEvents?: boolean;
}

export function EventList({ showMyEvents = false }: EventListProps) {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | null>(
    null,
  );
  const { user, isDemo } = useDemoUser();

  const loadEvents = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        // Demo mode: use mock data
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        let eventsToShow = mockEvents;

        if (showMyEvents) {
          // For demo mode, let's say user created some events
          const demoUserEvents: EventWithDetails[] = [
            {
              id: "demo-event-1",
              title: "Demo Kullanıcının Etkinliği",
              description:
                "Bu demo kullanıcı tarafından oluşturulan örnek bir etkinliktir.",
              date: "2024-02-20T19:00:00",
              location: "İstanbul",
              created_by: "demo-user-id",
              category: "Sosyal",
              created_at: "2024-02-01T16:00:00",
              createdBy: {
                name: "Demo Kullanıcı",
                avatar: "",
                rating: 4.5,
                isPremium: false,
              },
              participants: 3,
              maxParticipants: 10,
            },
          ];
          eventsToShow = demoUserEvents;
        }

        setEvents(eventsToShow);
      } else {
        // Real Supabase integration
        let query = supabase
          .from("events")
          .select(
            `
            *,
            profiles:created_by (
              name,
              avatar_url,
              rating,
              is_premium
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (showMyEvents && user) {
          query = query.eq("created_by", user.id);
        } else if (user) {
          query = query.neq("created_by", user.id);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        const formattedEvents: EventWithDetails[] = (data || []).map(
          (event: any) => ({
            ...event,
            createdBy: {
              name: event.profiles?.name || "Anonim Kullanıcı",
              avatar: event.profiles?.avatar_url,
              rating: event.profiles?.rating || 0,
              isPremium: event.profiles?.is_premium || false,
            },
            participants: Math.floor(Math.random() * 20) + 1, // Mock participant count
            maxParticipants: event.max_participants,
            isPremiumEvent: event.is_premium,
          }),
        );

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Hata",
        description: "Etkinlikler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });

      // Fallback to mock data
      setEvents(showMyEvents ? [] : mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [showMyEvents, user, isDemo]);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-500" />
        <span className="ml-2 text-muted-foreground">
          Etkinlikler yükleniyor...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      {!showMyEvents && (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Etkinlik ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
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
        </div>
      )}

      {/* Category Tags */}
      {!showMyEvents && (
        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`cursor-pointer transition-colors ${
                selectedCategory === category
                  ? "bg-nexus-600 hover:bg-nexus-700"
                  : "hover:bg-nexus-100 dark:hover:bg-nexus-900"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {showMyEvents
              ? "Henüz hiç etkinlik oluşturmamışsın."
              : "Aradığın kriterlere uygun etkinlik bulunamadı."}
          </div>
          {showMyEvents && (
            <Button
              className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              onClick={() => (window.location.href = "/create-event")}
            >
              İlk Etkinliğini Oluştur
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              className="animate-fade-in hover-lift"
              onApply={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!showMyEvents && filteredEvents.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Daha Fazla Etkinlik Yükle
          </Button>
        </div>
      )}

      {/* Application Modal */}
      {selectedEvent && (
        <EventApplicationModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
