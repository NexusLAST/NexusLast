import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Users,
  MessageSquare,
  Calendar,
  Building,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  icon: React.ComponentType<any>;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: "₺0",
    period: "Ücretsiz",
    description: "Temel özelliklerle başlayın",
    icon: Users,
    features: [
      {
        name: "Etkinlik başvurusu",
        included: true,
        description: "Ayda 3 etkinliğe başvuru",
      },
      {
        name: "Arkadaş istekleri",
        included: true,
        description: "1 arkadaş isteği gönderme",
      },
      { name: "Temel profil", included: true },
      { name: "Etkinlik keşfi", included: true },
      { name: "Sohbet özelliği", included: false },
      { name: "Etkinlik oluşturma", included: false },
      { name: "Premium destek", included: false },
      { name: "Analitik raporlar", included: false },
    ],
    buttonText: "Mevcut Plan",
    buttonVariant: "outline",
  },
  {
    id: "individual",
    name: "Bireysel Plan",
    price: "₺29",
    period: "/ay",
    description: "Aktif sosyal yaşam için ideal",
    popular: true,
    icon: Sparkles,
    features: [
      { name: "Sınırsız etkinlik başvurusu", included: true },
      {
        name: "Arkadaş istekleri",
        included: true,
        description: "10 arkadaş isteği gönderme",
      },
      { name: "Gelişmiş profil", included: true },
      {
        name: "Sohbet özelliği",
        included: true,
        description: "Özel mesajlaşma",
      },
      {
        name: "Etkinlik oluşturma",
        included: true,
        description: "Ayda 5 etkinlik",
      },
      { name: "Öncelikli görünürlük", included: true },
      { name: "Premium destek", included: true },
      { name: "Analitik raporlar", included: false },
    ],
    buttonText: "Planı Seç",
    buttonVariant: "default",
  },
  {
    id: "corporate",
    name: "Şirket Planı",
    price: "₺99",
    period: "/ay",
    description: "Takım yönetimi ve kurumsal özellikler",
    icon: Building,
    features: [
      { name: "Sınırsız her şey", included: true },
      {
        name: "Takım yönetimi",
        included: true,
        description: "Çalışan profilleri yönetimi",
      },
      {
        name: "Özel etkinlikler",
        included: true,
        description: "Sadece şirket çalışanları",
      },
      { name: "Gelişmiş analitikler", included: true },
      { name: "API erişimi", included: true },
      { name: "7/24 destek", included: true },
      { name: "Özel entegrasyon", included: true },
      { name: "Faturalandırma", included: true },
    ],
    buttonText: "İletişime Geç",
    buttonVariant: "secondary",
  },
];

interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumPlansModal({ isOpen, onClose }: PremiumPlansModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useDemoUser();

  const currentPlan = user?.isPremium ? "individual" : "free";

  const handleSelectPlan = async (planId: string, planName: string) => {
    if (planId === currentPlan) return;

    setSelectedPlan(planId);
    setProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (planId === "corporate") {
        toast({
          title: "İletişim Talebi Gönderildi",
          description:
            "Şirket planı için bir temsilcimiz sizinle iletişime geçecek.",
        });
      } else {
        toast({
          title: "Plan Seçildi!",
          description: `${planName} planına yükseltme işlemi başlatıldı.`,
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Plan seçimi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-3xl">
            <Crown className="h-8 w-8 text-yellow-600" />
            Premium Planları
          </DialogTitle>
          <DialogDescription className="text-lg">
            İhtiyaçlarınıza en uygun planı seçin ve Nexus'un tüm özelliklerinden
            yararlanın.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Current Plan Info */}
          <div className="bg-nexus-50 dark:bg-nexus-950 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-nexus-600" />
              <h3 className="font-semibold">Mevcut Planınız</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Şu anda{" "}
              <strong>{plans.find((p) => p.id === currentPlan)?.name}</strong>{" "}
              kullanıyorsunuz.
              {currentPlan === "free" &&
                " Daha fazla özellik için premium planlara göz atın!"}
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan;
              const isProcessingThis = selectedPlan === plan.id && processing;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                    plan.popular && "ring-2 ring-nexus-500 shadow-xl scale-105",
                    isCurrentPlan && "bg-green-50 dark:bg-green-950",
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-nexus-600 text-white px-4 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        En Popüler
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-600 text-white px-3 py-1">
                        <Check className="h-3 w-3 mr-1" />
                        Aktif
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 h-12 w-12 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-nexus-600 dark:text-nexus-400" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-nexus-600">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features List */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {feature.included ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span
                              className={cn(
                                "text-sm",
                                feature.included
                                  ? "text-foreground"
                                  : "text-muted-foreground line-through",
                              )}
                            >
                              {feature.name}
                            </span>
                            {feature.description && feature.included && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <Button
                        className={cn(
                          "w-full",
                          plan.buttonVariant === "default" &&
                            "bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700",
                          isCurrentPlan && "bg-green-600 hover:bg-green-700",
                        )}
                        variant={isCurrentPlan ? "default" : plan.buttonVariant}
                        onClick={() => handleSelectPlan(plan.id, plan.name)}
                        disabled={isCurrentPlan || processing}
                      >
                        {isProcessingThis ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            İşleniyor...
                          </div>
                        ) : isCurrentPlan ? (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Mevcut Plan
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            {plan.buttonText}
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold mb-4">Sık Sorulan Sorular</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Plan nasıl değiştirilir?</h4>
                <p className="text-muted-foreground">
                  İstediğiniz zaman planınızı yükseltebilir veya
                  düşürebilirsiniz. Değişiklik hemen etkili olur.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Para iadesi var mı?</h4>
                <p className="text-muted-foreground">
                  İlk 7 gün içinde koşulsuz para iadesi sağlıyoruz. Herhangi bir
                  soru sormayız.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Fatura kesiliyor mu?</h4>
                <p className="text-muted-foreground">
                  Evet, tüm ödemeleriniz için fatura kesilir ve kurumsal
                  müşteriler için özel faturalandırma seçenekleri vardır.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Destek nasıl alırım?</h4>
                <p className="text-muted-foreground">
                  Premium üyeler için öncelikli destek sağlıyoruz. 7/24 canlı
                  destek ve e-posta desteği mevcuttur.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
