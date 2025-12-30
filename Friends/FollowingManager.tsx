import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Search,
  Star,
  Calendar,
  Users,
  UserX,
  ExternalLink,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FollowedBusiness {
  id: string;
  name: string;
  avatar?: string;
  type: "business";
  category: string;
  rating: number;
  location: string;
  followedSince: string;
  activeEvents: number;
  pastEvents: number;
  description?: string;
  recentEvents: Array<{
    id: string;
    title: string;
    date: string;
    participants: number;
  }>;
}

// Mock data for followed businesses
const mockFollowedBusinesses: FollowedBusiness[] = [
  {
    id: "business-1",
    name: "TechCamp İstanbul",
    avatar: "",
    type: "business",
    category: "Teknoloji",
    rating: 4.9,
    location: "İstanbul",
    followedSince: "2024-01-15",
    activeEvents: 3,
    pastEvents: 12,
    description:
      "Teknoloji eğitimleri ve bootcamp organizasyonu yapan eğitim kurumu",
    recentEvents: [
      {
        id: "event-1",
        title: "React Native Workshop",
        date: "2024-02-20T14:00:00",
        participants: 25,
      },
      {
        id: "event-2",
        title: "JavaScript Fundamentals",
        date: "2024-02-25T18:00:00",
        participants: 18,
      },
    ],
  },
  {
    id: "business-2",
    name: "Startup Hub İstanbul",
    avatar: "",
    type: "business",
    category: "Girişimcilik",
    rating: 4.7,
    location: "İstanbul",
    followedSince: "2024-02-01",
    activeEvents: 2,
    pastEvents: 8,
    description:
      "Girişimci ekosistemi için networking ve mentorship etkinlikleri",
    recentEvents: [
      {
        id: "event-3",
        title: "Pitch Night #12",
        date: "2024-02-22T19:00:00",
        participants: 45,
      },
    ],
  },
  {
    id: "business-3",
    name: "Yoga Center Maçka",
    avatar: "",
    type: "business",
    category: "Sağlık",
    rating: 4.8,
    location: "İstanbul",
    followedSince: "2024-01-28",
    activeEvents: 4,
    pastEvents: 15,
    description: "Yoga, meditasyon ve wellness programları",
    recentEvents: [
      {
        id: "event-4",
        title: "Sabah Yoga Seansı",
        date: "2024-02-21T08:00:00",
        participants: 12,
      },
      {
        id: "event-5",
        title: "Meditasyon Workshop",
        date: "2024-02-24T17:00:00",
        participants: 15,
      },
    ],
  },
];

export function FollowingManager() {
  const [followedBusinesses, setFollowedBusinesses] = useState<
    FollowedBusiness[]
  >(mockFollowedBusinesses);
  const [searchTerm, setSearchTerm] = useState("");
  const [unfollowingBusiness, setUnfollowingBusiness] = useState<string | null>(
    null,
  );
  const [selectedBusiness, setSelectedBusiness] =
    useState<FollowedBusiness | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredBusinesses = followedBusinesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUnfollow = async (businessId: string, businessName: string) => {
    setUnfollowingBusiness(businessId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFollowedBusinesses((prev) =>
        prev.filter((business) => business.id !== businessId),
      );

      toast({
        title: "Takip Bırakıldı",
        description: `${businessName} işletmesini takip etmeyi bıraktınız.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description:
          "Takip bırakma işlemi gerçekleştirilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUnfollowingBusiness(null);
    }
  };

  const handleViewDetails = (business: FollowedBusiness) => {
    setSelectedBusiness(business);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays < 30) return `${diffInDays} gün önce`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ay önce`;
    return `${Math.floor(diffInDays / 365)} yıl önce`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Teknoloji:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Girişimcilik:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Sağlık:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Sanat:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Spor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Takip Ettiklerim
          </h3>
          <p className="text-sm text-muted-foreground">
            {followedBusinesses.length} işletme takip ediyorsunuz
          </p>
        </div>
        <Badge variant="secondary">
          <TrendingUp className="h-3 w-3 mr-1" />
          İşletme Takibi
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="İşletme ara..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Followed Businesses List */}
      {filteredBusinesses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-semibold mb-2">
              {searchTerm ? "İşletme Bulunamadı" : "Takip Edilen İşletme Yok"}
            </h4>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Arama kriterlerinize uygun işletme bulunamadı."
                : "Henüz hiç işletme takip etmiyorsunuz. Etkinliklerde işletmeleri takip edebilirsiniz."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBusinesses.map((business) => (
            <Card
              key={business.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100 dark:ring-blue-800">
                    <AvatarImage src={business.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Building2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{business.name}</h4>
                          <Badge
                            className={getCategoryColor(business.category)}
                          >
                            {business.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{business.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{business.location}</span>
                          </div>
                          <span>
                            Takip: {formatDate(business.followedSince)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {business.activeEvents} aktif
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {business.pastEvents} geçmiş
                        </div>
                      </div>
                    </div>

                    {business.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    {/* Recent Events */}
                    {business.recentEvents.length > 0 && (
                      <div className="bg-muted/30 rounded-lg p-3">
                        <h5 className="text-sm font-medium mb-2">
                          Son Etkinlikler
                        </h5>
                        <div className="space-y-1">
                          {business.recentEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="font-medium">{event.title}</span>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(event.date).toLocaleDateString(
                                    "tr-TR",
                                  )}
                                </span>
                                <Users className="h-3 w-3" />
                                <span>{event.participants}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(business)}
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Detayları Gör
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUnfollow(business.id, business.name)
                        }
                        disabled={unfollowingBusiness === business.id}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950"
                      >
                        {unfollowingBusiness === business.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Takip Bırak
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Business Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBusiness && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-800">
                    <AvatarImage src={selectedBusiness.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Building2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{selectedBusiness.name}</span>
                      <Badge
                        className={getCategoryColor(selectedBusiness.category)}
                      >
                        {selectedBusiness.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{selectedBusiness.rating.toFixed(1)} puan</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{selectedBusiness.location}</span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedBusiness.activeEvents}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Aktif Etkinlik
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedBusiness.pastEvents}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Geçmiş Etkinlik
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {formatDate(selectedBusiness.followedSince)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Takip Süresi
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedBusiness.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Hakkında</h4>
                    <p className="text-muted-foreground">
                      {selectedBusiness.description}
                    </p>
                  </div>
                )}

                {/* All Recent Events */}
                <div>
                  <h4 className="font-semibold mb-3">Son Etkinlikler</h4>
                  {selectedBusiness.recentEvents.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Henüz etkinlik bulunmuyor.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedBusiness.recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{event.title}</h5>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(event.date).toLocaleDateString(
                                    "tr-TR",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{event.participants} katılımcı</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUnfollow(selectedBusiness.id, selectedBusiness.name)
                    }
                    disabled={unfollowingBusiness === selectedBusiness.id}
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950"
                  >
                    {unfollowingBusiness === selectedBusiness.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        İşlem yapılıyor...
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Takip Bırak
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
