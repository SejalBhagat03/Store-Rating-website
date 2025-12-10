import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import UserStores from "./pages/user/UserStores";
import UserRatings from "./pages/user/UserRatings";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerRatings from "./pages/owner/OwnerRatings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/auth" replace />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/ratings"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserRatings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/settings"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Owner Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/ratings"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerRatings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/settings"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
