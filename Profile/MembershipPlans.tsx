import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Crown,
  Check,
  X,
  Star,
  Users,
  Calendar,
  Shield,
  Zap,
  Heart,
  Trophy,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeature[];
  recommended?: boolean;
  color: string;
  icon: any;
}

const membershipPlans: MembershipPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Temel özelliklerle başlayın",
    price: { monthly: 0, yearly: 0 },
    color: "gray",
    icon: Users,
    features: [
      { name: "Ayda 3 etkinlik oluşturma", included: true },
      { name: "Temel profil özellikleri", included: true },
      { name: "10 arkadaş davet", included: true },
      { name: "Temel etkinlik arama", included: true },
      { name: "Premium etkinliklere katılım", included: false },
      { name: "Öncelikli destek", included: false },
      { name: "Gelişmiş analitik", included: false },
      { name: "Sınırsız etkinlik oluşturma", included: false },
    ],
  },
  {
    id: "individual",
    name: "Bireysel",
    description: "Sosyal yaşamınızı geliştirin",
    price: { monthly: 29, yearly: 290 },
    color: "blue",
    icon: Star,
    recommended: true,
    features: [
      { name: "Sınırsız etkinlik oluşturma", included: true },
      { name: "Premium etkinliklere katılım", included: true },
      { name: "Sınırsız arkadaş davet", included: true },
      { name: "Gelişmiş profil özellikleri", included: true },
      { name: "Öncelikli etkinlik sıralaması", included: true },
      { name: "Etkinlik analitikleri", included: true },
      { name: "Öncelikli destek", included: true },
      { name: "Özel rozetler", included: true },
    ],
  },
  {
    id: "corporate",
    name: "Şirket",
    description: "Takımınız için en iyi deneyim",
    price: { monthly: 99, yearly: 990 },
    color: "purple",
    icon: Crown,
    features: [
      { name: "Tüm Bireysel özellikler", included: true },
      { name: "Takım yönetimi", included: true },
      { name: "Şirket etkinlikleri", included: true },
      { name: "Gelişmiş analitik dashboard", included: true },
      { name: "API erişimi", included: true },
      { name: "Özel branding", included: true },
      { name: "Dedike hesap yöneticisi", included: true },
      { name: "SLA garantisi", included: true },
    ],
  },
];

interface MembershipPlansProps {
  currentPlan?: string;
}

export function MembershipPlans({
  currentPlan = "free",
}: MembershipPlansProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { user, setUser, isDemo } = useDemoUser();

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = async (plan: MembershipPlan) => {
    if (!user) return;

    setIsUpgrading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isDemo) {
        // Update demo user with new plan
        const updatedUser = {
          ...user,
          isPremium: plan.id !== "free",
          plan: plan.id,
        };
        setUser(updatedUser);

        toast({
          title: "Plan Güncellendi!",
          description: `${plan.name} planına başarıyla geçtiniz. (Demo Mode)`,
        });
      } else {
        // Real payment integration would go here
        toast({
          title: "Plan Güncellendi!",
          description: `${plan.name} planına başarıyla geçtiniz.`,
        });
      }

      setIsOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Plan güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const getCurrentPlanDetails = () => {
    return (
      membershipPlans.find(
        (plan) =>
          plan.id === (user?.isPremium ? user.plan || "individual" : "free"),
      ) || membershipPlans[0]
    );
  };

  const currentPlanDetails = getCurrentPlanDetails();

  const getPlanColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: "border-gray-200 dark:border-gray-700",
      blue: "border-blue-200 dark:border-blue-700 ring-2 ring-blue-100 dark:ring-blue-900",
      purple: "border-purple-200 dark:border-purple-700",
    };
    return colors[color] || colors.gray;
  };

  const getPlanButtonColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: "bg-gray-600 hover:bg-gray-700",
      blue: "bg-blue-600 hover:bg-blue-700",
      purple: "bg-purple-600 hover:bg-purple-700",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Display */}
      <Card className={`${getPlanColor(currentPlanDetails.color)}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg bg-${currentPlanDetails.color}-100 dark:bg-${currentPlanDetails.color}-900`}
              >
                <currentPlanDetails.icon
                  className={`h-6 w-6 text-${currentPlanDetails.color}-600`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {currentPlanDetails.name} Plan
                  </h3>
                  {currentPlanDetails.id === currentPlan && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Aktif
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentPlanDetails.description}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold">
                {currentPlanDetails.price.monthly === 0
                  ? "Ücretsiz"
                  : `₺${currentPlanDetails.price.monthly}/ay`}
              </div>
              {currentPlanDetails.price.yearly > 0 && (
                <div className="text-sm text-muted-foreground">
                  ₺{currentPlanDetails.price.yearly}/yıl
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Management */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Planı Yönet / Değiştir
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Üyelik Planları</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Billing Period Toggle */}
            <div className="flex justify-center">
              <div className="bg-muted p-1 rounded-lg">
                <Button
                  variant={billingPeriod === "monthly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingPeriod("monthly")}
                >
                  Aylık
                </Button>
                <Button
                  variant={billingPeriod === "yearly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingPeriod("yearly")}
                >
                  Yıllık
                  <Badge className="ml-1 bg-green-100 text-green-800 text-xs">
                    %17 indirim
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipPlans.map((plan) => {
                const IconComponent = plan.icon;
                const isCurrentPlan = plan.id === currentPlanDetails.id;
                const price =
                  billingPeriod === "monthly"
                    ? plan.price.monthly
                    : plan.price.yearly;

                return (
                  <Card
                    key={plan.id}
                    className={`relative transition-all duration-300 hover:scale-105 ${
                      plan.recommended
                        ? "ring-2 ring-nexus-200 dark:ring-nexus-800 shadow-lg"
                        : getPlanColor(plan.color)
                    } ${
                      selectedPlan?.id === plan.id
                        ? "ring-2 ring-nexus-500"
                        : ""
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-nexus-600 text-white px-3 py-1">
                          <Trophy className="h-3 w-3 mr-1" />
                          Önerilen
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-3">
                        <div
                          className={`p-3 rounded-lg bg-${plan.color}-100 dark:bg-${plan.color}-900`}
                        >
                          <IconComponent
                            className={`h-8 w-8 text-${plan.color}-600`}
                          />
                        </div>
                      </div>

                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>

                      <div className="mt-4">
                        <div className="text-3xl font-bold">
                          {price === 0 ? "Ücretsiz" : `₺${price}`}
                        </div>
                        {price > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {billingPeriod === "monthly" ? "/ay" : "/yıl"}
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features List */}
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-1">
                              {feature.included ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                feature.included
                                  ? "text-foreground"
                                  : "text-muted-foreground line-through"
                              }`}
                            >
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        {isCurrentPlan ? (
                          <Button variant="outline" className="w-full" disabled>
                            <Shield className="h-4 w-4 mr-2" />
                            Mevcut Plan
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUpgrade(plan)}
                            disabled={isUpgrading}
                            className={`w-full ${getPlanButtonColor(plan.color)}`}
                          >
                            {isUpgrading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                İşlem yapılıyor...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                {plan.id === "free"
                                  ? "Ücretsiz'e Geç"
                                  : `${plan.name}'e Yükselt`}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Sık Sorulan Sorular
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Plan ne zaman değişir?</h4>
                  <p className="text-muted-foreground">
                    Plan değişiklikleri anında etkili olur.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Para iadesi var mı?</h4>
                  <p className="text-muted-foreground">
                    İlk 30 gün içinde koşulsuz para iadesi.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    Plan iptal edebilir miyim?
                  </h4>
                  <p className="text-muted-foreground">
                    İstediğiniz zaman plan iptal edebilirsiniz.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Ödemeler güvenli mi?</h4>
                  <p className="text-muted-foreground">
                    256-bit SSL ile güvenli ödeme altyapısı.
                  </p>
                </div>
              </div>
            </div>

            {isDemo && (
              <div className="text-center text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded">
                Demo modunda gerçek ödeme alınmaz. Planlar simüle edilir.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
