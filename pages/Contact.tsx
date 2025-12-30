import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HamburgerMenu } from "@/components/Layout/HamburgerMenu";
import { NexusLogo } from "@/components/ui/nexus-logo";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const contactInfo = [
  {
    icon: Mail,
    title: "E-posta",
    content: "merhaba@nexus.com",
    description: "Genel sorular ve destek için",
  },
  {
    icon: Phone,
    title: "Telefon",
    content: "+90 212 555 0123",
    description: "Acil durumlar için",
  },
  {
    icon: MapPin,
    title: "Adres",
    content: "Maslak Mahallesi, İstanbul",
    description: "Genel merkez",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    content: "Pzt-Cum 09:00-18:00",
    description: "Hafta içi destek",
  },
];

const supportTypes = [
  {
    icon: MessageCircle,
    title: "Genel Destek",
    description: "Platform kullanımı ve genel sorular",
    email: "destek@nexus.com",
  },
  {
    icon: Mail,
    title: "Teknik Destek",
    description: "Teknik sorunlar ve hata bildirimleri",
    email: "teknik@nexus.com",
  },
  {
    icon: Phone,
    title: "İş Birliği",
    description: "Ortaklık ve iş birliği teklifleri",
    email: "isbirligi@nexus.com",
  },
];

export default function Contact() {
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
              İletişim
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bizimle iletişime geç! Sorularını, önerilerini veya geri
            bildirimlerini paylaş.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Bize Mesaj Gönder</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input id="name" placeholder="Adınız" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu</Label>
                    <Input id="subject" placeholder="Mesaj konusu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mesaj</Label>
                    <Textarea
                      id="message"
                      placeholder="Mesajınızı buraya yazın..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700">
                    <Send className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <Card key={info.title}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-nexus-600 dark:text-nexus-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{info.title}</h3>
                            <p className="text-sm font-medium">
                              {info.content}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Özel Destek Hatları</h3>
              <div className="space-y-3">
                {supportTypes.map((support) => {
                  const Icon = support.icon;
                  return (
                    <Card key={support.title}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-nexus-600 dark:text-nexus-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {support.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {support.description}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            {support.email}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Hızlı Yanıt Garantisi</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Mesajlarınıza çalışma saatleri içinde 2 saat, hafta sonları ise
                24 saat içinde yanıt veriyoruz. Acil durumlar için telefon
                hattımızı kullanabilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/faq">
                  <Button variant="outline">SSS'yi İncele</Button>
                </Link>
                <Button className="bg-nexus-600 hover:bg-nexus-700">
                  Canlı Destek
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
