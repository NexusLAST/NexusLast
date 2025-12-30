import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HamburgerMenu } from "@/components/Layout/HamburgerMenu";
import { NexusLogo } from "@/components/ui/nexus-logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Target,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signUp } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const purposes = [
  {
    value: "arkadaşlık",
    label: "Arkadaşlık",
    icon: "👥",
    description: "Yeni arkadaşlar edinme",
  },
  {
    value: "startup",
    label: "Startup",
    icon: "🚀",
    description: "Girişim ve iş dünyası",
  },
  {
    value: "spor",
    label: "Spor",
    icon: "⚽",
    description: "Spor aktiviteleri",
  },
  {
    value: "sanat",
    label: "Sanat",
    icon: "🎨",
    description: "Sanat ve kültür",
  },
  {
    value: "teknoloji",
    label: "Teknoloji",
    icon: "💻",
    description: "Tech etkinlikleri",
  },
  {
    value: "eğitim",
    label: "Eğitim",
    icon: "📚",
    description: "Öğrenme ve gelişim",
  },
  {
    value: "sosyal",
    label: "Sosyal",
    icon: "🎉",
    description: "Genel sosyal aktiviteler",
  },
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Profile Setup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    purpose: "",
    bio: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  // Demo kullanıcı bilgilerini otomatik doldur
  useEffect(() => {
    if (isDemo) {
      setFormData({
        name: "Demo Kullanıcı",
        email: "demo@nexus.com",
        password: "demo123",
        confirmPassword: "demo123",
        purpose: "startup",
        bio: "Ben Nexus'un demo kullanıcısıyım. Uygulamayı test etmek için buradayım!",
      });

      toast({
        title: "Demo modu aktif! 🎯",
        description:
          "Bilgiler otomatik dolduruldu. İstediğinizi değiştirebilirsiniz.",
      });
    }
  }, [isDemo, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ad soyad gerekli";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Ad soyad en az 2 karakter olmalı";
    }

    if (!formData.email) {
      newErrors.email = "E-posta gerekli";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gerekli";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifre onayı gerekli";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.purpose) {
      newErrors.purpose = "Bir amaç seçin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        purpose: formData.purpose,
      });

      toast({
        title: "Kayıt başarılı! 🎉",
        description:
          "E-posta adresinizi doğruladıktan sonra giriş yapabilirsiniz.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Kayıt sırasında hata",
        description: error.message || "Bir hata oluştu, lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

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

      {/* Register Form */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-6">
          {/* Demo Mode Info */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Demo Modu Aktif
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Uygulamayı hızlıca denemek için ana sayfadaki{" "}
                  <strong>"Demo Dene"</strong> butonunu kullanın. Gerçek hesap
                  oluşturmak için Supabase yapılandırması gereklidir.
                </p>
                <Link to="/" className="inline-block mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    Demo'yu Dene
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {step === 1 ? (
                  <>
                    <User className="h-6 w-6 text-nexus-600" />
                    Hesap Oluştur
                  </>
                ) : (
                  <>
                    <Target className="h-6 w-6 text-nexus-600" />
                    Profil Bilgileri
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Nexus topluluğuna katılmak için bilgilerini gir"
                  : "Son adım! Profilini kişiselleştir"}
              </CardDescription>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div
                  className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-nexus-600" : "bg-muted"}`}
                />
                <div
                  className={`w-8 h-0.5 ${step >= 2 ? "bg-nexus-600" : "bg-muted"}`}
                />
                <div
                  className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-nexus-600" : "bg-muted"}`}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {step === 1 ? (
                // Step 1: Basic Information
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Adınız Soyadınız"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Şifre Onayı</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                  >
                    Devam Et
                  </Button>
                </>
              ) : (
                // Step 2: Profile Setup
                <>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Amacın nedir?</Label>
                    <Select
                      value={formData.purpose}
                      onValueChange={(value) =>
                        handleInputChange("purpose", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bir amaç seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {purposes.map((purpose) => (
                          <SelectItem key={purpose.value} value={purpose.value}>
                            <div className="flex items-center gap-2">
                              <span>{purpose.icon}</span>
                              <div>
                                <div className="font-medium">
                                  {purpose.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {purpose.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.purpose && (
                      <p className="text-sm text-destructive">
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Kısa Tanıtım (Opsiyonel)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Kendini kısaca tanıt..."
                      className="min-h-[80px]"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Diğer kullanıcılar seni daha iyi tanısın
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Geri
                    </Button>
                    <Button
                      onClick={handleRegister}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                    >
                      {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
                    </Button>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ya da
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Google ile Kayıt Ol
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                      Zaten hesabın var mı?{" "}
                    </span>
                    <Link to="/login">
                      <Button
                        variant="link"
                        className="h-auto p-0 text-nexus-600"
                      >
                        Giriş Yap
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
