import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

import {
  signupSchema,
  loginSchema,
  SignupFormData,
  LoginFormData,
  Role,
} from "@/lib/validations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, Loader2, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, login, user } = useAuth();
  const navigate = useNavigate();

  // LOGIN FORM
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // SIGNUP FORM
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      role: "user",
    },
  });

  // ---------------------------------------------------
  // ✅ HANDLE LOGIN
  // ---------------------------------------------------
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    const { error } = await login(data.email, data.password);

    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Welcome back!");
  };

  // ---------------------------------------------------
  // ✅ HANDLE SIGNUP
  // ---------------------------------------------------
  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    const { error } = await signUp(
      data.email,
      data.password,
      data.name,
      data.address || "",
      data.role
    );

    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Account created successfully!");
  };

  // ---------------------------------------------------
  // ✅ AUTO REDIRECT AFTER LOGIN (FIXED)
  // ---------------------------------------------------
  useEffect(() => {
    if (user?.role) {
      const redirectPath =
        user.role === "admin"
          ? "/admin"
          : user.role === "owner"
          ? "/owner"
          : "/user";

      navigate(redirectPath, { replace: true });
    }
  }, [user?.role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md animate-fade-in relative z-10 shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
              <Star className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Welcome to RateHub</CardTitle>
            <CardDescription className="mt-2">
              Rate and discover the best stores in your area
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...loginForm.register("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP FORM */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input type="text" placeholder="Your Name" {...signupForm.register("name")} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" {...signupForm.register("email")} />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...signupForm.register("password")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address (Optional)</Label>
                  <Textarea rows={2} placeholder="Your address" {...signupForm.register("address")} />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select
                    value={signupForm.watch("role")}
                    onValueChange={(value: Role) => signupForm.setValue("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="owner">Store Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
