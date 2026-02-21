import { LogOut, Menu, UserCog, User, Heart, ShoppingBag, Search } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchWishlistItems } from "@/store/shop/wishlist-slice";
import { Label } from "../ui/label";
import { useAuth, useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

function MenuItems({ keyword, setKeyword, handleSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products"
        ? {
          category: [getCurrentMenuItem.id],
        }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-4 lg:gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="group relative flex items-center lg:h-[80px] py-2 lg:py-0 cursor-pointer"
        >
          <span className="text-[13px] font-bold tracking-widest text-[#282c3f] uppercase group-hover:text-primary transition-colors">
            {menuItem.label}
          </span>
          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#ee5f73] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </div>
      ))}
      <div className="hidden lg:flex items-center ml-10">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-[18px] h-[18px]" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full bg-[#f5f5f6] rounded-md py-[10px] pl-[40px] pr-4 text-sm text-[#282c3f] placeholder-gray-500 outline-none focus:bg-white focus:border focus:border-gray-200 transition-colors"
          />
        </div>
      </div>
    </nav>
  );
}

function HeaderRightContent({ isMobile }) {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    signOut();
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
      dispatch(fetchWishlistItems(user.id));
    }
  }, [dispatch, user?.id]);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6">
        <div onClick={() => navigate("/shop/account")} className="group relative flex items-center py-2 cursor-pointer">
          <User className="mr-4 h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
          <span className="text-[13px] font-bold tracking-widest text-[#282c3f] uppercase group-hover:text-primary transition-colors">
            Account
          </span>
        </div>
        <div onClick={() => navigate("/shop/wishlist")} className="group relative flex items-center py-2 cursor-pointer">
          <div className="relative mr-4">
            <Heart className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-2 bg-[#ff3f6c] text-white text-[10px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full">
              {wishlistItems?.length || 0}
            </span>
          </div>
          <span className="text-[13px] font-bold tracking-widest text-[#282c3f] uppercase group-hover:text-primary transition-colors">
            Wishlist
          </span>
        </div>
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
          <div onClick={() => setOpenCartSheet(true)} className="group relative flex items-center py-2 cursor-pointer">
            <div className="relative mr-4">
              <ShoppingBag className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-2 bg-[#ff3f6c] text-white text-[10px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full">
                {cartItems?.items?.length || 0}
              </span>
            </div>
            <span className="text-[13px] font-bold tracking-widest text-[#282c3f] uppercase group-hover:text-primary transition-colors">
              Bag
            </span>
          </div>
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        </Sheet>
        <SignedIn>
          <div onClick={handleLogout} className="group relative flex items-center py-2 cursor-pointer">
            <LogOut className="mr-4 h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
            <span className="text-[13px] font-bold tracking-widest text-[#282c3f] uppercase group-hover:text-primary transition-colors">
              Logout
            </span>
          </div>
        </SignedIn>
        <SignedOut>
          <div onClick={() => navigate("/auth/login")} className="group relative flex items-center py-2 cursor-pointer">
            <User className="mr-4 h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
            <span className="text-[13px] font-bold tracking-widest text-[#282c3f] uppercase group-hover:text-primary transition-colors">
              Login
            </span>
          </div>
        </SignedOut>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-row gap-6 lg:gap-8">
      <div className="hidden lg:flex flex-col items-center justify-center cursor-pointer group mt-1">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button onClick={() => navigate("/auth/login")} variant="outline" className="text-xs font-bold uppercase tracking-widest border-[#1a1c24] text-[#1a1c24] hover:bg-[#1a1c24] hover:text-white transition-all rounded-none px-6">
            Login
          </Button>
        </SignedOut>
      </div>

      <div
        onClick={() => navigate("/shop/wishlist")}
        className="hidden lg:flex flex-col items-center justify-center cursor-pointer group relative"
      >
        <Heart className="w-[20px] h-[20px] text-gray-700 group-hover:text-black transition-colors" />
        <span className="text-[11px] font-bold mt-1 text-black">Wishlist</span>
        <span className="absolute top-[-6px] right-[-6px] bg-[#ff3f6c] text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
          {wishlistItems?.length || 0}
        </span>
      </div>

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <div onClick={() => setOpenCartSheet(true)} className="flex flex-col items-center justify-center cursor-pointer group relative">
          <ShoppingBag className="w-[20px] h-[20px] text-gray-700 group-hover:text-black transition-colors" />
          <span className="text-[11px] font-bold mt-1 text-black">Bag</span>
          <span className="absolute top-[-6px] right-[-6px] bg-[#ff3f6c] text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {cartItems?.items?.length || 0}
          </span>
        </div>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
    </div>
  );
}

function ShoppingHeader() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    if (e.key === "Enter" && keyword.trim() !== "") {
      navigate(`/shop/search?keyword=${keyword}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="flex h-[80px] items-center px-4 md:px-6 lg:px-10 max-w-[1600px] mx-auto">
        <Link to="/shop/home" className="flex items-center gap-2 mr-8 shrink-0">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>
        <div className="hidden lg:flex items-center flex-shrink-0">
          <MenuItems keyword={keyword} setKeyword={setKeyword} handleSearch={handleSearch} />
        </div>

        {/* Mobile Search Bar (Only visible on small screens since desktop is in menu) */}
        <div className="lg:hidden flex-1 max-w-lg px-4 ml-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-[16px] h-[16px]" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
              type="text"
              placeholder="Search..."
              className="w-full bg-[#f5f5f6] rounded-md py-[8px] pl-[36px] pr-4 text-xs text-[#282c3f] placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Right: Icons & Mobile Menu */}
        <div className="ml-auto flex items-center gap-4">
          <HeaderRightContent />
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden border-none shadow-none">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs pt-10">
              <MenuItems keyword={keyword} setKeyword={setKeyword} handleSearch={handleSearch} />
              <div className="mt-8 border-t pt-8">
                <HeaderRightContent isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
