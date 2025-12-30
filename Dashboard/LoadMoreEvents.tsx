import { useState } from "react";
import { EventCard } from "@/components/Events/EventCard";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
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

interface LoadMoreEventsProps {
  initialEvents: Event[];
  pageSize?: number;
  showCloneButton?: boolean;
}

// Mock function to simulate fetching more events
const fetchMoreEvents = async (
  page: number,
  pageSize: number,
): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate mock events for next page
  const mockEvents: Event[] = Array.from({ length: pageSize }, (_, index) => ({
    id: `load-more-${page}-${index}`,
    title: `Etkinlik ${page * pageSize + index + 1}`,
    description: `Bu sayfa ${page} için otomatik oluşturulan örnek etkinlik açıklaması.`,
    date: new Date(
      Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    location: ["İstanbul", "Ankara", "İzmir", "Bursa"][
      Math.floor(Math.random() * 4)
    ],
    createdBy: {
      name: ["Ahmet Yılmaz", "Elif Kaya", "Murat Demir", "Zeynep Öz"][
        Math.floor(Math.random() * 4)
      ],
      rating: 4 + Math.random(),
      isPremium: Math.random() > 0.7,
    },
    participants: Math.floor(Math.random() * 50) + 5,
    maxParticipants: Math.floor(Math.random() * 30) + 20,
    category: ["Teknoloji", "Spor", "Sanat", "Girişimcilik", "Sağlık"][
      Math.floor(Math.random() * 5)
    ],
    isPremiumEvent: Math.random() > 0.8,
  }));

  return mockEvents;
};

export function LoadMoreEvents({
  initialEvents,
  pageSize = 6,
  showCloneButton = false,
}: LoadMoreEventsProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setLoadError(false);

    try {
      const nextPage = currentPage + 1;
      const newEvents = await fetchMoreEvents(nextPage, pageSize);

      if (newEvents.length < pageSize) {
        setHasMore(false);
      }

      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setCurrentPage(nextPage);

      toast({
        title: "Yeni Etkinlikler Yüklendi",
        description: `${newEvents.length} yeni etkinlik daha gösteriliyor.`,
      });
    } catch (error) {
      setLoadError(true);
      toast({
        title: "Yükleme Hatası",
        description:
          "Etkinlikler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryLoad = () => {
    setLoadError(false);
    handleLoadMore();
  };

  return (
    <div className="space-y-6">
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showCloneButton={showCloneButton}
            onApply={() => {
              toast({
                title: "Başvuru Gönderildi!",
                description: `${event.title} etkinliğine başvurunuz alındı.`,
              });
            }}
          />
        ))}
      </div>

      {/* Load More Section */}
      <div className="flex flex-col items-center space-y-4">
        {/* Stats */}
        <div className="text-sm text-muted-foreground text-center">
          <p>
            {events.length} etkinlik gösteriliyor
            {hasMore && " • Daha fazla etkinlik mevcut"}
          </p>
        </div>

        {/* Load More Button */}
        {hasMore && !loadError && (
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px] hover:bg-nexus-50 hover:border-nexus-300 dark:hover:bg-nexus-950"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Daha Fazla Yükle
              </>
            )}
          </Button>
        )}

        {/* Error State */}
        {loadError && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Etkinlikler yüklenirken bir hata oluştu
            </p>
            <Button onClick={retryLoad} variant="outline" size="sm">
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* End Message */}
        {!hasMore && events.length > initialEvents.length && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              🎉 Tüm etkinlikler yüklendi!
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Yeni etkinlikler için sayfayı yenileyebilirsiniz
            </p>
          </div>
        )}

        {/* Page Info */}
        {currentPage > 1 && (
          <div className="text-xs text-muted-foreground">
            Sayfa {currentPage} • Toplam {events.length} etkinlik
          </div>
        )}
      </div>
    </div>
  );
}
