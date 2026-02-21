import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
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

  return (
    <Card className="h-full flex flex-col w-full max-w-sm mx-auto group border-none transition-all duration-300 relative bg-white rounded-2xl overflow-hidden">
      <div onClick={() => navigate(`/shop/product/${product?._id}`)} className="cursor-pointer flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product?.image}
            alt={product?.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Top Left: Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product?.totalStock === 0 ? (
              <Badge className="bg-black/80 text-white backdrop-blur-md border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-orange-500 text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {`Only ${product?.totalStock} Left`}
              </Badge>
            ) : null}
            {product?.salePrice > 0 ? (
              <Badge className="bg-green-600 text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {`${Math.round(
                  ((product?.price - product?.salePrice) / product?.price) * 100
                )}% OFF`}
              </Badge>
            ) : null}
          </div>

          {/* Top Right: Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={(e) => { e.stopPropagation(); handleWishlistAction(); }} className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full transition-colors shadow-sm">
              <Heart className={`w-4 h-4 ${isInWishlist ? "fill-[#ff3f6c] text-[#ff3f6c]" : ""}`} />
            </button>
            <button className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>


        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div className="mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {brandOptionsMap[product?.brand]}
            </span>
            <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
              {product?.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-base font-bold text-gray-900">
              ₹{product?.salePrice > 0 ? product?.salePrice : product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product?.price}
              </span>
            )}
            {product?.salePrice > 0 && (
              <span className="text-[10px] font-bold text-green-600">
                ({Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}% OFF)
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleAddtoCart(product?._id, product?.totalStock);
          }}
          disabled={product?.totalStock === 0}
          className={`w-full font-bold text-xs py-5 rounded-xl transition-all duration-300 ${product?.totalStock === 0
            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-[#1a1c24] hover:bg-[#2d313d] text-white active:scale-95"
            }  }`}
        >
          {product?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
