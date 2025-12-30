import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HamburgerMenu } from "@/components/Layout/HamburgerMenu";
import { NexusLogo } from "@/components/ui/nexus-logo";
import {
  ArrowLeft,
  UserPlus,
  Calendar,
  Users,
  Star,
  MessageCircle,
  Shield,
  Crown,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    step: "1",
    title: "Hesap Oluştur",
    description: "E-posta ile ücretsiz hesap oluştur ve profilini tamamla",
    icon: UserPlus,
    details: [
      "E-posta ve şifre ile kayıt ol",
      "Profil fotoğrafı ve isim ekle",
      "İlgi alanlarını ve amacını belirt",
      "Doğrulama e-postasını onayla",
    ],
  },
  {
    step: "2",
    title: "Etkinlik Keşfet",
    description: "Şehrindeki etkinlikleri keşfet ve ilgini çekenleri bul",
    icon: Calendar,
    details: [
      "Kategori ve konuma göre filtrele",
      "Etkinlik detaylarını incele",
      "Organizatörün profilini gör",
      "Katılımcı yorumlarını oku",
    ],
  },
  {
    step: "3",
    title: "Başvuru Yap",
    description: "İlgilendiğin etkinliklere başvuru gönder",
    icon: Users,
    details: [
      "Bir tıkla başvuru gönder",
      "Kısa tanıtım mesajı yaz",
      "Organizatörden onay bekle",
      "Kabul/ret bildirimi al",
    ],
  },
  {
    step: "4",
    title: "Katıl ve Değerlendir",
    description: "Etkinliğe katıl, deneyimini paylaş ve değerlendir",
    icon: Star,
    details: [
      "Etkinlik öncesi mesajlaş",
      "Etkinliğe katıl ve eğlen",
      "Deneyimini puanla",
      "Yeni arkadaşlıklar kur",
    ],
  },
];

const features = [
  {
    icon: Shield,
    title: "Güvenli Platform",
    description: "Doğrulanmış kullanıcılar ve güvenli ortam",
  },
  {
    icon: MessageCircle,
    title: "Anlık Mesajlaşma",
    description: "Katılımcılarla önceden iletişim kur",
  },
  {
    icon: Crown,
    title: "Premium Özellikler",
    description: "Gelişmiş özellikler ve öncelikli destek",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <NexusLogo size="md" animate={false} />
          </Link>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
            <HamburgerMenu />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-nexus-600 to-nexus-700 bg-clip-text text-transparent">
              Nasıl Çalışır?
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nexus ile etkinlik dünyasına katılmak çok kolay! Sadece 4 adımda
            yeni insanlarla tanışmaya başlayabilirsin.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.step}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-nexus-500 to-nexus-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.step}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {step.title}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-nexus-500 rounded-full" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <Card className="w-full max-w-md p-8 text-center">
                    <CardContent className="pt-0">
                      <div className="w-20 h-20 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-10 h-10 text-nexus-600 dark:text-nexus-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ek <span className="text-nexus-600">Özellikler</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-nexus-500 to-nexus-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Hazır mısın? Hemen başla!</h2>
          <p className="text-nexus-100 mb-6 max-w-2xl mx-auto">
            Sadece birkaç dakika içinde hesabını oluştur ve ilk etkinliğini
            keşfet.
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="bg-white text-nexus-600 hover:bg-nexus-50"
            >
              Ücretsiz Kayıt Ol
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
