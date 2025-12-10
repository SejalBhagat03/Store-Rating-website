import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { format } from "date-fns";

interface RatingWithUser {
  id: string;
  rating: number;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

export default function OwnerRatings() {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchRatings();
  }, [user]);

  /**
   * TEMP FUNCTION:
   * Replace this once your backend API is created.
   */
  async function fetchRatings() {
    if (!user) return;

    setLoading(true);

    try {
      // Placeholder for owner's store (until backend is available)
      setStoreName("Your Store");

      // Placeholder ratings data
      const placeholder: RatingWithUser[] = [];

      setRatings(placeholder);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="dashboard-header">Store Ratings</h1>
          <p className="text-muted-foreground mt-1">
            {storeName ? `View all ratings for ${storeName}` : "View ratings submitted by users"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              User Ratings ({ratings.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-8">
                <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">No ratings yet</p>
                <p className="text-sm text-muted-foreground">
                  Ratings will appear here once users start rating your store
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {ratings.map((rating) => (
                      <TableRow key={rating.id}>
                        <TableCell className="font-medium">{rating.user.name}</TableCell>
                        <TableCell>{rating.user.email}</TableCell>
                        <TableCell>
                          <StarRating rating={rating.rating} size="sm" />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(rating.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
