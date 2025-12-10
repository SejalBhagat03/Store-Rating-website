import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, MapPin, Loader2, Store } from "lucide-react";
import { StarRating, RatingDisplay } from "@/components/ui/star-rating";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface StoreWithRating {
  id: string;
  name: string;
  email: string;
  address: string | null;
  average_rating: number;
  rating_count: number;
  user_rating: number | null;
}

export default function UserStores() {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const [selectedStore, setSelectedStore] = useState<StoreWithRating | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  /**
   * TEMPORARY: Replace with backend API when ready
   */
  async function loadStores() {
    setLoading(true);

    const dummyStores: StoreWithRating[] = [
      {
        id: "1",
        name: "Sunshine Bakery",
        email: "contact@sunshine.com",
        address: "MG Road, Pune",
        average_rating: 4.2,
        rating_count: 12,
        user_rating: null,
      },
      {
        id: "2",
        name: "City Electronics",
        email: "support@cityelectronics.com",
        address: "Nagpur Central Mall",
        average_rating: 3.8,
        rating_count: 7,
        user_rating: 4,
      },
    ];

    setStores(dummyStores);
    setLoading(false);
  }

  function openRatingDialog(store: StoreWithRating) {
    setSelectedStore(store);
    setNewRating(store.user_rating ?? 0);
  }

  async function handleRatingSubmit() {
    if (!selectedStore) return;

    if (newRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    // Update locally
    setStores((prev) =>
      prev.map((s) =>
        s.id === selectedStore.id
          ? {
              ...s,
              user_rating: newRating,
              rating_count: s.rating_count + (s.user_rating ? 0 : 1),
            }
          : s
      )
    );

    toast.success(selectedStore.user_rating ? "Rating updated!" : "Rating submitted!");

    setIsSubmitting(false);
    setSelectedStore(null);
    setNewRating(0);
  }

  const filteredStores = stores.filter((store) => {
    const matchesName = store.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesAddress =
      store.address?.toLowerCase().includes(searchAddress.toLowerCase()) ??
      searchAddress === "";
    return matchesName && matchesAddress;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="dashboard-header">Discover Stores</h1>
          <p className="text-muted-foreground mt-1">Browse and rate stores in your area</p>
        </div>

        {/* Search filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by store name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by address..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredStores.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <Store className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No stores found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStores.map((store, index) => (
              <Card
                key={store.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {store.address || "No address provided"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Overall Rating</p>
                    <RatingDisplay rating={store.average_rating} count={store.rating_count} />
                  </div>

                  {store.user_rating !== null && (
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Your Rating</p>
                      <StarRating rating={store.user_rating} size="sm" />
                    </div>
                  )}

                  {/* Rating Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={store.user_rating !== null ? "outline" : "default"}
                        className="w-full"
                        onClick={() => openRatingDialog(store)}
                      >
                        {store.user_rating !== null ? "Update Rating" : "Rate This Store"}
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rate {selectedStore?.name}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-muted-foreground">
                            {selectedStore?.user_rating !== null
                              ? "Update your rating for this store"
                              : "How would you rate this store?"}
                          </p>

                          <StarRating
                            rating={newRating}
                            size="lg"
                            interactive
                            onRatingChange={setNewRating}
                          />

                          <p className="text-sm text-muted-foreground">
                            {newRating > 0 ? `${newRating} out of 5 stars` : "Click to rate"}
                          </p>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedStore(null);
                              setNewRating(0);
                            }}
                          >
                            Cancel
                          </Button>

                          <Button onClick={handleRatingSubmit} disabled={newRating === 0 || isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                              </>
                            ) : selectedStore?.user_rating !== null ? (
                              "Update Rating"
                            ) : (
                              "Submit Rating"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
