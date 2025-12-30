import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Users,
  Calendar,
  Star,
  Crown,
  Heart,
  Zap,
  Target,
  Trophy,
  Medal,
  Shield,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { cn } from "@/lib/utils";

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  requirement: number;
  current: number;
  category: "social" | "organizer" | "quality" | "special";
}

interface UserStats {
  eventsAttended: number;
  eventsOrganized: number;
  averageRating: number;
  totalRatings: number;
  friendsCount: number;
  daysActive: number;
}

// Mock user stats for demo
const mockUserStats: UserStats = {
  eventsAttended: 12,
  eventsOrganized: 3,
  averageRating: 4.5,
  totalRatings: 8,
  friendsCount: 28,
  daysActive: 45,
};

const generateBadges = (stats: UserStats): UserBadge[] => [
  // Social Badges
  {
    id: "social-newbie",
    name: "Yeni Sosyalci",
    description: "5 etkinliğe katıl",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    earned: stats.eventsAttended >= 5,
    earnedDate: stats.eventsAttended >= 5 ? "2024-02-10" : undefined,
    progress: Math.min((stats.eventsAttended / 5) * 100, 100),
    requirement: 5,
    current: stats.eventsAttended,
    category: "social",
  },
  {
    id: "social-enthusiast",
    name: "Sosyal Kaplan",
    description: "20 etkinliğe katıl",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900",
    earned: stats.eventsAttended >= 20,
    progress: Math.min((stats.eventsAttended / 20) * 100, 100),
    requirement: 20,
    current: stats.eventsAttended,
    category: "social",
  },
  {
    id: "friend-magnet",
    name: "Arkadaş Mıknatısı",
    description: "50 arkadaş edin",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
    earned: stats.friendsCount >= 50,
    progress: Math.min((stats.friendsCount / 50) * 100, 100),
    requirement: 50,
    current: stats.friendsCount,
    category: "social",
  },

  // Quality Badges
  {
    id: "reliable",
    name: "Güvenilir",
    description: "4.0+ ortalama puan al",
    icon: Shield,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
    earned: stats.averageRating >= 4.0,
    earnedDate: stats.averageRating >= 4.0 ? "2024-02-08" : undefined,
    progress: Math.min((stats.averageRating / 5.0) * 100, 100),
    requirement: 4.0,
    current: stats.averageRating,
    category: "quality",
  },
  {
    id: "superstar",
    name: "Süperstar",
    description: "4.8+ ortalama puan al",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    earned: stats.averageRating >= 4.8,
    progress: Math.min((stats.averageRating / 5.0) * 100, 100),
    requirement: 4.8,
    current: stats.averageRating,
    category: "quality",
  },
  {
    id: "well-rated",
    name: "Çok Beğenilen",
    description: "20 puan değerlendirmesi al",
    icon: Trophy,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900",
    earned: stats.totalRatings >= 20,
    progress: Math.min((stats.totalRatings / 20) * 100, 100),
    requirement: 20,
    current: stats.totalRatings,
    category: "quality",
  },

  // Organizer Badges
  {
    id: "organizer",
    name: "Organizatör",
    description: "3 etkinlik düzenle",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    earned: stats.eventsOrganized >= 3,
    earnedDate: stats.eventsOrganized >= 3 ? "2024-02-05" : undefined,
    progress: Math.min((stats.eventsOrganized / 3) * 100, 100),
    requirement: 3,
    current: stats.eventsOrganized,
    category: "organizer",
  },
  {
    id: "event-master",
    name: "Etkinlik Ustası",
    description: "10 etkinlik düzenle",
    icon: Crown,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900",
    earned: stats.eventsOrganized >= 10,
    progress: Math.min((stats.eventsOrganized / 10) * 100, 100),
    requirement: 10,
    current: stats.eventsOrganized,
    category: "organizer",
  },

  // Special Badges
  {
    id: "early-adopter",
    name: "Erken Benimseyici",
    description: "İlk 30 gün içinde 5 etkinliğe katıl",
    icon: Zap,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
    earned: stats.daysActive <= 30 && stats.eventsAttended >= 5,
    earnedDate:
      stats.daysActive <= 30 && stats.eventsAttended >= 5
        ? "2024-02-01"
        : undefined,
    progress:
      stats.daysActive <= 30
        ? Math.min((stats.eventsAttended / 5) * 100, 100)
        : 0,
    requirement: 5,
    current: stats.eventsAttended,
    category: "special",
  },
  {
    id: "community-champion",
    name: "Topluluk Şampiyonu",
    description: "100 arkadaş + 50 etkinlik + 4.5+ puan",
    icon: Medal,
    color: "text-rose-600",
    bgColor: "bg-rose-100 dark:bg-rose-900",
    earned:
      stats.friendsCount >= 100 &&
      stats.eventsAttended >= 50 &&
      stats.averageRating >= 4.5,
    progress: Math.min(
      ((stats.friendsCount / 100 +
        stats.eventsAttended / 50 +
        stats.averageRating / 5) /
        3) *
        100,
      100,
    ),
    requirement: 100, // Complex requirement
    current: Math.floor(
      ((stats.friendsCount / 100 +
        stats.eventsAttended / 50 +
        stats.averageRating / 5) /
        3) *
        100,
    ),
    category: "special",
  },
];

const categoryInfo = {
  social: { name: "Sosyal", color: "text-blue-600", icon: Users },
  organizer: { name: "Organizatör", color: "text-purple-600", icon: Calendar },
  quality: { name: "Kalite", color: "text-green-600", icon: Star },
  special: { name: "Özel", color: "text-rose-600", icon: Crown },
};

interface BadgeSystemProps {
  showCategories?: boolean;
  maxBadges?: number;
}

export function BadgeSystem({
  showCategories = true,
  maxBadges,
}: BadgeSystemProps) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<UserStats>(mockUserStats);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user, isDemo } = useDemoUser();

  useEffect(() => {
    const loadBadges = async () => {
      if (isDemo && user) {
        // Demo mode: use mock stats and generate badges
        const userBadges = generateBadges(mockUserStats);
        setBadges(userBadges);
        setStats(mockUserStats);
      } else if (user) {
        // Real Supabase integration would go here
        // const userStats = await loadUserStats(user.id);
        // const userBadges = generateBadges(userStats);
        setBadges([]);
      }
    };

    loadBadges();
  }, [user, isDemo]);

  const filteredBadges = selectedCategory
    ? badges.filter((badge) => badge.category === selectedCategory)
    : badges;

  const displayedBadges = maxBadges
    ? filteredBadges.slice(0, maxBadges)
    : filteredBadges;

  const earnedBadges = badges.filter((badge) => badge.earned);
  const progressBadges = badges.filter(
    (badge) => !badge.earned && badge.progress! > 0,
  );

  const BadgeCard = ({
    badge,
    showProgress = true,
  }: {
    badge: UserBadge;
    showProgress?: boolean;
  }) => {
    const Icon = badge.icon;

    return (
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          badge.earned
            ? "ring-2 ring-green-200 dark:ring-green-800 hover:-translate-y-1"
            : "opacity-75 hover:opacity-100",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "p-2 rounded-full",
                badge.earned ? badge.bgColor : "bg-gray-100 dark:bg-gray-800",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  badge.earned ? badge.color : "text-gray-400",
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={cn(
                    "font-semibold text-sm",
                    badge.earned ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {badge.name}
                </h4>
                {badge.earned && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs"
                  >
                    ✓
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {badge.description}
              </p>

              {badge.earnedDate && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  {new Date(badge.earnedDate).toLocaleDateString("tr-TR")}{" "}
                  tarihinde kazanıldı
                </p>
              )}

              {!badge.earned &&
                showProgress &&
                badge.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {badge.current} / {badge.requirement}
                      </span>
                      <span className="text-muted-foreground">
                        %{Math.round(badge.progress)}
                      </span>
                    </div>
                    <Progress value={badge.progress} className="h-2" />
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Rozet Sistemi</h3>
          <p className="text-muted-foreground">
            Rozetlerinizi görmek için giriş yapmanız gerekiyor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-nexus-600" />
            Başarı Rozetleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {earnedBadges.length}
              </div>
              <div className="text-sm text-muted-foreground">Kazanılan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progressBadges.length}
              </div>
              <div className="text-sm text-muted-foreground">İlerleme Var</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {badges.length - earnedBadges.length}
              </div>
              <div className="text-sm text-muted-foreground">Kalan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nexus-600">
                {Math.round((earnedBadges.length / badges.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Tamamlama</div>
            </div>
          </div>

          <Progress
            value={(earnedBadges.length / badges.length) * 100}
            className="h-3"
          />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Genel İlerleme: {earnedBadges.length}/{badges.length} rozet
          </p>
        </CardContent>
      </Card>

      {/* Category Filters */}
      {showCategories && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-nexus-600" : ""}
          >
            Tümü ({badges.length})
          </Button>
          {Object.entries(categoryInfo).map(([key, info]) => {
            const categoryBadges = badges.filter((b) => b.category === key);
            const Icon = info.icon;

            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "flex items-center gap-1",
                  selectedCategory === key ? "bg-nexus-600" : "",
                )}
              >
                <Icon className="h-3 w-3" />
                {info.name} ({categoryBadges.length})
              </Button>
            );
          })}
        </div>
      )}

      {/* Earned Badges */}
      {earnedBadges.length > 0 &&
        (selectedCategory === null ||
          earnedBadges.some((b) => b.category === selectedCategory)) && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              Kazanılan Rozetler (
              {
                earnedBadges.filter(
                  (b) => !selectedCategory || b.category === selectedCategory,
                ).length
              }
              )
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges
                .filter(
                  (badge) =>
                    !selectedCategory || badge.category === selectedCategory,
                )
                .map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    showProgress={false}
                  />
                ))}
            </div>
          </div>
        )}

      {/* Progress Badges */}
      {progressBadges.length > 0 &&
        (selectedCategory === null ||
          progressBadges.some((b) => b.category === selectedCategory)) && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              İlerleme Kaydedilen Rozetler (
              {
                progressBadges.filter(
                  (b) => !selectedCategory || b.category === selectedCategory,
                ).length
              }
              )
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressBadges
                .filter(
                  (badge) =>
                    !selectedCategory || badge.category === selectedCategory,
                )
                .sort((a, b) => (b.progress || 0) - (a.progress || 0))
                .map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
          </div>
        )}

      {/* Locked Badges */}
      {(() => {
        const lockedBadges = badges.filter(
          (badge) => !badge.earned && (!badge.progress || badge.progress === 0),
        );
        const filteredLocked = lockedBadges.filter(
          (badge) => !selectedCategory || badge.category === selectedCategory,
        );

        return (
          filteredLocked.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gray-400" />
                Henüz Kazanılmayan Rozetler ({filteredLocked.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLocked.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )
        );
      })()}
    </div>
  );
}
