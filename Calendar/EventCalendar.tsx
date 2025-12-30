import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Filter,
  CalendarDays,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
}

// Mock events for demo user
const mockAcceptedEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "React Workshop",
    date: "2024-02-15",
    time: "14:00",
    location: "Levent, İstanbul",
    category: "Teknoloji",
    status: "upcoming",
    description: "React ve TypeScript üzerine pratik workshop.",
  },
  {
    id: "2",
    title: "Startup Networking",
    date: "2024-02-12",
    time: "19:00",
    location: "Beyoğlu, İstanbul",
    category: "Girişimcilik",
    status: "completed",
    description: "Girişimciler için networking etkinliği.",
  },
  {
    id: "3",
    title: "Yoga Seansı",
    date: "2024-02-18",
    time: "08:00",
    location: "Maçka Parkı, İstanbul",
    category: "Sağlık",
    status: "upcoming",
    description: "Hafta başı motivasyonu için yoga.",
  },
  {
    id: "4",
    title: "Basketbol Maçı",
    date: "2024-02-10",
    time: "16:00",
    location: "Kadıköy Sahili, İstanbul",
    category: "Spor",
    status: "completed",
    description: "Arkadaşça basketbol maçı.",
  },
  {
    id: "5",
    title: "Fotoğrafçılık Turu",
    date: "2024-02-20",
    time: "17:30",
    location: "Sultanahmet, İstanbul",
    category: "Sanat",
    status: "upcoming",
    description: "Gün batımı fotoğraf çekimi.",
  },
  {
    id: "6",
    title: "Kitap Kulübü",
    date: "2024-02-16",
    time: "19:00",
    location: "Çukurcuma, İstanbul",
    category: "Eğitim",
    status: "upcoming",
    description: "Ayın kitabını tartışıyoruz.",
  },
];

const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export function EventCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockAcceptedEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const { user, isDemo } = useDemoUser();

  // Load events from Supabase or use mock data
  useEffect(() => {
    const loadEvents = async () => {
      if (isDemo) {
        // Demo mode: use mock data
        setEvents(mockAcceptedEvents);
      } else {
        // Real Supabase integration would go here
        // const { data } = await supabase
        //   .from('requests')
        //   .select(`
        //     events(*),
        //     status
        //   `)
        //   .eq('user_id', user?.id)
        //   .eq('status', 'accepted');
        setEvents(mockAcceptedEvents);
      }
    };

    if (user) {
      loadEvents();
    }
  }, [user, isDemo]);

  // Get events for a specific date
  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  // Get events for today
  const getTodayEvents = () => {
    const today = new Date().toISOString().split("T")[0];
    return events.filter((event) => event.date === today);
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1); // Start from Monday

    const days = [];
    const currentCalendarDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      // 6 weeks * 7 days
      const dateString = currentCalendarDate.toISOString().split("T")[0];
      const dayEvents = getEventsForDate(dateString);
      const isCurrentMonth = currentCalendarDate.getMonth() === month;
      const isToday = dateString === new Date().toISOString().split("T")[0];

      days.push({
        date: new Date(currentCalendarDate),
        dateString,
        events: dayEvents,
        isCurrentMonth,
        isToday,
      });

      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }

    return days;
  };

  // Generate week days for current week
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const dateString = currentDay.toISOString().split("T")[0];
      const dayEvents = getEventsForDate(dateString);
      const isToday = dateString === new Date().toISOString().split("T")[0];

      days.push({
        date: currentDay,
        dateString,
        events: dayEvents,
        isToday,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <div className="mb-1 p-1 bg-nexus-100 dark:bg-nexus-900 rounded text-xs cursor-pointer hover:bg-nexus-200 dark:hover:bg-nexus-800 transition-colors">
      <div className="font-medium text-nexus-700 dark:text-nexus-300 truncate">
        {event.title}
      </div>
      <div className="text-nexus-600 dark:text-nexus-400 flex items-center gap-1">
        <Clock className="h-2 w-2" />
        {event.time}
      </div>
    </div>
  );

  const EventDetail = ({ event }: { event: CalendarEvent }) => (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {event.description}
            </p>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="secondary"
              className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
            >
              {event.category}
            </Badge>
            <Badge
              className={cn(
                event.status === "completed"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  : event.status === "ongoing"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
              )}
            >
              {event.status === "completed"
                ? "Tamamlandı"
                : event.status === "ongoing"
                  ? "Devam Ediyor"
                  : "Yaklaşan"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Takvimi Görüntüle</h3>
          <p className="text-muted-foreground">
            Etkinlik takviminizi görmek için giri�� yapmanız gerekiyor.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedEvents = showTodayOnly ? getTodayEvents() : events;
  const calendarDays =
    viewMode === "month" ? generateCalendarDays() : generateWeekDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-nexus-600" />
              Etkinlik Takvimim
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={showTodayOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTodayOnly(!showTodayOnly)}
                className={showTodayOnly ? "bg-nexus-600" : ""}
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Bugün
              </Button>
              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "week" | "month")
                }
              >
                <TabsList>
                  <TabsTrigger value="week">Hafta</TabsTrigger>
                  <TabsTrigger value="month">Ay</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {viewMode === "month"
                    ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : `${currentDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} Haftası`}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      viewMode === "month"
                        ? navigateMonth("prev")
                        : navigateWeek("prev")
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Bugün
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      viewMode === "month"
                        ? navigateMonth("next")
                        : navigateWeek("next")
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[80px] p-1 border border-muted cursor-pointer hover:bg-muted/50 transition-colors",
                      viewMode === "month" &&
                        !day.isCurrentMonth &&
                        "text-muted-foreground opacity-50",
                      day.isToday &&
                        "bg-nexus-50 dark:bg-nexus-950 border-nexus-200 dark:border-nexus-800",
                      selectedDate === day.dateString &&
                        "ring-2 ring-nexus-500",
                    )}
                    onClick={() => setSelectedDate(day.dateString)}
                  >
                    <div
                      className={cn(
                        "text-sm mb-1",
                        day.isToday &&
                          "font-bold text-nexus-600 dark:text-nexus-400",
                      )}
                    >
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.events
                        .slice(0, viewMode === "month" ? 2 : 3)
                        .map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      {day.events.length > (viewMode === "month" ? 2 : 3) && (
                        <div className="text-xs text-muted-foreground">
                          +{day.events.length - (viewMode === "month" ? 2 : 3)}{" "}
                          daha
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate
                  ? `${new Date(selectedDate).toLocaleDateString("tr-TR")} Etkinlikleri`
                  : showTodayOnly
                    ? "Bugünkü Etkinlikler"
                    : "Yaklaşan Etkinlikler"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const eventsToShow = selectedDate
                  ? getEventsForDate(selectedDate)
                  : displayedEvents
                      .filter((e) => e.status !== "completed")
                      .slice(0, 5);

                return eventsToShow.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {selectedDate
                        ? "Bu tarihte etkinlik yok"
                        : "Yaklaşan etkinlik yok"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {eventsToShow.map((event) => (
                      <EventDetail key={event.id} event={event} />
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
