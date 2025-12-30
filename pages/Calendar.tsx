import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { EventCalendar } from "@/components/Calendar/EventCalendar";
import { DailyEventDetails } from "@/components/Calendar/DailyEventDetails";

// Mock daily events data
const mockDailyEvents = [
  {
    id: "1",
    title: "React Workshop",
    description: "Modern React geliştirme teknikleri ve en iyi uygulamalar",
    time: "14:00",
    location: "Levent, İstanbul",
    organizer: {
      name: "Elif Demir",
      avatar: "",
      rating: 4.9,
    },
    category: "Teknoloji",
    participants: 18,
    maxParticipants: 25,
    price: 50,
    isJoined: false,
    isPremium: true,
  },
  {
    id: "2",
    title: "Startup Networking",
    description: "Girişimciler ve yatırımcılar için networking etkinliği",
    time: "18:30",
    location: "Kadıköy, İstanbul",
    organizer: {
      name: "Ahmet Kaya",
      avatar: "",
      rating: 4.7,
    },
    category: "Girişimcilik",
    participants: 32,
    maxParticipants: 50,
    isJoined: true,
  },
];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDailyEventsOpen, setIsDailyEventsOpen] = useState(false);
  const [dailyEvents, setDailyEvents] = useState(mockDailyEvents);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // In real app, filter events by selected date
    setDailyEvents(mockDailyEvents);
    setIsDailyEventsOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Etkinlik Takvimi</h1>
          <p className="text-muted-foreground">
            Etkinlikleri takip edin ve takvimde görüntüleyin
          </p>
        </div>

        <EventCalendar onDateSelect={handleDateSelect} />

        <DailyEventDetails
          selectedDate={selectedDate}
          events={dailyEvents}
          isOpen={isDailyEventsOpen}
          onClose={() => setIsDailyEventsOpen(false)}
        />
      </div>
    </Layout>
  );
}
