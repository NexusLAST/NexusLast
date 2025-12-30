import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HamburgerMenu } from "@/components/Layout/HamburgerMenu";
import { NexusLogo } from "@/components/ui/nexus-logo";
import {
  Users,
  Calendar,
  Star,
  Sparkles,
  Globe,
  Heart,
  ArrowRight,
  Check,
  PlayCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoUser } from "@/contexts/DemoUserContext";

const features = [
  {
    icon: Calendar,
    title: "Etkinlik Oluştur",
    description: "Kolayca etkinlik oluştur ve katılımcı bul",
  },
  {
    icon: Users,
    title: "Yeni İnsanlarla Tanış",
    description: "Ortak ilgi alanlarına sahip kişilerle buluş",
  },
  {
    icon: Star,
    title: "Deneyimleri Paylaş",
    description: "Etkinlik sonrası puanlama ve geri bildirim",
  },
  {
    icon: Heart,
    title: "Güvenli Ortam",
    description: "Doğrulanmış kullanıcılar ve güvenli platform",
  },
];

const stats = [
  { label: "Aktif Kullanıcı", value: "2.1K+", icon: Users },
  { label: "Düzenlenen Etkinlik", value: "500+", icon: Calendar },
  { label: "Şehir", value: "15+", icon: Globe },
  { label: "Kullanıcı Memnuniyeti", value: "4.8/5", icon: Star },
];

const benefits = [
  "Ücretsiz temel özellikler",
  "Anlık bildirimler",
  "Güvenli mesajlaşma",
  "Etkinlik kategorileri",
  "Mobil uyumlu tasarım",
  "7/24 destek",
];

function DemoButton() {
  const { loginAsDemo } = useDemoUser();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    loginAsDemo();
    navigate("/dashboard");
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleDemoClick}
      className="text-lg px-8 py-6 h-auto border-2 border-nexus-300 hover:border-nexus-500 hover:bg-nexus-50 dark:hover:bg-nexus-950"
    >
      <PlayCircle className="mr-2 h-5 w-5" />
      Demo Dene
    </Button>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <NexusLogo size="md" animate={true} />
          </Link>

          <div className="flex items-center space-x-3">
            <HamburgerMenu />
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Giriş Yap
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                Kayıt Ol
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 bg-nexus-50 dark:bg-nexus-950 px-4 py-2 rounded-full text-sm font-medium text-nexus-700 dark:text-nexus-300 mb-8">
                <Sparkles className="h-4 w-4" />
                Türkiye'nin en büyük sosyal etkinlik platformu
              </div>

              <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
                <span className="gradient-text-animated">Nexus</span> ile{" "}
                <span className="text-foreground animate-bounce-gentle">
                  Bağlan
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
                Şehrindeki etkinlikleri keşfet, yeni insanlarla tanış ve
                <br className="hidden md:block" />
                unutulmaz anılar biriktir.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700 text-lg px-8 py-6 h-auto animate-glow hover:animate-none hover:scale-105 transition-all duration-300"
                  >
                    Hemen Başla
                    <ArrowRight className="ml-2 h-5 w-5 animate-bounce-gentle" />
                  </Button>
                </Link>
                <DemoButton />
                <Link to="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 h-auto"
                  >
                    Nasıl Çalışır?
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="text-center hover-lift cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-nexus-100 dark:bg-nexus-900 rounded-full mb-3 hover:animate-glow transition-all duration-300">
                        <Icon className="h-6 w-6 text-nexus-600 dark:text-nexus-400 animate-float" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold animate-scale-pulse">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Neden <span className="text-nexus-600">Nexus</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Sosyal bağlantılar kurmanın en kolay ve eğlenceli yolu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="text-center p-6 hover:shadow-lg transition-all duration-500 hover-lift group animate-slide-up"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-nexus-100 dark:bg-nexus-900 rounded-full mb-4 group-hover:animate-glow transition-all duration-300">
                        <Icon className="h-8 w-8 text-nexus-600 dark:text-nexus-400 group-hover:animate-bounce-gentle" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-nexus-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Platform <span className="text-nexus-600">Avantajları</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Nexus ile sosyal hayatınızı zenginleştirin ve yeni fırsatlar
                  keşfedin.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-nexus-600 dark:text-nexus-400" />
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-nexus-500/20 to-nexus-600/20 rounded-2xl p-8 backdrop-blur">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      Premium Özellikler
                    </h3>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-nexus-600">Pro</Badge>
                        <span>Sınırsız etkinlik ba��vurusu</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-nexus-600">Pro</Badge>
                        <span>Etkinlikleriniz öne çıksın</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-nexus-600">Pro</Badge>
                        <span>Gelişmiş chat özellikleri</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-nexus-600">Pro</Badge>
                        <span>Öncelikli destek</span>
                      </div>
                    </div>
                    <Button className="w-full mt-6 bg-nexus-600 hover:bg-nexus-700">
                      Premium'a Geç
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-nexus-500 to-nexus-600">
          <div className="container text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Hemen Başlamaya Hazır Mısın?
            </h2>
            <p className="text-xl text-nexus-100 mb-8 max-w-2xl mx-auto">
              Nexus topluluğuna katıl, yeni etkinlikler keşfet ve harika
              insanlarla tanış.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-nexus-600 hover:bg-nexus-50 text-lg px-8 py-6 h-auto"
                >
                  Ücretsiz Kayıt Ol
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-nexus-600 text-lg px-8 py-6 h-auto"
              >
                Daha Fazla Bilgi
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container text-center">
          <div className="flex items-center justify-center mb-4">
            <NexusLogo size="sm" animate={false} />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Nexus. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
