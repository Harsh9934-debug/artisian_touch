import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleAddtoCart,
}) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm mx-auto group border-none shadow-md hover:shadow-2xl transition-all duration-300">
      <div onClick={() => navigate(`/shop/product/${product?._id}`)}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product?.image}
            alt={product?.title}
            loading="lazy"
            className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product?.totalStock === 0 ? (
              <Badge className="bg-red-500 text-white border-none px-3 py-1 font-bold">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-orange-500 text-white border-none px-3 py-1 font-bold">
                {`Only ${product?.totalStock} left`}
              </Badge>
            ) : null}
            {product?.salePrice > 0 ? (
              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-none px-3 py-1 font-bold">
                SALE
              </Badge>
            ) : null}
          </div>
        </div>
        <CardContent className="p-5">
          <h2 className="text-xl font-bold mb-1 text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm font-medium text-muted-foreground italic">
              by {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className={`${product?.salePrice > 0 ? "line-through text-gray-400 text-base" : "text-2xl font-bold text-primary"
                  }`}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-2xl font-extrabold text-primary">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-5 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl transition-all"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
