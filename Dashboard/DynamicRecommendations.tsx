import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventDetailModal } from "@/components/Events/EventDetailModal";
import { EventApplicationForm } from "@/components/Events/EventApplicationForm";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Heart,
  ExternalLink,
  Sparkles,
  Eye,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants?: number;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    type: "user" | "business";
    isPremium: boolean;
  };
  reason: string;
  friendsAttending?: {
    name: string;
    avatar?: string;
  }[];
  matchScore: number;
  isPremium?: boolean;
  purpose?: string;
  activities?: string[];
  requirements?: string[];
  price?: number;
}

interface UserBehavior {
  attendedCategories: string[];
  ratedCategories: { [key: string]: number };
  friendsEvents: string[];
  preferredTimes: string[];
  preferredLocations: string[];
}

// Mock user behavior data for demo
const mockUserBehavior: UserBehavior = {
  attendedCategories: ["Teknoloji", "Girişimcilik", "Spor"],
  ratedCategories: {
    Teknoloji: 4.8,
    Girişimcilik: 4.5,
    Spor: 4.2,
    Sanat: 3.8,
  },
  friendsEvents: ["event-1", "event-3", "event-5"],
  preferredTimes: ["19:00", "14:00", "18:00"],
  preferredLocations: ["İstanbul", "Ankara"],
};

// Mock recommendations based on behavior
const generateRecommendations = (behavior: UserBehavior): Recommendation[] => [
  {
    id: "rec-1",
    title: "Advanced React Patterns Workshop",
    description:
      "React Hook patterns, Context API optimizasyonu ve performance teknikleri üzerine ileri seviye workshop.",
    date: "2024-02-22T14:00:00",
    location: "Maslak, İstanbul",
    category: "Teknoloji",
    participants: 18,
    maxParticipants: 25,
    organizer: {
      id: "org-1",
      name: "TechCamp İstanbul",
      avatar: "",
      rating: 4.9,
      type: "business",
      isPremium: true,
    },
    reason: "Teknoloji etkinliklerine yüksek puan veriyorsunuz",
    friendsAttending: [
      { name: "Can Özkan", avatar: "" },
      { name: "Elif Yılmaz", avatar: "" },
    ],
    matchScore: 95,
    isPremium: true,
    purpose: "Modern React geliştirme tekniklerini öğrenmek ve networking",
    activities: [
      "Hands-on coding workshop",
      "Best practices sunumu",
      "Q&A seansı",
      "Networking kahvesi",
    ],
    requirements: ["Orta seviye React bilgisi", "Laptop"],
    price: 150,
  },
  {
    id: "rec-2",
    title: "Startup Pitch Night",
    description:
      "Girişimcilerin projelerini sunduğu ve geri bildirim aldığı networking etkinliği.",
    date: "2024-02-24T19:00:00",
    location: "Beyoğlu, İstanbul",
    category: "Girişimcilik",
    participants: 35,
    maxParticipants: 50,
    organizer: {
      id: "org-2",
      name: "Zeynep Kara",
      avatar: "",
      rating: 4.7,
      type: "user",
      isPremium: false,
    },
    reason: "Girişimcilik etkinliklerine sık katılıyorsunuz",
    friendsAttending: [{ name: "Mert Kaya", avatar: "" }],
    matchScore: 88,
    purpose: "Girişimci ekosisteminde networking ve proje paylaşımı",
    activities: [
      "5 dakikalık pitch sunumları",
      "Feedback seansı",
      "Networking cocktail",
      "Mentor buluşmaları",
    ],
    requirements: ["Startup projesi", "Pitch deck"],
  },
  {
    id: "rec-3",
    title: "Futbol Turnuvası",
    description:
      "5'er kişilik takımlarla düzenlenen dostane futbol turnuvası. Tüm seviyelerden oyuncular katılabilir.",
    date: "2024-02-25T10:00:00",
    location: "Maçka, İstanbul",
    category: "Spor",
    participants: 24,
    maxParticipants: 30,
    organizer: {
      name: "Barış Özdemir",
      avatar: "",
      rating: 4.4,
    },
    reason: "Arkadaşlarınız bu etkinliğe katılıyor",
    friendsAttending: [
      { name: "Ayşe Demir", avatar: "" },
      { name: "Ali Koç", avatar: "" },
    ],
    matchScore: 82,
  },
  {
    id: "rec-4",
    title: "Product Design Meetup",
    description:
      "UX/UI tasarımcıları için portfolio paylaşımı ve networking etkinliği.",
    date: "2024-02-26T18:00:00",
    location: "Kadıköy, İstanbul",
    category: "Tasarım",
    participants: 28,
    maxParticipants: 35,
    organizer: {
      name: "Selin Yılmaz",
      avatar: "",
      rating: 4.6,
    },
    reason: "Sanat etkinliklerine ilgi gösteriyorsunuz",
    matchScore: 75,
  },
  {
    id: "rec-5",
    title: "Blockchain & Crypto Sohbeti",
    description:
      "Kripto para ve blockchain teknolojileri hakkında bilgi paylaşımı ve tartışma.",
    date: "2024-02-27T19:00:00",
    location: "Şişli, İstanbul",
    category: "Teknoloji",
    participants: 22,
    maxParticipants: 30,
    organizer: {
      name: "Emre Kaya",
      avatar: "",
      rating: 4.3,
    },
    reason: "Teknoloji kategorisini tercih ediyorsunuz",
    matchScore: 78,
    isPremium: true,
  },
];

interface DynamicRecommendationsProps {
  maxItems?: number;
}

export function DynamicRecommendations({
  maxItems = 6,
}: DynamicRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Recommendation | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const { user, isDemo } = useDemoUser();

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);

      try {
        if (isDemo && user) {
          // Demo mode: generate based on mock behavior
          await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate loading
          const recs = generateRecommendations(mockUserBehavior);

          // Sort by match score and limit
          const sortedRecs = recs
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, maxItems);

          setRecommendations(sortedRecs);
        } else {
          // Real implementation would analyze user behavior from Supabase
          // const behavior = await analyzeUserBehavior(user.id);
          // const recs = await generateSmartRecommendations(behavior);
          setRecommendations([]);
        }
      } catch (error) {
        console.error("Error loading recommendations:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadRecommendations();
    }
  }, [user, isDemo, maxItems]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const handleViewEvent = (event: Recommendation) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
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

  const RecommendationCard = ({
    recommendation,
  }: {
    recommendation: Recommendation;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
      {recommendation.isPremium && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
            Premium
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight mb-2">
                {recommendation.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                >
                  {recommendation.category}
                </Badge>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${getMatchColor(recommendation.matchScore)}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {recommendation.matchScore}% eşleşme
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recommendation.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-nexus-500" />
              <span>
                {formatDate(recommendation.date)} -{" "}
                {formatTime(recommendation.date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-nexus-500" />
              <span>{recommendation.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-nexus-500" />
              <span>
                {recommendation.participants}
                {recommendation.maxParticipants &&
                  `/${recommendation.maxParticipants}`}{" "}
                katılımcı
              </span>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recommendation.organizer.avatar} />
              <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300 text-xs">
                {recommendation.organizer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {recommendation.organizer.name}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{recommendation.organizer.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Friends Attending */}
          {recommendation.friendsAttending &&
            recommendation.friendsAttending.length > 0 && (
              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Arkadaşların da katılıyor
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {recommendation.friendsAttending
                    .slice(0, 3)
                    .map((friend, index) => (
                      <Avatar key={index} className="h-6 w-6">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                          {friend.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                    {recommendation.friendsAttending
                      .map((f) => f.name)
                      .join(", ")}
                  </span>
                </div>
              </div>
            )}

          {/* Recommendation Reason */}
          <div className="bg-nexus-50 dark:bg-nexus-950 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-nexus-600" />
              <span className="text-sm text-nexus-700 dark:text-nexus-300">
                {recommendation.reason}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
            size="sm"
            onClick={() => handleViewEvent(recommendation)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Etkinlik Detayları
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Kişiselleştirilmiş Öneriler
          </h3>
          <p className="text-muted-foreground">
            Size özel etkinlik önerileri görmek için giriş yapmanız gerekiyor.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Size Özel Öneriler</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-nexus-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Size Özel Öneriler</h2>
          <p className="text-muted-foreground">
            İlgi alanlarınız ve arkadaşlarınızın aktivitelerine göre seçildi
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI Destekli
        </Badge>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz Öneri Yok</h3>
            <p className="text-muted-foreground">
              Daha fazla etkinliğe katılın, size özel öneriler oluşturabilelim.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}

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
              avatar: selectedEvent.organizer.avatar,
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
              avatar: selectedEvent.organizer.avatar,
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
