import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Plus,
  User,
  Users,
  LogOut,
  Home,
  Heart,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoUser } from "@/contexts/DemoUserContext";

export function Navbar() {
  const location = useLocation();
  const { user, logout, isDemo } = useDemoUser();

  const guestNavigation = [
    { name: "Ana Sayfa", href: "/", icon: Home },
    { name: "Nasıl Çalışır", href: "/how-it-works", icon: Calendar },
    { name: "SSS", href: "/faq", icon: Users },
    { name: "İletişim", href: "/contact", icon: User },
  ];

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Calendar },
    { name: "Etkinlik Oluştur", href: "/create-event", icon: Plus },
    { name: "Etkinliklerim", href: "/dashboard/my-events", icon: Calendar },
    { name: "Takvim", href: "/calendar", icon: Calendar },
    { name: "Harita", href: "/event-map", icon: MapPin },
    { name: "Topluluk", href: "/community", icon: Users },
    { name: "Arkadaşlarım", href: "/friends", icon: Heart },
    { name: "Profil", href: "/profile", icon: User },
  ];

  const navigation = user ? userNavigation : guestNavigation;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-nexus-500 to-nexus-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-nexus-600 to-nexus-700 bg-clip-text text-transparent">
              Nexus
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex items-center space-x-2",
                      isActive &&
                        "bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{user.name}</span>
                      {isDemo && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          Demo
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {user.rating.toFixed(1)} ⭐
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                >
                  Kayıt Ol
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="container">
          <div className="flex items-center justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center space-y-1 h-auto py-2 px-3",
                      isActive && "text-nexus-600 dark:text-nexus-400",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
