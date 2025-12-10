import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Store, Star, Users, TrendingUp, Loader2 } from "lucide-react";
import { RatingDisplay } from "@/components/ui/star-rating";

interface OwnerStore {
  id: string;
  name: string;
  email: string;
  address: string | null;
}

interface DashboardData {
  store: OwnerStore | null;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
}

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData>({
    store: null,
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  /**
   * TEMP BACKEND REPLACEMENT:
   * Replace this function with real REST API calls later.
   */
  async function fetchDashboardData() {
    if (!user) return;

    setLoading(true);

    try {
      // Placeholder store (until backend is created)
      const dummyStore: OwnerStore = {
        id: "temp-store-id",
        name: "Your Store Name",
        email: "store@example.com",
        address: "123 Placeholder Street",
      };

      // Placeholder ratings (until backend is created)
      const dummyDistribution = { 1: 1, 2: 0, 3: 2, 4: 4, 5: 10 };
      const totalRatings = Object.values(dummyDistribution).reduce((a, b) => a + b, 0);
      const averageRating =
        totalRatings > 0
          ? (
              (dummyDistribution[1] * 1 +
                dummyDistribution[2] * 2 +
                dummyDistribution[3] * 3 +
                dummyDistribution[4] * 4 +
                dummyDistribution[5] * 5) /
              totalRatings
            ).toFixed(1)
          : 0;

      setData({
        store: dummyStore,
        averageRating: Number(averageRating),
        totalRatings,
        ratingDistribution: dummyDistribution,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data.store) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="dashboard-header">Store Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and view ratings</p>

          <Card className="py-12">
            <CardContent className="text-center">
              <Store className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No store assigned</p>
              <p className="text-sm text-muted-foreground">
                Contact an administrator to assign a store to your account
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const maxDistribution = Math.max(...Object.values(data.ratingDistribution), 1);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="dashboard-header">Store Dashboard</h1>
        <p className="text-muted-foreground">Overview of {data.store.name}</p>

        {/* Store Info */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Store Name</p>
                <p className="font-medium">{data.store.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{data.store.email}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">
                  {data.store.address || "No address provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="stat-card animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Average Rating
              </CardTitle>
              <div className="rounded-lg bg-accent/20 p-2">
                <Star className="h-5 w-5 text-accent-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <RatingDisplay rating={data.averageRating} size="md" />
            </CardContent>
          </Card>

          <Card className="stat-card animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Ratings
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.totalRatings}</p>
            </CardContent>
          </Card>

          <Card className="stat-card animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                5-Star Ratings
              </CardTitle>
              <div className="rounded-lg bg-success/10 p-2 text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {data.totalRatings > 0
                  ? Math.round((data.ratingDistribution[5] / data.totalRatings) * 100)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium">{star} ★</span>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{
                        width: `${
                          (data.ratingDistribution[star] / maxDistribution) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-sm text-muted-foreground text-right">
                    {data.ratingDistribution[star]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
