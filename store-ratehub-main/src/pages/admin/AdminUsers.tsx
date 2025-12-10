import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  CreateUserFormData,
  Role,
} from "@/lib/validations";
import { toast } from "sonner";
import { Plus, Search, ArrowUpDown, Eye, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RatingDisplay } from "@/components/ui/star-rating";
import { useAuth } from "@/contexts/AuthContext";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  address: string | null;
  role: Role;
  createdAt: string;
  store_rating?: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [sortField, setSortField] =
    useState<"name" | "email" | "createdAt">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserWithRole | null>(null);

  const { signUp } = useAuth();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      role: "user",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  /** Fetch Users from Backend */
  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/admin/users");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load users");

      setUsers(data.users);
    } catch {
      toast.error("Failed to fetch users");
    }
    setLoading(false);
  }

  /** Create new user through backend */
  const handleCreateUser = async (data: CreateUserFormData) => {
    setIsSubmitting(true);

    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      toast.error(response.error || "Failed to create user");
      return;
    }

    toast.success("User created successfully!");
    setDialogOpen(false);
    form.reset();
    fetchUsers();
  };

  /** Sorting function */
  const handleSort = (field: "name" | "email" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  /** Filter + Sort */
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.address?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";
      const compare =
        fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
      return sortDirection === "asc" ? compare : -compare;
    });

  /** Badge Colors */
  const getRoleBadge = (role: Role) => {
    return {
      admin: "bg-primary/10 text-primary",
      owner: "bg-accent/10 text-accent-foreground",
      user: "bg-secondary text-secondary-foreground",
    }[role];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <h1 className="dashboard-header">Users</h1>
            <p className="text-muted-foreground">Manage platform users</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(handleCreateUser)}
                className="space-y-4"
              >
                <div>
                  <Label>Full Name</Label>
                  <Input {...form.register("name")} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" {...form.register("email")} />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input type="password" {...form.register("password")} />
                </div>

                <div>
                  <Label>Address</Label>
                  <Textarea {...form.register("address")} />
                </div>

                <div>
                  <Label>Role</Label>
                  <Select
                    value={form.watch("role")}
                    onValueChange={(value: Role) =>
                      form.setValue("role", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as Role | "all")}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1"
                      >
                        Name <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>

                    <TableHead>
                      <button
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-1"
                      >
                        Email <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>

                    <TableHead>Address</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="truncate max-w-xs">
                          {user.address || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getRoleBadge(user.role)}
                            variant="outline"
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>

                              {selectedUser && (
                                <div className="space-y-2">
                                  <p><b>Name:</b> {selectedUser.name}</p>
                                  <p><b>Email:</b> {selectedUser.email}</p>
                                  <p><b>Address:</b> {selectedUser.address || "-"}</p>
                                  <p>
                                    <b>Role:</b>{" "}
                                    <Badge className={getRoleBadge(selectedUser.role)}>
                                      {selectedUser.role}
                                    </Badge>
                                  </p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
