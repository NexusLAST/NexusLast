# MyEvents Feature

Bu dosya Nexus platformunun "Etkinliklerim" özelliğini açıklar.

## Genel Bakış

`/dashboard/my-events` rotasında erişilebilen "Etkinliklerim" sayfası, kullanıcıların katıldıkları ve oluşturdukları etkinlikleri yönetmelerini sağlar.

## Özellikler

### 1. İki Ana Sekme

- **Katıldıklarım**: Kullanıcının katıldığı etkinlikler
- **Oluşturduklarım**: Kullanıcının oluşturduğu etkinlikler

### 2. Katıldıklarım Sekmesi

- Yaklaşan ve tamamlanan etkinlikler görüntülenir
- Tamamlanan etkinlikler için yorum yapma/güncelleme
- Etkinlik detaylarını görüntüleme
- Kullanıcının verdiği puanlar ve yorumlar gösterilir

### 3. Oluşturduklarım Sekmesi

- Üç kategoriye ayrılır:
  - **Yaklaşan** (>24 saat): Düzenlenebilir, başvurular yönetilebilir
  - **24 Saat İçinde**: Sadece başvurular görüntülenebilir
  - **Tamamlanan**: İstatistikler, yorumlar ve clone işlemi

### 4. Akıllı Durumlar

- Etkinlik tarihi ve saatine göre otomatik durum belirleme
- 24 saat kuralı: Yaklaşan etkinlikler için düzenleme kısıtlaması
- Tamamlanan etkinlikler için feedback sistemi

## Dosya Yapısı

```
components/MyEvents/
├── JoinedEventsTab.tsx          # Katıldıklarım sekmesi
├── CreatedEventsTab.tsx         # Oluşturduklarım sekmesi
├── EventStatusTag.tsx           # Etkinlik durum etiketleri
├── index.ts                     # Export dosyası
└── README.md                    # Bu dosya

pages/
└── MyEvents.tsx                 # Ana sayfa component'i

data/
└── mockMyEvents.ts              # Mock veri dosyası
```

## Veri Yapısı

### MockEvent Interface

- Temel etkinlik bilgileri (başlık, açıklama, tarih, lokasyon)
- Katılımcı verileri ve geri bildirimler
- Durum yönetimi (upcoming, active, completed, cancelled)
- Rating ve feedback sistemi

### Mock Data

- `mockJoinedEvents`: Kullanıcının katıldığı etkinlikler
- `mockMyEvents`: Kullanıcının oluşturduğu etkinlikler

## Entegrasyon

### Supabase Hazırlığı

Kodlar gerçek Supabase veritabanı için hazır:

- `participants` tablosu: Katıldıklarım verileri
- `events` tablosu: Oluşturduklarım verileri
- `event_feedback` tablosu: Kullanıcı geri bildirimleri

### UI/UX Özellikleri

- Mobil uyumlu responsive tasarım
- Karanlık mod desteği
- Loading state'leri ve skeleton ekranlar
- Boş durum (empty state) tasarımları
- Toast bildirimleri

## Kullanım

1. `/dashboard/my-events` rotasına git
2. "Katıldıklarım" veya "Oluşturduklarım" sekmesini seç
3. İlgili etkinlik kartlarında aksiyonları kullan
4. Feedback ver, detayları görüntüle veya etkinlikleri yönet

## Bağımlılıklar

- React Router (routing)
- Radix UI Tabs (sekme yapısı)
- Tailwind CSS (styling)
- Lucide Icons (ikonlar)
- Demo User Context (kullanıcı yönetimi)
- Mevcut UI components (Button, Card, Badge, etc.)
