import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, Share2, Star } from "lucide-react";

function ShoppingProductTile({
  product,
  handleAddtoCart,
}) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm mx-auto group border-none shadow-md hover:shadow-2xl transition-all duration-300 relative bg-white rounded-2xl overflow-hidden">
      <div onClick={() => navigate(`/shop/product/${product?._id}`)} className="cursor-pointer">
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
              <Badge className="bg-[#ff3f6c] text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg">
                SALE
              </Badge>
            ) : null}
          </div>

          {/* Top Right: Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-md transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-md transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Left: Rating */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-gray-100">
              <span className="text-[11px] font-bold text-gray-900">4.1</span>
              <Star className="w-3 h-3 fill-green-600 text-green-600" />
              <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />
              <span className="text-[10px] font-medium text-gray-500">2.5k</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {brandOptionsMap[product?.brand]}
            </span>
            <h2 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
              {product?.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">
              ${product?.salePrice > 0 ? product?.salePrice : product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ${product?.price}
              </span>
            )}
            {product?.salePrice > 0 && (
              <span className="text-[10px] font-bold text-[#ff3f6c]">
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
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#1a1c24] hover:bg-[#2d313d] text-white shadow-lg hover:shadow-xl active:scale-95"
            }`}
        >
          {product?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
