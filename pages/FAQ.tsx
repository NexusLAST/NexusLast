import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HamburgerMenu } from "@/components/Layout/HamburgerMenu";
import { NexusLogo } from "@/components/ui/nexus-logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqData = [
  {
    category: "Genel",
    questions: [
      {
        question: "Nexus nedir?",
        answer:
          "Nexus, şehirdeki insanların etkinlik oluşturabileceği ve diğer kullanıcıların bu etkinliklere katılabileceği sosyal bir platformdur. Yeni insanlarla tanışmanın, ortak hobi ve ilgi alanlarına sahip kişilerle buluşmanın en kolay yoludur.",
      },
      {
        question: "Nexus ücretsiz mi?",
        answer:
          "Evet! Nexus'un temel özellikleri tamamen ücretsizdir. Etkinlik oluşturabilir, başvuru gönderebilir ve platform özelliklerinin çoğunu ücretsiz kullanabilirsiniz. Premium üyelik ise ek özellikler sunar.",
      },
      {
        question: "Hangi şehirlerde hizmet veriyorsunuz?",
        answer:
          "Şu anda Türkiye'nin 15+ büyük şehrinde hizmet veriyoruz. İstanbul, Ankara, İzmir, Bursa, Antalya gibi şehirlerde aktif kullanıcı topluluğumuz var ve sürekli yeni şehirler ekliyoruz.",
      },
    ],
  },
  {
    category: "Hesap ve Güvenlik",
    questions: [
      {
        question: "Nasıl hesap oluştururum?",
        answer:
          "Ana sayfadaki 'Kayıt Ol' butonuna tıklayarak e-posta adresiniz ve güçlü bir şifre ile hesap oluşturabilirsiniz. Ayrıca Google hesabınızla da hızlıca kayıt olabilirsiniz.",
      },
      {
        question: "Kişisel bilgilerimin güvenliği nasıl sağlanıyor?",
        answer:
          "Kişisel verileriniz SSL şifreleme ile korunur ve güvenli sunucularda saklanır. KVKK'ya uygun olarak veri işleme faaliyetlerimizi yürütüyoruz. Verilerinizi asla üçüncü taraflarla paylaşmayız.",
      },
      {
        question: "Şifremi unuttum, ne yapmalıyım?",
        answer:
          "Giriş sayfasındaki 'Şifremi Unuttum' linkine tıklayarak e-posta adresinizi girin. Size şifre sıfırlama linki gönderilecektir.",
      },
    ],
  },
  {
    category: "Etkinlikler",
    questions: [
      {
        question: "Nasıl etkinlik oluştururum?",
        answer:
          "Giriş yaptıktan sonra 'Etkinlik Oluştur' sekmesine gidip etkinlik başlığı, açıklaması, tarihi, konumu ve kategorisini belirleyerek kolayca etkinlik oluşturabilirsiniz.",
      },
      {
        question: "Etkinliğime kimler başvuru gönderiyor?",
        answer:
          "Etkinlik sayfasında 'Başvurular' sekmesinden tüm başvuruları görebilir, başvuru sahiplerinin profillerini inceleyebilir ve kabul/ret kararı verebilirsiniz.",
      },
      {
        question: "Etkinlik iptal edersem ne olur?",
        answer:
          "Etkinliği iptal ettiğinizde tüm katılımcılara bildirim gönderilir. İptal nedeni belirtmeniz önerilir. Sık iptal eden organizatörler için uyarı sistemi vardır.",
      },
      {
        question: "Maksimum kaç kişi katılabilir?",
        answer:
          "Ücretsiz hesaplarla maksimum 50 kişilik etkinlik oluşturabilirsiniz. Premium üyeler için bu limit daha yüksektir ve sınırsız katılımcı seçeneği mevcuttur.",
      },
    ],
  },
  {
    category: "Başvurular ve Katılım",
    questions: [
      {
        question: "Kaç etkinliğe başvuru gönderebilirim?",
        answer:
          "Ücretsiz hesaplarla ayda 10 etkinliğe başvuru gönderebilirsiniz. Premium üyeler sınırsız başvuru gönderebilir.",
      },
      {
        question: "Başvurum reddedilirse ne olur?",
        answer:
          "Başvurunuz reddedilirse bildirim alırsınız. Bu durumda aynı etkinliğe tekrar başvuru gönderemezsiniz ancak organizatör sizi davet edebilir.",
      },
      {
        question: "Son dakika vazgeçersem ne olur?",
        answer:
          "Katılacağınız etkinlikten en az 24 saat önce vazgeçebilirsiniz. Son dakika vazgeçmeler profil puanınızı olumsuz etkiler.",
      },
    ],
  },
  {
    category: "Premium Üyelik",
    questions: [
      {
        question: "Premium üyeliğin avantajları neler?",
        answer:
          "Premium üyeler sınırsız başvuru gönderebilir, etkinliklerini öne çıkarabilir, gelişmiş chat özelliklerini kullanabilir ve öncelikli destek alabilirler.",
      },
      {
        question: "Premium üyelik ne kadar?",
        answer:
          "Aylık 29₺ veya yıllık 299₺'dir. Yıllık planla %15 tasarruf edersiniz. Öğrenci indirimi de mevcuttur.",
      },
      {
        question: "Premium üyeliği iptal edebilir miyim?",
        answer:
          "Evet, istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönemin sonuna kadar premium özellikler aktif kalır.",
      },
    ],
  },
];

export default function FAQ() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-nexus-100 dark:bg-nexus-900 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-nexus-600 to-nexus-700 bg-clip-text text-transparent">
              Sık Sorulan
            </span>{" "}
            Sorular
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nexus hakkında merak ettiğin her şeyin cevabı burada. Sorunun yoksa
            bize ulaşabilirsin!
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqData.map((section) => (
            <Card key={section.category}>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-nexus-500 to-nexus-600 rounded-full" />
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${section.category}-${index}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-nexus-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Sorunun cevabını bulamadın mı?
              </h3>
              <p className="text-muted-foreground mb-6">
                Bizimle iletişime geç, en kısa zamanda yardımcı olalım!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact">
                  <Button className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700">
                    Bize Ulaş
                  </Button>
                </Link>
                <Button variant="outline">Canlı Destek</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
