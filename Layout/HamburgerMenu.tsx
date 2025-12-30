import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  HelpCircle,
  Mail,
  Info,
  Shield,
  FileText,
  Users,
  Crown,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    category: "Bilgi",
    items: [
      {
        icon: Info,
        title: "Nasıl Çalışır?",
        description: "Platform kullanım rehberi",
        href: "/how-it-works",
      },
      {
        icon: HelpCircle,
        title: "Sık Sorulan Sorular",
        description: "Tüm sorularınızın cevabı",
        href: "/faq",
      },
      {
        icon: Users,
        title: "Topluluk Kuralları",
        description: "Platform kuralları ve davranış kodu",
        href: "/community-rules",
      },
    ],
  },
  {
    category: "Destek",
    items: [
      {
        icon: Mail,
        title: "İletişim",
        description: "Bizimle iletişime geçin",
        href: "/contact",
      },
      {
        icon: Crown,
        title: "Premium",
        description: "Premium özellikler ve fiyatlar",
        href: "/premium",
      },
    ],
  },
  {
    category: "Yasal",
    items: [
      {
        icon: Shield,
        title: "Gizlilik Politikası",
        description: "Kişisel veri koruma",
        href: "/privacy",
      },
      {
        icon: FileText,
        title: "Kullanım Şartları",
        description: "Hizmet kullanım koşulları",
        href: "/terms",
      },
    ],
  },
];

const socialLinks = [
  { name: "Twitter", url: "https://twitter.com/nexus" },
  { name: "Instagram", url: "https://instagram.com/nexus" },
  { name: "LinkedIn", url: "https://linkedin.com/company/nexus" },
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menüyü aç</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gradient-to-br from-nexus-500 to-nexus-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            Nexus Menü
          </SheetTitle>
          <SheetDescription>
            Platform bilgileri, destek ve iletişim seçenekleri
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {menuItems.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="w-8 h-8 bg-nexus-100 dark:bg-nexus-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-nexus-200 dark:group-hover:bg-nexus-800 transition-colors">
                        <Icon className="h-4 w-4 text-nexus-600 dark:text-nexus-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {section.category !== "Yasal" && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-8">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
            Sosyal Medya
          </h3>
          <div className="flex space-x-3">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  {social.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Nexus. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Sürüm 1.0.0</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
