import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Users, Clock, Crown } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { FriendInvitation } from "./FriendInvitation";
import { toast } from "@/hooks/use-toast";

const eventFormSchema = z.object({
  title: z
    .string()
    .min(5, "Başlık en az 5 karakter olmalıdır")
    .max(100, "Başlık en fazla 100 karakter olabilir"),
  description: z
    .string()
    .min(20, "Açıklama en az 20 karakter olmalıdır")
    .max(1000, "Açıklama en fazla 1000 karakter olabilir"),
  date: z.date({
    required_error: "Etkinlik tarihi seçiniz",
  }),
  time: z.string().min(1, "Etkinlik saati seçiniz"),
  location: z
    .string()
    .min(5, "Konum en az 5 karakter olmalıdır")
    .max(200, "Konum en fazla 200 karakter olabilir"),
  category: z.string().min(1, "Kategori seçiniz"),
  maxParticipants: z.string().optional(),
  isPremium: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const categories = [
  "Startup",
  "Spor",
  "Sanat",
  "Teknoloji",
  "Sağlık",
  "Eğitim",
  "Sosyal",
  "Müzik",
  "Yemek",
  "Seyahat",
];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<any[]>([]);
  const [isCloneMode, setIsCloneMode] = useState(false);
  const { user, isDemo } = useDemoUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "",
      maxParticipants: "",
      isPremium: false,
    },
  });

  // Handle clone mode
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "clone") {
      setIsCloneMode(true);
      const cloneData = sessionStorage.getItem("cloneEventData");
      if (cloneData) {
        try {
          const parsedData = JSON.parse(cloneData);

          // Set form values with cloned data
          form.reset({
            title: parsedData.title,
            description: parsedData.description,
            location: parsedData.location,
            category: parsedData.category,
            maxParticipants: parsedData.maxParticipants?.toString() || "",
            isPremium: parsedData.isPremiumEvent || false,
          });

          // Set date and time
          if (parsedData.date) {
            const cloneDate = new Date(parsedData.date);
            form.setValue("date", cloneDate);
            form.setValue("time", format(cloneDate, "HH:mm"));
          }

          // Clear the stored data
          sessionStorage.removeItem("cloneEventData");

          toast({
            title: "Etkinlik Bilgileri Yüklendi",
            description:
              "Kopyalanan etkinlik bilgileri form alanlarına yerleştirildi. Tarih otomatik olarak 7 gün sonraya ayarlandı.",
          });
        } catch (error) {
          console.error("Error parsing clone data:", error);
          toast({
            title: "Hata",
            description: "Kopyalanan etkinlik bilgileri yüklenemedi.",
            variant: "destructive",
          });
        }
      }
    }
  }, [searchParams, form]);

  const watchedValues = form.watch();

  const onSubmit = async (values: EventFormValues) => {
    if (!user) {
      toast({
        title: "Hata",
        description: "Etkinlik oluşturmak için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time
      const eventDateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(":");
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      const eventData = {
        title: values.title,
        description: values.description,
        date: eventDateTime.toISOString(),
        location: values.location,
        category: values.category,
        max_participants: values.maxParticipants
          ? parseInt(values.maxParticipants)
          : null,
        is_premium: values.isPremium,
        created_by: user.id,
      };

      if (isDemo) {
        // Demo mode: simulate database operation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast({
          title: isCloneMode ? "Etkinlik Kopyalandı!" : "Etkinlik Oluşturuldu!",
          description: isCloneMode
            ? "Etkinlik başarıyla kopyalandı ve yeni tarihle yayınlandı."
            : "Etkinliğiniz başarıyla oluşturuldu ve yayınlandı.",
        });
      } else {
        // Real Supabase integration
        const { error } = await supabase.from("events").insert([eventData]);

        if (error) {
          throw error;
        }

        toast({
          title: isCloneMode ? "Etkinlik Kopyalandı!" : "Etkinlik Oluşturuldu!",
          description: isCloneMode
            ? "Etkinlik başarıyla kopyalandı ve yeni tarihle yayınlandı."
            : "Etkinliğiniz başarıyla oluşturuldu ve yayınlandı.",
        });
      }

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Hata",
        description:
          "Etkinlik oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <h3 className="text-lg font-semibold mb-4">
            Giriş Yapmanız Gerekiyor
          </h3>
          <p className="text-muted-foreground mb-4">
            Etkinlik oluşturmak için önce giriş yapmanız gerekiyor.
          </p>
          <Button onClick={() => navigate("/login")}>Giriş Yap</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {isCloneMode ? "Etkinlik Kopyala" : "Yeni Etkinlik Oluştur"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isCloneMode
            ? "Mevcut etkinlik bilgileri ile yeni bir etkinlik oluştur"
            : "Şehrindeki insanlarla buluşmak için bir etkinlik oluştur"}
        </p>
        {isCloneMode && (
          <div className="mt-4">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Kopyalama Modu Aktif
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Etkinlik Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etkinlik Başlığı *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Etkinliğinize çekici bir başlık verin"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          İnsanların ilgisini çekecek açık ve net bir başlık
                          yazın
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Etkinliğinizin detaylarını açıklayın..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ne yapacağınız, neden katılmalılar, ne beklemeleri
                          gerektiği hakkında bilgi verin
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tarih *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: tr })
                                  ) : (
                                    <span>Tarih seçin</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saat *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Saat seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konum *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Etkinliğin yapılacağı yer (örn: Taksim, İstanbul)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Spesifik adres veya genel konum bilgisi yazabilirsiniz
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category and Max Participants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Kategori seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maksimum Katılımcı</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Sınırsız"
                              min="2"
                              max="500"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Boş bırakırsanız sınırsız olacaktır
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Premium Option */}
                  <FormField
                    control={form.control}
                    name="isPremium"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            Premium Etkinlik
                          </FormLabel>
                          <FormDescription>
                            Etkinliğiniz daha fazla görünürlük kazansın ve öne
                            çıksın
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!user?.isPremium}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!user?.isPremium && (
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        Premium özellikler için <strong>Premium üyelik</strong>{" "}
                        gereklidir.
                        <Button
                          variant="link"
                          className="p-0 h-auto text-nexus-600"
                        >
                          Premium'a geç
                        </Button>
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                    >
                      {isSubmitting ? "Oluşturuluyor..." : "Etkinliği Oluştur"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Friend Invitation Section */}
          <FriendInvitation onInvitedFriendsChange={setInvitedFriends} />
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Önizleme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {watchedValues.title && (
                  <div>
                    <h3 className="font-semibold line-clamp-2">
                      {watchedValues.title}
                    </h3>
                  </div>
                )}

                {watchedValues.category && (
                  <Badge
                    variant="secondary"
                    className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                  >
                    {watchedValues.category}
                  </Badge>
                )}

                {watchedValues.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {watchedValues.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  {watchedValues.date && watchedValues.time && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-nexus-500" />
                      <span>
                        {format(watchedValues.date, "PPP", { locale: tr })} -{" "}
                        {watchedValues.time}
                      </span>
                    </div>
                  )}

                  {watchedValues.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-nexus-500" />
                      <span className="truncate">{watchedValues.location}</span>
                    </div>
                  )}

                  {watchedValues.maxParticipants && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-nexus-500" />
                      <span>
                        Maksimum {watchedValues.maxParticipants} katılımcı
                      </span>
                    </div>
                  )}
                </div>

                {watchedValues.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                    Premium
                  </Badge>
                )}

                {invitedFriends.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span>{invitedFriends.length} arkadaş davet edildi</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
