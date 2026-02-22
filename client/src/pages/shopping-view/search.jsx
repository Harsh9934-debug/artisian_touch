import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function SearchProducts() {
  const [searchParams] = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") || "";
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useUser();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keywordFromUrl && keywordFromUrl.trim().length > 3) {
      dispatch(getSearchResults(keywordFromUrl));
    } else {
      dispatch(resetSearchResults());
    }
  }, [keywordFromUrl, dispatch]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto px-6 md:px-12 py-16 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-normal text-[#1a1c24] mb-2 uppercase tracking-wide">
              {keywordFromUrl ? `Search Results for "${keywordFromUrl}"` : "Search Collection"}
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              Discover timeless elegance in every piece
            </p>
          </div>
          {searchResults.length > 0 && (
            <span className="text-[11px] text-primary uppercase tracking-widest border-b border-primary pb-1">
              {searchResults.length} Pieces Found
            </span>
          )}
        </div>

        {!searchResults.length && keywordFromUrl.trim().length > 3 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-gray-100">
            <p className="text-xl font-serif italic text-gray-400 mb-2">No masterpieces found for your search.</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Try adjusting your refine parameters or explore our curated collections</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item._id}
              handleAddtoCart={handleAddtoCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
