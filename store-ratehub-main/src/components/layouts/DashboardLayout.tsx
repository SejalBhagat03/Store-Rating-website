import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Store,
  Users,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { label: "Stores", href: "/admin/stores", icon: <Store className="w-5 h-5" /> },
];

const userNavItems: NavItem[] = [
  { label: "Stores", href: "/user", icon: <Store className="w-5 h-5" /> },
  { label: "My Ratings", href: "/user/ratings", icon: <Star className="w-5 h-5" /> },
];

const ownerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/owner", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Ratings", href: "/owner/ratings", icon: <Star className="w-5 h-5" /> },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role;

  // Prevent rendering BEFORE user is defined
  if (!role) {
    return <div className="p-6">Loading...</div>;
  }

  const navItems =
    role === "admin"
      ? adminNavItems
      : role === "owner"
      ? ownerNavItems
      : userNavItems;

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "owner"
      ? "Store Owner"
      : "User";

  const roleBadgeColor =
    role === "admin"
      ? "bg-primary/10 text-primary"
      : role === "owner"
      ? "bg-accent/20 text-accent-foreground"
      : "bg-secondary text-secondary-foreground";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Star className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">RateHub</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <Link
              to={`/${role}/settings`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Star className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">RateHub</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 hover:bg-secondary"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-card border-r w-64 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm hover:bg-secondary"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <Link
            to={`/${role}/settings`}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:pl-64 lg:pt-0">
        <div className="sticky top-0 z-20 hidden h-16 lg:flex items-center justify-end gap-4 border-b bg-card/80 px-6 backdrop-blur-xl">
          <span className={cn("rounded-full px-3 py-1 text-xs font-medium", roleBadgeColor)}>
            {roleLabel}
          </span>

          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
