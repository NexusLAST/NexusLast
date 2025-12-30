import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Users,
  Calendar,
  MapPin,
  Heart,
  UserPlus,
  Award,
  Trophy,
  Medal,
  Crown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "social" | "quality" | "organizer" | "special";
  color: string;
}

interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  purpose: string;
  rating: number;
  eventsAttended: number;
  lastActive: string;
  location: string;
  isPremium: boolean;
  mutualEvents: number;
  isFriend: boolean;
  badges: UserBadge[];
  bio?: string;
  joinedDate: string;
  eventHistory: Array<{
    id: string;
    title: string;
    date: string;
    rating: number;
  }>;
}

interface UserCardProps {
  user: CommunityUser;
  onSendFriendRequest: (userId: string, userName: string) => Promise<void>;
  sendingRequest: string | null;
}

const getBadgeIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    trophy: Trophy,
    medal: Medal,
    crown: Crown,
    award: Award,
    star: Star,
    users: Users,
  };
  return icons[iconName] || Award;
};

const getBadgeColor = (color: string) => {
  const colors: Record<string, string> = {
    gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    silver: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    bronze:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  };
  return colors[color] || colors.blue;
};

export function UserCard({
  user,
  onSendFriendRequest,
  sendingRequest,
}: UserCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleFriendRequest = async () => {
    await onSendFriendRequest(user.id, user.name);
  };

  const activeBadges = user.badges.slice(0, 3); // Show only first 3 badges on card

  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-nexus-100 dark:ring-nexus-800">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg group-hover:text-nexus-600 transition-colors">
                    {user.name}
                  </h3>
                  {user.isPremium && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0 border-yellow-400 text-yellow-600"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {user.purpose}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{user.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Active Badges */}
            {activeBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {activeBadges.map((badge) => {
                  const IconComponent = getBadgeIcon(badge.icon);
                  return (
                    <Badge
                      key={badge.id}
                      className={`text-xs px-2 py-1 flex items-center gap-1 ${getBadgeColor(badge.color)}`}
                      title={badge.description}
                    >
                      <IconComponent className="h-3 w-3" />
                      {badge.name}
                    </Badge>
                  );
                })}
                {user.badges.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{user.badges.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{user.eventsAttended} etkinlik</span>
              </div>
              {user.mutualEvents > 0 && (
                <div className="flex items-center gap-1 text-nexus-600 font-medium">
                  <Users className="h-3 w-3" />
                  <span>{user.mutualEvents} ortak etkinlik</span>
                </div>
              )}
              <span>Son aktif: {user.lastActive}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {user.isFriend ? (
                <Button size="sm" variant="outline" disabled className="flex-1">
                  <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                  Arkadaş
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleFriendRequest}
                  disabled={sendingRequest === user.id}
                  className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                >
                  {sendingRequest === user.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Arkadaş Ekle
                    </>
                  )}
                </Button>
              )}

              <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex-1">
                    Detayları Gör
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          {user.isPremium && (
                            <Badge
                              variant="outline"
                              className="text-xs border-yellow-400 text-yellow-600"
                            >
                              <Crown className="h-3 w-3 mr-1" />
                              Pro
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-normal">
                          {user.purpose}
                        </p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 mt-6">
                    {/* User Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">
                          {user.rating.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Ortalama Puan
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">
                          {user.eventsAttended}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Etkinlik
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">
                          {user.mutualEvents}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Ortak Etkinlik
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">
                          {user.badges.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rozet
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <div>
                        <h4 className="font-semibold mb-2">Hakkında</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.bio}
                        </p>
                      </div>
                    )}

                    {/* All Badges */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        Rozetler ({user.badges.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {user.badges.map((badge) => {
                          const IconComponent = getBadgeIcon(badge.icon);
                          return (
                            <div
                              key={badge.id}
                              className={`p-3 rounded-lg border ${getBadgeColor(badge.color)} border-current/20`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <IconComponent className="h-4 w-4" />
                                <span className="font-medium text-sm">
                                  {badge.name}
                                </span>
                              </div>
                              <p className="text-xs opacity-80">
                                {badge.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Event History */}
                    {user.eventHistory.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Son Etkinlikler</h4>
                        <div className="space-y-2">
                          {user.eventHistory.slice(0, 5).map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {event.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString(
                                    "tr-TR",
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {event.rating}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons in Modal */}
                    <div className="flex gap-2 pt-4 border-t">
                      {user.isFriend ? (
                        <Button variant="outline" disabled className="flex-1">
                          <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                          Zaten Arkadaş
                        </Button>
                      ) : (
                        <Button
                          onClick={handleFriendRequest}
                          disabled={sendingRequest === user.id}
                          className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                        >
                          {sendingRequest === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <UserPlus className="h-4 w-4 mr-2" />
                          )}
                          Arkadaş Ekle
                        </Button>
                      )}
                      <Button variant="outline" className="flex-1">
                        Mesaj Gönder
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
