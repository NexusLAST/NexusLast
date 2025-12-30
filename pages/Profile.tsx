import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { BadgeSystem } from "@/components/Profile/BadgeSystem";
import { PhotoUpload } from "@/components/Profile/PhotoUpload";
import { MembershipPlans } from "@/components/Profile/MembershipPlans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Edit3,
  Save,
  X,
  Star,
  Calendar,
  MapPin,
  Crown,
  Settings,
  LogOut,
  Camera,
  Mail,
  Target,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface AttendedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  status: "completed" | "upcoming" | "cancelled";
  rating?: number;
}

// Mock data for attended events
const mockAttendedEvents: AttendedEvent[] = [
  {
    id: "1",
    title: "Startup Networking Kahvaltısı",
    date: "2024-02-10T09:00:00",
    location: "Kadıköy, İstanbul",
    category: "Girişimcilik",
    status: "completed",
    rating: 5,
  },
  {
    id: "2",
    title: "React Workshop",
    date: "2024-02-12T14:00:00",
    location: "Levent, İstanbul",
    category: "Teknoloji",
    status: "completed",
    rating: 4,
  },
  {
    id: "3",
    title: "Yoga ve Meditasyon",
    date: "2024-02-15T08:00:00",
    location: "Maçka Parkı, İstanbul",
    category: "Sağlık",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Basketbol Maçı",
    date: "2024-02-08T16:00:00",
    location: "Kadıköy Sahili, İstanbul",
    category: "Spor",
    status: "completed",
    rating: 5,
  },
  {
    id: "5",
    title: "Fotoğrafçılık Turu",
    date: "2024-02-18T17:30:00",
    location: "Sultanahmet, İstanbul",
    category: "Sanat",
    status: "upcoming",
  },
];

const purposes = [
  "Arkadaşlık",
  "Girişimcilik",
  "Spor & Fitness",
  "Teknoloji",
  "Sanat & Kültür",
  "Oyun & Eğlence",
  "Sağlık",
  "E��itim",
];

export default function Profile() {
  const { user, logout, setUser } = useDemoUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPurpose, setEditedPurpose] = useState("");
  const [editedAge, setEditedAge] = useState<number | undefined>();
  const [editedSchool, setEditedSchool] = useState("");
  const [editedCity, setEditedCity] = useState("");
  const [editedProfession, setEditedProfession] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [attendedEvents] = useState<AttendedEvent[]>(mockAttendedEvents);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedPurpose(user.purpose);
      setEditedAge(user.age);
      setEditedSchool(user.school || "");
      setEditedCity(user.city || "");
      setEditedProfession(user.profession || "");
      setEditedBio(user.bio || "");
      setProfilePhoto(user.photo_url || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user data
      const updatedUser = {
        ...user,
        name: editedName,
        purpose: editedPurpose,
        age: editedAge,
        school: editedSchool,
        city: editedCity,
        profession: editedProfession,
        bio: editedBio,
      };

      setUser(updatedUser);
      setIsEditing(false);

      toast({
        title: "Profil Güncellendi!",
        description: "Bilgileriniz başarıyla kaydedildi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditedName(user.name);
      setEditedPurpose(user.purpose);
      setEditedAge(user.age);
      setEditedSchool(user.school || "");
      setEditedCity(user.city || "");
      setEditedProfession(user.profession || "");
      setEditedBio(user.bio || "");
      setProfilePhoto(user.photo_url || "");
    }
    setIsEditing(false);
  };

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    setProfilePhoto(newPhotoUrl);

    // Update user context with new photo
    if (user) {
      const updatedUser = {
        ...user,
        photo_url: newPhotoUrl,
      };
      setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Başarıyla Çıkış Yapıldı",
      description: "Demo modundan çıktınız.",
    });
    navigate("/");
  };

  const getPlanInfo = () => {
    if (!user) return { name: "Bilinmiyor", color: "gray" };

    if (user.isPremium) {
      return { name: "Bireysel Plan", color: "nexus" };
    }
    return { name: "Free Plan", color: "gray" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "upcoming":
        return "Yaklaşan";
      case "cancelled":
        return "İptal";
      default:
        return "Bilinmiyor";
    }
  };

  const completedEvents = attendedEvents.filter(
    (e) => e.status === "completed",
  );
  const averageRating =
    completedEvents.reduce((acc, event) => acc + (event.rating || 0), 0) /
      completedEvents.length || 0;

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Card>
            <CardContent className="pt-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Profil Sayfası</h2>
              <p className="text-muted-foreground mb-6">
                Profilinizi görüntülemek için önce giriş yapmanız gerekiyor.
              </p>
              <Button onClick={() => navigate("/login")}>Giriş Yap</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-nexus-200 dark:border-nexus-800">
                  <AvatarImage src={profilePhoto || user.photo_url} />
                  <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300 text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <PhotoUpload
                  currentPhoto={profilePhoto || user.photo_url}
                  userName={user.name}
                  onPhotoUpdate={handlePhotoUpdate}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                      >
                        {user.purpose}
                      </Badge>
                      <Badge
                        className={`${getPlanInfo().color === "nexus" ? "bg-nexus-600" : "bg-gray-600"}`}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {getPlanInfo().name}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Düzenle
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                        >
                          {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Kaydet
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 mr-1" />
                          İptal
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{user.rating.toFixed(1)} ortalama puan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{attendedEvents.length} etkinlik katılımı</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{attendedEvents.length}</div>
              <div className="text-sm text-muted-foreground">Etkinlik</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Ortalama Puan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">28</div>
              <div className="text-sm text-muted-foreground">Arkadaş</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Oluşturulan</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Bilgiler</TabsTrigger>
            <TabsTrigger value="events">Etkinlikler</TabsTrigger>
            <TabsTrigger value="badges">Rozetler</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">İsim *</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="İsminizi girin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Yaş</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editedAge || ""}
                        onChange={(e) =>
                          setEditedAge(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        placeholder="Yaşınızı girin"
                        min="16"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Amaç *</Label>
                      <Select
                        value={editedPurpose}
                        onValueChange={setEditedPurpose}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Amaç seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposes.map((purpose) => (
                            <SelectItem key={purpose} value={purpose}>
                              {purpose}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Şehir</Label>
                      <Input
                        id="city"
                        value={editedCity}
                        onChange={(e) => setEditedCity(e.target.value)}
                        placeholder="Hangi şehirde yaşıyorsunuz?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="school">Okul</Label>
                      <Input
                        id="school"
                        value={editedSchool}
                        onChange={(e) => setEditedSchool(e.target.value)}
                        placeholder="Okuduğunuz/mezun olduğunuz okul"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profession">Meslek</Label>
                      <Input
                        id="profession"
                        value={editedProfession}
                        onChange={(e) => setEditedProfession(e.target.value)}
                        placeholder="Mesleğiniz veya uzmanlık alanınız"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="bio">Hakkımda</Label>
                      <Textarea
                        id="bio"
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        placeholder="Kendinizi kısaca tanıtın..."
                        className="min-h-[100px]"
                        maxLength={500}
                      />
                      <div className="text-xs text-muted-foreground text-right">
                        {editedBio.length}/500 karakter
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        İsim
                      </Label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        E-posta
                      </Label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Amaç
                      </Label>
                      <p className="text-lg">{user.purpose}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Yaş
                      </Label>
                      <p className="text-lg">
                        {user.age ? `${user.age} yaşında` : "Belirtilmemiş"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Şehir
                      </Label>
                      <p className="text-lg">{user.city || "Belirtilmemiş"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Okul
                      </Label>
                      <p className="text-lg">
                        {user.school || "Belirtilmemiş"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Meslek
                      </Label>
                      <p className="text-lg">
                        {user.profession || "Belirtilmemiş"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Üyelik Planı
                      </Label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg">{getPlanInfo().name}</p>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-nexus-600"
                        >
                          Planı Değiştir
                        </Button>
                      </div>
                    </div>
                    {user.bio && (
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Hakkımda
                        </Label>
                        <p className="text-lg mt-1 leading-relaxed">
                          {user.bio}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Katıldığım Etkinlikler
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendedEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Henüz Etkinlik Yok
                    </h3>
                    <p className="text-muted-foreground">
                      Henüz hiç etkinliğe katılmamışsınız. Yeni etkinlikler
                      keşfedin!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attendedEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{event.title}</h4>
                                <Badge className={getStatusColor(event.status)}>
                                  {getStatusText(event.status)}
                                </Badge>
                                <Badge variant="outline">
                                  {event.category}
                                </Badge>
                              </div>

                              <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(event.date).toLocaleDateString(
                                      "tr-TR",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>

                            {event.rating && (
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{event.rating}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <BadgeSystem />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Hesap Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Demo Modu</h4>
                      <p className="text-sm text-muted-foreground">
                        Şu anda demo modunda kullanıyorsunuz
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      Aktif
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Üyelik Planı</h4>
                      <p className="text-sm text-muted-foreground">
                        {getPlanInfo().name} kullanıyorsunuz
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Planı Yönet
                    </Button>
                  </div>

                  {/* Membership Plans */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Üyelik Planı</h4>
                    <MembershipPlans
                      currentPlan={user?.isPremium ? "individual" : "free"}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Demo Modundan Çık
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Demo Modundan Çıkış
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Demo modundan çıkmak istediğinizden emin misiniz? Bu
                            işlem sizi ana sayfaya yönlendirecek.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>
                            Çıkış Yap
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
