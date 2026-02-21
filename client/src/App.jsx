import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import API_URL from "./config/api";

import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";
import CheckAuth from "./components/common/check-auth";

const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const ShoppingHome = lazy(() => import("./pages/shopping-view/home"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const PaypalReturnPage = lazy(() => import("./pages/shopping-view/paypal-return"));
const PaymentSuccessPage = lazy(() => import("./pages/shopping-view/payment-success"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));
const ProductDetailsPage = lazy(() => import("./pages/shopping-view/product-details"));
const ShoppingWishlist = lazy(() => import("./pages/shopping-view/wishlist"));
const UnauthPage = lazy(() => import("./pages/unauth-page"));
const NotFound = lazy(() => import("./pages/not-found"));

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    if (isSignedIn && clerkUser?.id) {
      axios.post(`${API_URL}/api/common/user/sync`, {
        userId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        userName: clerkUser.fullName || clerkUser.username || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0],
      }).catch((err) => console.log("Failed to sync Clerk user to MongoDB", err));
    }
  }, [isSignedIn, clerkUser]);

  if (!isLoaded) return <Skeleton className="w-[800px] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Suspense fallback={<Skeleton className="w-full h-[600px] bg-gray-100" />}>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth />
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login/*" element={<AuthLogin />} />
            <Route path="register/*" element={<AuthRegister />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>
          <Route
            path="/shop"
            element={
              <CheckAuth>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="wishlist" element={<ShoppingWishlist />} />
          </Route>
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
