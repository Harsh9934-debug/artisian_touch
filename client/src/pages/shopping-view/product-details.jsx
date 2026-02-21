import { StarIcon, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails, fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToWishlist, deleteWishlistItem, fetchWishlistItems } from "@/store/shop/wishlist-slice";
import { useParams, Link, useNavigate } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useUser } from "@clerk/clerk-react";

function ProductDetailsPage() {
    const { id } = useParams();
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const { user } = useUser();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.shopCart);
    const { reviews } = useSelector((state) => state.shopReview);
    const { productDetails, productList, isLoading } = useSelector((state) => state.shopProducts);
    const { wishlistItems } = useSelector((state) => state.shopWishlist);

    const { toast } = useToast();

    const isInWishlist = wishlistItems && wishlistItems.length > 0
        ? wishlistItems.findIndex(item => item.productId === productDetails?._id) > -1
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
            dispatch(deleteWishlistItem({ userId: user?.id, productId: productDetails?._id })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchWishlistItems(user?.id));
                    toast({ title: "Removed from wishlist" });
                }
            });
        } else {
            dispatch(addToWishlist({ userId: user?.id, productId: productDetails?._id })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchWishlistItems(user?.id));
                    toast({ title: "Added to wishlist" });
                }
            });
        }
    }

    function handleRatingChange(getRating) {
        setRating(getRating);
    }

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        if (!user) {
            toast({
                title: "Please login to add items to cart",
                variant: "destructive",
            });
            navigate("/auth/login");
            return;
        }
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

    function handleAddReview() {
        if (!user) {
            toast({
                title: "Please login to add a review",
                variant: "destructive",
            });
            navigate("/auth/login");
            return;
        }
        dispatch(
            addReview({
                productId: productDetails?._id,
                userId: user?.id,
                userName: user?.userName,
                reviewMessage: reviewMsg,
                reviewValue: rating,
            })
        ).then((data) => {
            if (data.payload.success) {
                setRating(0);
                setReviewMsg("");
                dispatch(getReviews(productDetails?._id));
                toast({
                    title: "Review added successfully!",
                });
            }
        });
    }

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
            dispatch(getReviews(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (productDetails && productDetails.category) {
            dispatch(fetchAllFilteredProducts({
                filterParams: { category: [productDetails.category] },
                sortParams: "price-lowtohigh"
            }));
        }
    }, [productDetails, dispatch]);

    const averageReview =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
            reviews.length
            : 0;

    const similarProducts = productList?.filter(item => item._id !== productDetails?._id).slice(0, 4) || [];

    if (isLoading && !productDetails) return <div className="text-center py-20 font-bold text-3xl">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-2">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="w-full h-auto object-cover aspect-square rounded-xl"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                {productDetails?.category}
                            </span>
                            {productDetails?.totalStock < 10 && productDetails?.totalStock > 0 && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                    Limited Stock
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{productDetails?.title}</h1>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            {productDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className={`text-4xl font-extrabold text-[#1a1c24] ${productDetails?.salePrice > 0 ? "line-through text-gray-300 text-2xl" : ""
                                }`}
                        >
                            ${productDetails?.price}
                        </span>
                        {productDetails?.salePrice > 0 ? (
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-extrabold text-[#ff3f6c]">
                                    ${productDetails?.salePrice}
                                </span>
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                    {Math.round(((productDetails?.price - productDetails?.salePrice) / productDetails?.price) * 100)}% OFF
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                            <StarRatingComponent rating={averageReview} />
                            <span className="text-green-700 font-bold text-sm ml-1">
                                {averageReview.toFixed(1)}
                            </span>
                        </div>
                        <div className="w-[1px] h-4 bg-gray-200" />
                        <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                            {reviews?.length || 0} Ratings & Reviews
                        </span>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        {productDetails?.totalStock === 0 ? (
                            <Button className="w-full sm:flex-1 py-7 text-lg bg-gray-100 text-gray-400 cursor-not-allowed border-none" disabled>
                                Out of Stock
                            </Button>
                        ) : (
                            <>
                                <Button
                                    className="w-full sm:flex-1 py-7 text-lg font-bold bg-[#1a1c24] hover:bg-[#2d313d] text-white rounded-2xl transition-all active:scale-95"
                                    onClick={() =>
                                        handleAddToCart(
                                            productDetails?._id,
                                            productDetails?.totalStock
                                        )
                                    }
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleWishlistAction}
                                    className={`w-full sm:w-max px-8 py-7 text-lg font-bold rounded-2xl border-2 hover:bg-gray-50 transition-colors ${isInWishlist ? 'border-[#ff3f6c] text-[#ff3f6c] bg-[#ff3f6c]/5' : 'border-gray-100'}`}
                                >
                                    {isInWishlist ? "Saved to Wishlist" : "Wishlist"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Separator className="my-16 bg-gray-100" />

            {/* Similar Products Section */}
            {similarProducts.length > 0 && (
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Similar Products</h2>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Recommended for you</p>
                        </div>
                        <Link to={`/shop/listing?category=${productDetails?.category}`} className="group flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                            View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarProducts.map((similarItem) => (
                            <ShoppingProductTile
                                key={similarItem._id}
                                product={similarItem}
                                handleAddtoCart={handleAddToCart}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Customer Reviews</h2>
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-xl">
                            <span className="text-lg font-black">{averageReview.toFixed(1)}</span>
                            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                    <div className="grid gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        {reviews && reviews.length > 0 ? (
                            reviews.map((reviewItem) => (
                                <div key={reviewItem?._id} className="flex gap-4 p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                                    <Avatar className="w-14 h-14 border-2 border-white">
                                        <AvatarFallback className="bg-primary text-white font-black text-lg">
                                            {reviewItem?.userName[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 text-lg">{reviewItem?.userName}</h3>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Verified Purchase</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`w-3 h-3 ${i < reviewItem.reviewValue ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            {reviewItem.reviewMessage}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold uppercase tracking-widest">No reviews yet</p>
                                <p className="text-gray-400 text-xs mt-1">Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 p-8 rounded-[2rem] border-2 border-gray-100 bg-white flex flex-col gap-6">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Write a review</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Help others decide</p>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rating</Label>
                            <div className="flex gap-2">
                                <StarRatingComponent
                                    rating={rating}
                                    handleRatingChange={handleRatingChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="review" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Experience</Label>
                            <Input
                                id="review"
                                name="reviewMsg"
                                value={reviewMsg}
                                onChange={(event) => setReviewMsg(event.target.value)}
                                placeholder="Describe your experience..."
                                className="py-8 rounded-2xl border-gray-200 focus:ring-primary/20 transition-all text-base px-6 italic"
                            />
                        </div>

                        <Button
                            onClick={handleAddReview}
                            disabled={reviewMsg.trim() === "" || rating === 0}
                            className="w-full py-7 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            Submit Review
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;