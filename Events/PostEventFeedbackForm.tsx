import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Calendar,
  MapPin,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EventFeedback {
  eventId: string;
  userId: string;
  rating: number;
  liked: boolean;
  improvements: string;
  additionalComments: string;
  wouldRecommend: boolean;
  organizerRating: number;
  venueRating: number;
  contentRating: number;
}

interface EventInfo {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  organizer: string;
}

interface PostEventFeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventInfo;
}

export function PostEventFeedbackForm({
  isOpen,
  onClose,
  event,
}: PostEventFeedbackFormProps) {
  const [rating, setRating] = useState([4]);
  const [organizerRating, setOrganizerRating] = useState([4]);
  const [venueRating, setVenueRating] = useState([4]);
  const [contentRating, setContentRating] = useState([4]);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [improvements, setImprovements] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isDemo } = useDemoUser();

  const handleSubmit = async () => {
    if (!user || liked === null) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm gerekli alanları doldurunuz.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedback: EventFeedback = {
        eventId: event.id,
        userId: user.id,
        rating: rating[0],
        liked,
        improvements,
        additionalComments,
        wouldRecommend: wouldRecommend || false,
        organizerRating: organizerRating[0],
        venueRating: venueRating[0],
        contentRating: contentRating[0],
      };

      if (isDemo) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Demo feedback:", feedback);
      } else {
        // Real Supabase integration
        // const { error } = await supabase
        //   .from('event_feedback')
        //   .insert([feedback]);
        //
        // if (error) throw error;
      }

      toast({
        title: "Geri Bildirim Gönderildi!",
        description: "Değerli görüşleriniz için teşekkür ederiz.",
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Hata",
        description: "Geri bildirim gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating([4]);
    setOrganizerRating([4]);
    setVenueRating([4]);
    setContentRating([4]);
    setLiked(null);
    setWouldRecommend(null);
    setImprovements("");
    setAdditionalComments("");
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (value: number) => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-6 w-6 cursor-pointer transition-colors",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600",
            )}
            onClick={() => onChange(star)}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({value}/5)</span>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-nexus-600" />
            Etkinlik Geri Bildirimi
          </DialogTitle>
          <DialogDescription>
            Etkinlik deneyiminizi değerlendirin ve gelecek etkinliklerin daha
            iyi olması için görüşlerinizi paylaşın.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                >
                  {event.category}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Main Questions */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Genel Değerlendirme *
              </Label>
              <StarRating
                value={rating[0]}
                onChange={(value) => setRating([value])}
                label="Etkinliği genel olarak nasıl değerlendiriyorsunuz?"
              />
            </div>

            {/* Like/Dislike */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Etkinliği Beğendiniz Mi? *
              </Label>
              <div className="flex gap-3">
                <Button
                  variant={liked === true ? "default" : "outline"}
                  onClick={() => setLiked(true)}
                  className={cn(
                    "flex items-center gap-2",
                    liked === true && "bg-green-600 hover:bg-green-700",
                  )}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Evet, beğendim
                </Button>
                <Button
                  variant={liked === false ? "default" : "outline"}
                  onClick={() => setLiked(false)}
                  className={cn(
                    "flex items-center gap-2",
                    liked === false && "bg-red-600 hover:bg-red-700",
                  )}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Hayır, beğenmedim
                </Button>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StarRating
                value={organizerRating[0]}
                onChange={(value) => setOrganizerRating([value])}
                label="Organizasyon"
              />
              <StarRating
                value={venueRating[0]}
                onChange={(value) => setVenueRating([value])}
                label="Mekan"
              />
              <StarRating
                value={contentRating[0]}
                onChange={(value) => setContentRating([value])}
                label="İçerik"
              />
            </div>

            {/* Recommendation */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Arkadaşlarınıza Tavsiye Eder Misiniz?
              </Label>
              <div className="flex gap-3">
                <Button
                  variant={wouldRecommend === true ? "default" : "outline"}
                  onClick={() => setWouldRecommend(true)}
                  className={cn(
                    "flex items-center gap-2",
                    wouldRecommend === true &&
                      "bg-nexus-600 hover:bg-nexus-700",
                  )}
                >
                  <Heart className="h-4 w-4" />
                  Evet, tavsiye ederim
                </Button>
                <Button
                  variant={wouldRecommend === false ? "default" : "outline"}
                  onClick={() => setWouldRecommend(false)}
                  className={cn(
                    "flex items-center gap-2",
                    wouldRecommend === false && "bg-gray-600 hover:bg-gray-700",
                  )}
                >
                  Hayır, tavsiye etmem
                </Button>
              </div>
            </div>

            {/* Improvements */}
            <div className="space-y-2">
              <Label htmlFor="improvements" className="text-base font-semibold">
                Geliştirilmesi Gereken Konular
              </Label>
              <Textarea
                id="improvements"
                placeholder="Etkinlikte eksik gördüğünüz veya geliştirilmesi gereken konular neler?"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                rows={3}
              />
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-base font-semibold">
                Ek Yorumlar
              </Label>
              <Textarea
                id="comments"
                placeholder="Eklemek istediğiniz başka bir görüş veya öneriniz var mı?"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-medium mb-1">
                  Geri Bildiriminiz Bizim İçin Değerli!
                </h4>
                <p className="text-sm text-muted-foreground">
                  Görüşleriniz gelecek etkinliklerin kalitesini artırmamıza
                  yardımcı olacak. Geri bildiriminiz anonim olarak
                  değerlendirilecektir.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || liked === null}
              className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gönderiliyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Geri Bildirimi Gönder
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
