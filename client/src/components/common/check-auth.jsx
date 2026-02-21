import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

function CheckAuth({ children }) {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const role = user?.publicMetadata?.role || "user";

  console.log(location.pathname, isSignedIn);

  if (location.pathname === "/") {
    if (!isSignedIn) {
      return <Navigate to="/shop/home" />;
    } else {
      if (role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (
    !isSignedIn &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/shop/home") ||
      location.pathname.includes("/shop/listing") ||
      location.pathname.includes("/shop/search") ||
      location.pathname.includes("/shop/product")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isSignedIn &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isSignedIn &&
    role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isSignedIn &&
    role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
