import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Star, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  total_users: number;
  total_stores: number;
  total_ratings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  /**
   * TEMPORARY FUNCTION (SAFE)
   * Replace with real backend API later.
   */
  async function fetchStats() {
    setLoading(true);

    try {
      // Placeholder dummy stats
      const dummyStats: DashboardStats = {
        total_users: 25,
        total_stores: 8,
        total_ratings: 64,
      };

      setStats(dummyStats);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }

    setLoading(false);
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Stores",
      value: stats?.total_stores ?? 0,
      icon: <Store className="h-5 w-5" />,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Ratings",
      value: stats?.total_ratings ?? 0,
      icon: <Star className="h-5 w-5" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Avg. Rating",
      value:
        stats?.total_ratings && stats.total_stores
          ? (stats.total_ratings / stats.total_stores).toFixed(1)
          : "0.0",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="dashboard-header">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your platform's performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-3xl font-bold font-display">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/admin/users"
                className="block rounded-lg border border-border p-4 transition-all hover:bg-secondary hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, or view user accounts
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/stores"
                className="block rounded-lg border border-border p-4 transition-all hover:bg-secondary hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2 text-success">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Stores</p>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, or delete store listings
                    </p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="text-sm font-medium text-success">Online</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database Status</span>
                  <span className="text-sm font-medium text-success">Healthy</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Status</span>
                  <span className="text-sm font-medium text-success">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
