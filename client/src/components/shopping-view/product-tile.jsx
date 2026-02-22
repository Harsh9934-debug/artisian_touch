import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, Share2, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { addToWishlist, deleteWishlistItem, fetchWishlistItems } from "@/store/shop/wishlist-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingProductTile({
  product,
  handleAddtoCart,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const { toast } = useToast();

  const isInWishlist = wishlistItems && wishlistItems.length > 0
    ? wishlistItems.findIndex(item => item.productId === product?._id) > -1
    : false;

  function handleWishlistAction() {
    if (!user) {
      toast({
        title: "Please login to add items to wishlist",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    if (isInWishlist) {
      dispatch(deleteWishlistItem({ userId: user?.id, productId: product?._id })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchWishlistItems(user?.id));
          toast({ title: "Removed from wishlist" });
        }
      });
    } else {
      dispatch(addToWishlist({ userId: user?.id, productId: product?._id })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchWishlistItems(user?.id));
          toast({ title: "Added to wishlist" });
        }
      });
    }
  }

  const discountPercent = product?.salePrice > 0 && product?.price > 0
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden group border border-gray-200 rounded-xl shadow-none hover:shadow-lg transition-shadow bg-white flex flex-col h-full relative">
      <div onClick={() => navigate(`/shop/product/${product?._id}`)} className="cursor-pointer flex flex-col h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF9F6]">
          <img
            src={product?.image}
            alt={product?.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product?.totalStock === 0 ? (
              <span className="bg-black/80 text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm">
                Sold Out
              </span>
            ) : product?.totalStock < 10 ? (
              <span className="bg-red-500/90 text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm">
                Few Left
              </span>
            ) : null}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleWishlistAction(); }}
            className="absolute top-2 right-2 p-1.5 transition-colors z-20"
          >
            <div className="bg-white/90 rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
              <Heart className={`w-4 h-4 ${isInWishlist ? "fill-[#ff3e6c] text-[#ff3e6c]" : "text-gray-400"}`} />
            </div>
          </button>
        </div>

        <CardContent className="p-3 text-left flex-1 flex flex-col">
          <h2 className="text-sm font-bold text-[#282c3f] uppercase mb-1 truncate">
            {product?.category || "BRAND"}
          </h2>
          <p className="text-[13px] text-[#535665] font-normal truncate mb-2">
            {product?.title}
          </p>

          <div className="flex items-center gap-1.5 mb-1 flex-wrap mt-auto">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-[13px] text-gray-400 line-through">
                  {product?.price}
                </span>
                <span className="text-sm font-bold text-[#282c3f]">
                  ₹{product?.salePrice}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-[#282c3f]">
                ₹{product?.price}
              </span>
            )}
          </div>

          {product?.salePrice > 0 && (
            <div className="text-[12px] font-bold text-[#03a685]">
              {discountPercent}% off
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
