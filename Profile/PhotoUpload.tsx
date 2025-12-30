import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Upload, X, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDemoUser } from "@/contexts/DemoUserContext";

interface PhotoUploadProps {
  currentPhoto?: string;
  userName: string;
  onPhotoUpdate: (photoUrl: string) => void;
}

export function PhotoUpload({
  currentPhoto,
  userName,
  onPhotoUpdate,
}: PhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDemo } = useDemoUser();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hatalı Dosya Tipi",
        description: "Lütfen sadece resim dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Dosya Çok Büyük",
        description: "Fotoğraf boyutu 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);

    try {
      if (isDemo) {
        // Demo mode: simulate upload
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // In demo mode, use the preview URL (local file URL)
        onPhotoUpdate(previewUrl);

        toast({
          title: "Fotoğraf Güncellendi!",
          description: "Profil fotoğrafınız başarıyla güncellendi. (Demo Mode)",
        });
      } else {
        // Real Supabase storage upload would go here
        // const { data, error } = await supabase.storage
        //   .from('profile-photos')
        //   .upload(`${userId}/${Date.now()}.jpg`, selectedFile);

        // For now, simulate success
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onPhotoUpdate(previewUrl);

        toast({
          title: "Fotoğraf Yüklendi!",
          description: "Profil fotoğrafınız başarıyla güncellendi.",
        });
      }

      setIsOpen(false);
      resetState();
    } catch (error) {
      toast({
        title: "Yükleme Hatası",
        description:
          "Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    resetState();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profil Fotoğrafı Değiştir</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-nexus-200 dark:border-nexus-800">
                <AvatarImage src={previewUrl || currentPhoto} />
                <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300 text-3xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {previewUrl && (
                <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!selectedFile ? (
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-12"
              >
                <Upload className="h-4 w-4 mr-2" />
                Fotoğraf Seç
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={resetState}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Guidelines */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Maksimum dosya boyutu: 5MB</p>
            <p>• Desteklenen formatlar: JPG, PNG, GIF</p>
            <p>• En iyi sonuç için kare format önerilir</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isUploading}
            >
              İptal
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </div>

          {isDemo && (
            <div className="text-xs text-center text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded">
              Demo modunda fotoğraf geçici olarak saklanır
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
