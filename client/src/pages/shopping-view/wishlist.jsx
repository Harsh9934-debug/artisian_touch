import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistItems } from "@/store/shop/wishlist-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function ShoppingWishlist() {
    const { wishlistItems, isLoading: isWishlistLoading } = useSelector((state) => state.shopWishlist);
    const { user, isLoaded: isUserLoaded } = useUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (isUserLoaded && user?.id) {
            dispatch(fetchWishlistItems(user.id));
        }
    }, [dispatch, user, isUserLoaded]);

    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        // Re-used logic similar to listing page
        const getCartItems = wishlistItems || []; // Need real cartItems from state if checking stock, for now just add

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

    if (!isUserLoaded || isWishlistLoading) {
        return <div className="min-h-[50vh] flex justify-center items-center font-bold text-gray-500">Loading your wishlist...</div>;
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 border-b pb-4">My Wishlist</h1>
            {wishlistItems && wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {wishlistItems.map((item) => (
                        <ShoppingProductTile
                            key={item.productId}
                            product={{
                                _id: item.productId,
                                image: item.image,
                                title: item.title,
                                price: item.price,
                                salePrice: item.salePrice,
                                totalStock: item.totalStock,
                            }}
                            handleAddtoCart={handleAddtoCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <h2 className="text-2xl font-bold text-gray-600">Your wishlist is empty!</h2>
                    <p className="text-gray-400 mt-2">Explore our products and tap the heart icon to save them here.</p>
                </div>
            )}
        </div>
    );
}

export default ShoppingWishlist;
