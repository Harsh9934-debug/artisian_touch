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

const GlobalSkeleton = () => (
  <div className="flex flex-col bg-white overflow-hidden min-h-screen">
    {/* Header Skeleton */}
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 relative">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        <div className="hidden lg:flex flex-1 justify-center items-center gap-8">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-4 w-20 bg-gray-200" />)}
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-[180px] h-10 rounded-md bg-gray-200 hidden md:block" />
          <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
          <Skeleton className="w-10 h-10 rounded-full bg-gray-200 hidden sm:block" />
        </div>
      </div>
    </header>

    {/* Body Skeleton */}
    <main className="flex flex-col w-full flex-grow">
      {/* Hero Skeleton */}
      <section className="w-full px-4 md:px-6 lg:px-12 py-4 md:py-8 bg-white">
        <div className="relative w-full max-w-[1400px] mx-auto h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-[#151515]">
          <div className="absolute inset-0 bg-black flex items-center">
            <div className="absolute inset-0 w-full h-full flex justify-end">
              <div className="w-full md:w-4/5 lg:w-3/4 h-full relative">
                <Skeleton className="w-full h-full rounded-none bg-white/5" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/60 md:via-black/20 to-transparent" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full h-full px-6 md:px-16 lg:px-24 flex flex-col justify-end md:justify-center pb-12 md:pb-0">
                <div className="w-full md:w-3/5 lg:w-1/2 relative z-10">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                    <Skeleton className="h-4 w-32 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                  <Skeleton className="h-12 md:h-16 lg:h-20 w-3/4 md:w-full bg-white/20 mb-3 md:mb-6" />
                  <Skeleton className="h-6 w-36 bg-white/20 mt-1 md:mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 md:gap-3 mt-4 md:mt-6">
          <Skeleton className="h-1.5 md:h-2 w-8 md:w-10 bg-black rounded-full" />
          <Skeleton className="h-1.5 md:h-2 w-4 md:w-5 bg-gray-200 rounded-full" />
          <Skeleton className="h-1.5 md:h-2 w-4 md:w-5 bg-gray-200 rounded-full" />
        </div>
      </section>

      {/* Category Grid Skeleton */}
      <section className="py-7 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <Skeleton className="h-10 md:h-12 w-48 md:w-64 bg-gray-200 mb-4" />
              <Skeleton className="h-4 md:h-6 w-64 md:w-96 bg-gray-200" />
            </div>
            <Skeleton className="h-6 w-24 bg-gray-200 hidden sm:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className={`w-full h-[300px] md:h-[400px] rounded-[2.5rem] bg-gray-200 ${i > 1 ? 'hidden lg:block' : ''} ${i === 1 ? 'hidden md:block' : ''}`} />
            ))}
          </div>
        </div>
      </section>
    </main>
  </div>
);

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

  if (!isLoaded) return <GlobalSkeleton />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Suspense fallback={<GlobalSkeleton />}>
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
