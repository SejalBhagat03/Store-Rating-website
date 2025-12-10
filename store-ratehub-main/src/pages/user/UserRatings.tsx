import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RatingDisplay, StarRatingInput } from "@/components/ui/star-rating";
import { Loader2, Plus, Edit, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RatingEntry {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function UserRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");

  const [selectedRating, setSelectedRating] = useState<RatingEntry | null>(null);

  useEffect(() => {
    loadUserRatings();
  }, [user]);

  /**
   *  TEMPORARY
   *  Replace with backend API once ready.
   */
  async function loadUserRatings() {
    setLoading(true);

    // Dummy placeholder ratings
    const dummyRatings: RatingEntry[] = [
      {
        id: "1",
        rating: 4,
        comment: "Great service!",
        created_at: "2024-01-20",
      },
    ];

    setRatings(dummyRatings);
    setLoading(false);
  }

  async function handleAddRating() {
    if (!ratingValue) {
      toast.error("Please select a rating");
      return;
    }

    const newRating: RatingEntry = {
      id: String(Date.now()),
      rating: ratingValue,
      comment,
      created_at: new Date().toISOString(),
    };

    setRatings((prev) => [newRating, ...prev]);

    toast.success("Rating submitted!");
    setRatingValue(0);
    setComment("");
    setAddDialogOpen(false);
  }

  async function handleUpdateRating() {
    if (!selectedRating) return;

    setRatings((prev) =>
      prev.map((r) =>
        r.id === selectedRating.id
          ? { ...r, rating: ratingValue, comment }
          : r
      )
    );

    toast.success("Rating updated!");
    setEditDialogOpen(false);
  }

  async function handleDeleteRating() {
    if (!selectedRating) return;

    setRatings((prev) => prev.filter((r) => r.id !== selectedRating.id));

    toast.success("Rating deleted");
    setDeleteDialogOpen(false);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="dashboard-header">My Ratings</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, or delete your submitted ratings
          </p>
        </div>

        {/* Add Rating Button */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Rating
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Rating</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <StarRatingInput value={ratingValue} onChange={setRatingValue} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Comment</p>
                <Input
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button onClick={handleAddRating} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ratings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Ratings</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : ratings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">You have not submitted any ratings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {ratings.map((rating) => (
                      <TableRow key={rating.id}>
                        <TableCell>
                          <RatingDisplay rating={rating.rating} size="sm" />
                        </TableCell>
                        <TableCell>{rating.comment}</TableCell>
                        <TableCell>
                          {new Date(rating.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {/* Edit Dialog */}
                          <Dialog
                            open={editDialogOpen && selectedRating?.id === rating.id}
                            onOpenChange={setEditDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedRating(rating);
                                  setRatingValue(rating.rating);
                                  setComment(rating.comment);
                                  setEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Rating</DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4">
                                <StarRatingInput value={ratingValue} onChange={setRatingValue} />

                                <Input
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                />

                                <Button onClick={handleUpdateRating}>
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Delete Dialog */}
                          <AlertDialog
                            open={deleteDialogOpen && selectedRating?.id === rating.id}
                            onOpenChange={setDeleteDialogOpen}
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedRating(rating);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Rating?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteRating}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
