import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FollowBusinessButton } from "@/components/UI/FollowBusinessButton";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  Flag,
  UserPlus,
  Target,
  Activity,
  Navigation,
  Building2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventDetailProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    createdBy: {
      id: string;
      name: string;
      avatar?: string;
      rating: number;
      isPremium: boolean;
      type: "user" | "business";
    };
    participants: number;
    maxParticipants?: number;
    category: string;
    isPremiumEvent?: boolean;
    purpose?: string;
    activities?: string[];
    requirements?: string[];
    price?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  isOwnEvent?: boolean;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onApply,
  isOwnEvent = false,
}: EventDetailProps) {
  const [isSharing, setIsSharing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `${event.title} etkinliğine katılmak ister misin?`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Kopyalandı!",
          description: "Etkinlik linki panoya kopyalandı.",
        });
      }
    } catch (error) {
      console.log("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    window.open(googleMapsUrl, "_blank");
  };

  const defaultActivities = [
    "Networking ve tanışma",
    "Grup aktiviteleri",
    "Deneyim paylaşımı",
    "Soru-cevap seansı",
  ];

  const activities = event.activities || defaultActivities;
  const requirements = event.requirements || [
    "18 yaş üstü olma",
    "Katılım formu doldurma",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl pr-8">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-nexus-600 mb-1" />
              <div className="text-sm font-medium text-center">
                {formatDate(event.date)}
              </div>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-nexus-600 mb-1" />
              <div className="text-sm font-medium">
                {formatTime(event.date)}
              </div>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-nexus-600 mb-1" />
              <div className="text-sm font-medium text-center">
                {event.location}
              </div>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-nexus-600 mb-1" />
              <div className="text-sm font-medium">
                {event.participants}/{event.maxParticipants || "∞"}
              </div>
            </div>
          </div>

          {/* Category and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
              >
                {event.category}
              </Badge>
              {event.isPremiumEvent && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Premium
                </Badge>
              )}
            </div>
            {event.price && (
              <div className="text-lg font-semibold text-green-600">
                ₺{event.price}
              </div>
            )}
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={event.createdBy.avatar} />
              <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                {event.createdBy.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{event.createdBy.name}</span>
                {event.createdBy.isPremium && (
                  <Badge variant="outline" className="text-xs">
                    Pro
                  </Badge>
                )}
                {event.createdBy.type === "business" && (
                  <Badge
                    variant="outline"
                    className="text-xs border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    İşletme
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{event.createdBy.rating.toFixed(1)} puan</span>
              </div>
            </div>
            {!isOwnEvent && (
              <FollowBusinessButton
                business={{
                  id: event.createdBy.id,
                  name: event.createdBy.name,
                  type: event.createdBy.type,
                }}
              />
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Etkinlik Açıklaması
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Purpose */}
          {event.purpose && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Etkinlik Amacı
              </h3>
              <p className="text-muted-foreground">{event.purpose}</p>
            </div>
          )}

          {/* Activities */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Yapılacak Aktiviteler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted/30 rounded"
                >
                  <div className="w-2 h-2 bg-nexus-500 rounded-full"></div>
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Katılım Gereksinimleri</h3>
              <div className="space-y-1">
                {requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isOwnEvent ? (
              <Button
                onClick={onApply}
                className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Etkinliğe Başvur
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                <Heart className="h-4 w-4 mr-2" />
                Kendi Etkinliğin
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleGetDirections}
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Yol Tarifi
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted/20 rounded">
            Bu etkinlik{" "}
            {new Date(event.date) > new Date() ? "yaklaşan" : "geçmiş"} bir
            etkinliktir.
            {event.isPremiumEvent &&
              " Premium üyeler için özel avantajlar mevcut."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
