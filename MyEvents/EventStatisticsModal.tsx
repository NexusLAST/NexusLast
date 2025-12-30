import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { MockEvent } from "@/data/mockMyEvents";

interface EventStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
}

export function EventStatisticsModal({
  isOpen,
  onClose,
  event,
}: EventStatisticsModalProps) {
  const eventDate = new Date(event.date);
  const participationRate = event.maxParticipants
    ? Math.round((event.participants / event.maxParticipants) * 100)
    : 100;

  const getParticipationRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-nexus-600" />
            Etkinlik İstatistikleri
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-nexus-600" />
                <span>{eventDate.toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-nexus-600" />
                <span>
                  {eventDate.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-nexus-600" />
                <span>{event.location}</span>
              </div>
              <Badge variant="secondary">{event.category}</Badge>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{event.participants}</div>
                <div className="text-sm text-muted-foreground">
                  Toplam Katılımcı
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target
                  className={`h-8 w-8 mx-auto mb-2 ${getParticipationRateColor(participationRate)}`}
                />
                <div className="text-2xl font-bold">{participationRate}%</div>
                <div className="text-sm text-muted-foreground">
                  Doluluk Oranı
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star
                  className={`h-8 w-8 mx-auto mb-2 ${getRatingColor(event.averageRating || 0)}`}
                />
                <div className="text-2xl font-bold">
                  {event.averageRating?.toFixed(1) || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ortalama Puan
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detaylı İstatistikler</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Katılım Analizi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Katılımcı Sayısı</span>
                  <span className="font-medium">{event.participants}</span>
                </div>
                {event.maxParticipants && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maksimum Kapasite</span>
                      <span className="font-medium">
                        {event.maxParticipants}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Doluluk Oranı</span>
                        <span className="font-medium">
                          {participationRate}%
                        </span>
                      </div>
                      <Progress value={participationRate} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {(event.averageRating || event.feedback) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Değerlendirme Sonuçları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.averageRating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ortalama Puan</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {event.averageRating.toFixed(1)}
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(event.averageRating!)
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {event.totalRatings && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Toplam Değerlendirme</span>
                      <span className="font-medium">{event.totalRatings}</span>
                    </div>
                  )}
                  {event.feedback && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Yorum Sayısı</span>
                      <span className="font-medium">
                        {event.feedback.length}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Başarı Göstergeleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Etkinlik Durumu</span>
                  <Badge
                    variant={
                      event.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {event.status === "completed"
                      ? "Tamamlandı"
                      : "Devam Ediyor"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kategori</span>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                {event.averageRating && event.averageRating >= 4.5 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Yüksek Puan Aldı!
                    </span>
                  </div>
                )}
                {participationRate >= 90 && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Tam Doldu!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
