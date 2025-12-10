import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const storeSchema = z.object({
  name: z.string().min(2, "Store name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address is required"),
});

export default function AdminStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    fetchStores();
  }, []);

  /**
   * TEMP BACKEND REPLACEMENT
   * Replace this with real API calls when backend is ready
   */
  async function fetchStores() {
    setLoading(true);

    try {
      const dummyStores = [
        {
          id: "store-1",
          name: "Test Store",
          email: "store@example.com",
          address: "123 Placeholder Road",
        },
      ];

      setStores(dummyStores);
    } catch (error) {
      console.error("Failed to load stores:", error);
      toast.error("Failed to load stores");
    }

    setLoading(false);
  }

  async function addStore(values: any) {
    try {
      toast.success("Store added (placeholder). Replace with real API.");
      form.reset();
    } catch (error) {
      toast.error("Failed to add store");
    }
  }

  async function deleteStore(id: string) {
    try {
      toast.success("Store deleted (placeholder). Replace with real API.");
    } catch (error) {
      toast.error("Failed to delete store");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="dashboard-header">Manage Stores</h1>
          <p className="text-muted-foreground">
            View, add, and remove stores assigned to the platform.
          </p>
        </div>

        {/* Add Store Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Store</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(addStore)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium">Store Name</label>
                <input
                  {...form.register("name")}
                  className="input"
                  placeholder="Enter store name"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  {...form.register("email")}
                  className="input"
                  placeholder="store@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <input
                  {...form.register("address")}
                  className="input"
                  placeholder="Enter store address"
                />
                {form.formState.errors.address && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-fit">
                Add Store
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Store List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Existing Stores ({stores.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : stores.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No stores found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell>{store.address}</TableCell>

                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Store</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteStore(store.id)}
                              >
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
