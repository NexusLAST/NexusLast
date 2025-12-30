import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, MessageCircle, Calendar, User, ThumbsUp } from "lucide-react";
import { MockEvent } from "@/data/mockMyEvents";

interface EventFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
}

export function EventFeedbackModal({
  isOpen,
  onClose,
  event,
}: EventFeedbackModalProps) {
  const eventDate = new Date(event.date);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    if (rating >= 3.0) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingText = (rating: number) => {
    if (rating === 5) return "Mükemmel";
    if (rating === 4) return "Çok İyi";
    if (rating === 3) return "İyi";
    if (rating === 2) return "Orta";
    return "Kötü";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-nexus-600" />
            Etkinlik Yorumları
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{eventDate.toLocaleDateString("tr-TR")}</span>
                    </div>
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                </div>
                {event.averageRating && (
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">
                        {event.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.totalRatings} değerlendirme
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Feedback List */}
          {!event.feedback || event.feedback.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Henüz Yorum Yapılmamış
                </h3>
                <p className="text-muted-foreground">
                  Bu etkinlik için henüz katılımcılar tarafından yorum
                  yapılmamış.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Yorumlar ({event.feedback.length})
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>En yeni önce</span>
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {event.feedback
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                    .map((feedback) => (
                      <Card
                        key={feedback.id}
                        className="hover:shadow-sm transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                                {feedback.userName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {feedback.userName}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    Katılımcı
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(feedback.createdAt)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < feedback.rating
                                          ? "text-yellow-500 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span
                                  className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}
                                >
                                  {feedback.rating}/5 -{" "}
                                  {getRatingText(feedback.rating)}
                                </span>
                              </div>

                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {feedback.comment}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
