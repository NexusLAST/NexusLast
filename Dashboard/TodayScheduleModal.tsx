import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { supabase } from "@/lib/supabase";

interface TodayEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  category: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
}

// Mock data for demo mode
const mockTodayEvents: TodayEvent[] = [
  {
    id: "1",
    title: "Startup Networking Kahvaltısı",
    description:
      "Girişimci arkadaşlarla networking kahvaltısı. Projelerinizi paylaşın ve yeni ortaklıklar kurun.",
    time: "09:00",
    location: "Kadıköy Çarşı, İstanbul",
    category: "Startup",
    participants: 8,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Yoga ve Meditasyon",
    description: "Hafta içi stresini atacağımız açık hava yoga seansı.",
    time: "18:30",
    location: "Maçka Parkı, İstanbul",
    category: "Sağlık",
    participants: 15,
    status: "upcoming",
  },
];

interface TodayScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodayScheduleModal({
  isOpen,
  onClose,
}: TodayScheduleModalProps) {
  const [events, setEvents] = useState<TodayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isDemo } = useDemoUser();

  const loadTodayEvents = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        // Demo mode: use mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        setEvents(mockTodayEvents);
      } else {
        // Real Supabase integration
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(
          today.setHours(23, 59, 59, 999),
        ).toISOString();

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("date", startOfDay)
          .lte("date", endOfDay)
          .order("date", { ascending: true });

        if (error) throw error;

        const formattedEvents: TodayEvent[] = (data || []).map((event: any) => {
          const eventTime = new Date(event.date);
          const now = new Date();

          let status: "upcoming" | "ongoing" | "completed" = "upcoming";
          if (eventTime < now) {
            const timeDiff = now.getTime() - eventTime.getTime();
            status = timeDiff > 2 * 60 * 60 * 1000 ? "completed" : "ongoing"; // 2 hours
          }

          return {
            id: event.id,
            title: event.title,
            description: event.description,
            time: eventTime.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: event.location,
            category: event.category,
            participants: Math.floor(Math.random() * 20) + 1,
            status,
          };
        });

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error loading today events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTodayEvents();
    }
  }, [isOpen, isDemo]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-6 w-6 text-nexus-600" />
            Bugünkü Programın
          </DialogTitle>
          <DialogDescription>
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            tarihinde katılacağın etkinlikler
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexus-600"></div>
              <span className="ml-3 text-muted-foreground">
                Etkinlikler yükleniyor...
              </span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Bugün Hiç Etkinlik Yok
              </h3>
              <p className="text-muted-foreground mb-6">
                Bugün için planlanmış herhangi bir etkinliğin bulunmuyor.
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                Yeni Etkinlikler Keşfet
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
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
                          <Badge className={getStatusColor(event.status)}>
                            {getStatusText(event.status)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {event.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-nexus-500" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-nexus-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-nexus-500" />
                        <span>{event.participants} katılımcı</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                        disabled={event.status === "completed"}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {event.status === "completed"
                          ? "Tamamlandı"
                          : "Etkinliğe Git"}
                      </Button>
                      <Button variant="outline" size="sm">
                        Detaylar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {events.length > 0 && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Kapat
              </Button>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                Daha Fazla Etkinlik Gör
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
