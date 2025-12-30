# Nexus - Supabase Kurulum Rehberi

Bu rehber, Nexus uygulaması için Supabase veritabanı kurulumunu adım adım açıklamaktadır.

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine giriş yapın
2. "New project" butonuna tıklayın
3. Proje adını "nexus" olarak ayarlayın
4. Güçlü bir database password oluşturun
5. Proje oluşturulduktan sonra bekleyin

## 2. Environment Variables Ayarlama

1. `.env.example` dosyasını `.env` olarak kopyalayın
2. Supabase projenizin Settings > API sayfasından:
   - **Project URL**'i kopyalayın ve `VITE_SUPABASE_URL` olarak ayarlayın
   - **anon public** key'i kopyalayın ve `VITE_SUPABASE_ANON_KEY` olarak ayarlayın

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Veritabanı Tablolarını Oluşturma

Supabase SQL Editor'de aşağıdaki kodları çalıştırın:

```sql
-- Users tablosu
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  purpose TEXT NOT NULL,
  isPremium BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events tablosu
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  max_participants INTEGER,
  category TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests tablosu
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Ratings tablosu
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_user, to_user, event_id)
);

-- Messages tablosu
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Row Level Security (RLS) Politikaları

```sql
-- Users tablosu için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Events tablosu için RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Requests tablosu için RLS
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view requests for their events" ON requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = requests.event_id
      AND events.created_by = auth.uid()
    )
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can insert their own requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ratings tablosu için RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = from_user);

-- Messages tablosu için RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.event_id = messages.event_id
      AND requests.user_id = auth.uid()
      AND requests.status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = messages.event_id
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Event participants can insert messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.event_id = messages.event_id
      AND requests.user_id = auth.uid()
      AND requests.status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = messages.event_id
      AND events.created_by = auth.uid()
    )
  );
```

## 5. Auth Trigger'ı Ayarlama

```sql
-- Yeni kullanıcı kaydolduğunda users tablosuna otomatik ekleme
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, purpose)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Yeni Kullanıcı'),
    COALESCE(new.raw_user_meta_data->>'purpose', 'Sosyal')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 6. Örnek Veri Ekleme

```sql
-- Örnek kullanıcılar (manuel ekleme)
INSERT INTO users (id, email, name, purpose, isPremium, rating) VALUES
('11111111-1111-1111-1111-111111111111', 'ahmet@example.com', 'Ahmet Yılmaz', 'Startup', true, 4.8),
('22222222-2222-2222-2222-222222222222', 'zeynep@example.com', 'Zeynep Kaya', 'Spor', false, 4.5);

-- Örnek etkinlikler
INSERT INTO events (title, description, date, location, created_by, max_participants, category, is_premium) VALUES
('Startup Networking Gecesi', 'İstanbul genç girişimcilerin buluşma etkinliği', '2024-02-15 19:00:00+03', 'Beyoğlu, İstanbul', '11111111-1111-1111-1111-111111111111', 20, 'Startup', true),
('Basketbol Maçı', 'Kadıköy sahilinde arkadaşça basketbol maçı', '2024-02-14 16:00:00+03', 'Kadıköy Sahili, İstanbul', '22222222-2222-2222-2222-222222222222', 10, 'Spor', false);

-- Örnek başvuru
INSERT INTO requests (event_id, user_id, status)
SELECT events.id, '22222222-2222-2222-2222-222222222222', 'pending'
FROM events
WHERE title = 'Startup Networking Gecesi';
```

## 7. Realtime Özelliklerini Aktifleştirme

Supabase Dashboard'da:

1. Settings > API > Realtime sekmesine gidin
2. Şu tabloları aktifleştirin:
   - `events`
   - `requests`
   - `messages`
   - `ratings`

## 8. Google OAuth Kurulumu (Opsiyonel)

1. [Google Cloud Console](https://console.cloud.google.com) 'da yeni proje oluşturun
2. APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID
3. Authorized redirect URIs'e Supabase callback URL'i ekleyin:
   `https://your-project.supabase.co/auth/v1/callback`
4. Client ID ve Client Secret'i kopyalayın
5. Supabase Dashboard > Authentication > Providers > Google'ı aktifleştirin
6. Client ID ve Client Secret'i girin

## Kurulum Tamamlandı!

Artık uygulamanızı `npm run dev` ile çalıştırabilir ve Supabase bağlantısını test edebilirsiniz.

### Sorun Giderme

- **Environment variables yüklenmiyorsa**: `.env` dosyasının proje kök dizininde olduğundan emin olun
- **CORS hatası alıyorsanız**: Supabase URL'in doğru olduğunu kontrol edin
- **Authentication çalışmıyorsa**: RLS politikalarının doğru ayarlandığından emin olun
