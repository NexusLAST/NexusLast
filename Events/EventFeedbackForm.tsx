import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Send,
  Calendar,
  MapPin,
  Award,
  MessageCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventFeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    createdBy: {
      name: string;
      avatar?: string;
    };
  };
  onSubmitFeedback: (rating: number, comment: string) => Promise<void>;
  existingRating?: {
    rating: number;
    comment: string;
  };
}

export function EventFeedbackForm({
  isOpen,
  onClose,
  event,
  onSubmitFeedback,
  existingRating,
}: EventFeedbackFormProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxCommentLength = 500;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Puan Seçimi Gerekli",
        description: "Lütfen etkinlik için bir puan verin.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Yorum Çok Kısa",
        description: "Lütfen en az 10 karakter yorum yazın.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitFeedback(rating, comment.trim());

      toast({
        title: "Geri Bildirim Gönderildi!",
        description: "Değerlendirmeniz başarıyla kaydedildi. Teşekkür ederiz!",
      });

      // Reset form and close
      setRating(existingRating?.rating || 0);
      setComment(existingRating?.comment || "");
      onClose();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Geri bildirim gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(existingRating?.rating || 0);
    setComment(existingRating?.comment || "");
    onClose();
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Çok Kötü";
      case 2:
        return "Kötü";
      case 3:
        return "Orta";
      case 4:
        return "İyi";
      case 5:
        return "Mükemmel";
      default:
        return "";
    }
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1:
        return "text-red-500";
      case 2:
        return "text-orange-500";
      case 3:
        return "text-yellow-500";
      case 4:
        return "text-blue-500";
      case 5:
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Etkinlik Değerlendirmesi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.createdBy.avatar} />
                <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                  {event.createdBy.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="text-sm text-muted-foreground">
                    Organizatör:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {event.createdBy.name}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">{event.category}</Badge>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                Bu etkinliği nasıl değerlendiriyorsunuz?
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-colors hover:scale-110 transform duration-150"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {(hoveredRating || rating) > 0 && (
                  <div className="flex items-center gap-2 ml-3">
                    <span
                      className={`font-semibold ${getRatingColor(hoveredRating || rating)}`}
                    >
                      {getRatingText(hoveredRating || rating)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({hoveredRating || rating}/5)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {rating > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {rating >= 4
                    ? "🎉 Harika! Bu tür etkinlikleri daha sık önereceğiz."
                    : rating >= 3
                      ? "👍 Teşekkürler! Geri bildiriminiz değerli."
                      : "😔 Üzgünüz. Gelecek etkinlikleri daha iyi yapmaya odaklanacağız."}
                </p>
              </div>
            )}
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Yorumunuz</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Deneyiminizi diğer katılımcılarla paylaşın. Ne hoşunuza gitti?
                Neyi geliştirebilirdi?
              </p>
            </div>

            <Textarea
              placeholder="Etkinlik hakkındaki düşüncelerinizi yazın... (örn: Organizasyon çok iyidi, lokasyon mükemmeldi, rehber çok bilgiliydi)"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value.slice(0, maxCommentLength))
              }
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                Minimum 10 karakter gerekli
              </span>
              <span
                className={`font-medium ${
                  comment.length > maxCommentLength * 0.9
                    ? "text-yellow-600"
                    : comment.length >= 10
                      ? "text-green-600"
                      : "text-red-500"
                }`}
              >
                {comment.length}/{maxCommentLength}
              </span>
            </div>

            {/* Suggested Comments */}
            {comment.length < 10 && (
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Örnek yorumlar:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• "Harika bir organizasyon, lokasyon çok güzeldi!"</p>
                  <p>• "Rehber çok deneyimli ve bilgiliydi, çok öğrendim."</p>
                  <p>• "Grup dinamiği çok iyiydi, yeni arkadaşlar edindim."</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting || rating === 0 || comment.trim().length < 10
              }
              className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Değerlendirmeyi Gönder
                </>
              )}
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="text-xs text-center text-muted-foreground bg-muted/20 rounded p-2">
            <MessageCircle className="h-3 w-3 inline mr-1" />
            Değerlendirmeniz diğer kullanıcılar tarafından görülecek ve etkinlik
            kalitesini artırmaya yardımcı olacak.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
