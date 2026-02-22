import { StarIcon, ChevronRight, Heart, ShoppingBag, Star, Truck } from "lucide-react";
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
import { ImageSlider } from "@/components/ui/image-slider";
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

    const discountPercent = productDetails?.salePrice > 0 && productDetails?.price > 0
        ? Math.round(((productDetails.price - productDetails.salePrice) / productDetails.price) * 100)
        : 0;

    const displayImages = productDetails?.images?.length > 0
        ? productDetails.images
        : [productDetails?.image].filter(Boolean);

    const similarProducts = productList?.filter(item => item._id !== productDetails?._id).slice(0, 4) || [];

    if (isLoading && !productDetails) return <div className="text-center py-20 font-bold text-3xl">Loading...</div>;

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
            {/* Breadcrumbs */}
            <div className="text-sm text-[#535665] mb-6 flex items-center gap-2 font-medium tracking-wide">
                <Link to="/shop/home" className="hover:text-gray-900 transition-colors">Home</Link>
                <span className="text-xs">/</span>
                <Link to="/shop/listing" className="hover:text-gray-900 transition-colors">Shop</Link>
                <span className="text-xs">/</span>
                <Link to={`/shop/listing?category=${productDetails?.category}`} className="hover:text-gray-900 transition-colors capitalize font-bold text-[#282c3f]">
                    {productDetails?.category}
                </Link>
                <span className="text-xs">/</span>
                <span className="text-[#535665]">More By {productDetails?.category}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left: Image Grid (cols span 7) */}
                <div className="lg:col-span-7 flex justify-center lg:justify-start">
                    <div className={`w-full ${displayImages?.length > 1 ? "grid grid-cols-2 gap-4" : "flex justify-center lg:justify-center"}`}>
                        {displayImages?.map((imgUrl, index) => (
                            <div key={index} className={`aspect-[3/4] overflow-hidden bg-[#FAF9F6] ${displayImages?.length === 1 ? "w-full max-w-lg" : "w-full"}`}>
                                <img
                                    src={imgUrl}
                                    alt={`${productDetails?.title} - view ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Sticky Details (cols span 5) */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-24 pr-4">
                        {/* Brand / Category */}
                        <h1 className="text-[28px] font-bold text-[#282c3f] uppercase tracking-wide leading-none mb-2">
                            {productDetails?.category || "BRAND"}
                        </h1>
                        {/* Title */}
                        <h2 className="text-xl text-[#535665] font-normal leading-tight mb-4">
                            {productDetails?.title}
                        </h2>

                        {/* Rating Badge */}

                        <Separator className="bg-gray-200 mt-4 mb-5" />

                        {/* Pricing */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-2xl font-bold text-[#282c3f]">
                                    ₹{productDetails?.salePrice > 0 ? productDetails?.salePrice : productDetails?.price}
                                </span>
                                {productDetails?.salePrice > 0 && (
                                    <>
                                        <span className="text-xl text-[#7e818c] font-light line-through">
                                            MRP ₹{productDetails?.price}
                                        </span>
                                        <span className="text-xl font-bold text-[#ff905a]">
                                            ({discountPercent}% OFF)
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-[#03a685] text-sm font-bold mt-1">inclusive of all taxes</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 mb-8">
                            {productDetails?.totalStock === 0 ? (
                                <Button className="flex-1 bg-gray-100 text-[#535665] cursor-not-allowed h-[54px] text-sm font-bold tracking-wide rounded-[4px]" disabled>
                                    OUT OF STOCK
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                                        className="flex-1 bg-[#ff3e6c] hover:bg-[#eb3863] text-white h-[54px] text-sm font-bold tracking-widest rounded-[4px] flex items-center justify-center gap-3 transition-colors shadow-sm uppercase"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to bag
                                    </Button>
                                    <Button
                                        onClick={handleWishlistAction}
                                        variant="outline"
                                        className={`flex-[0.7] h-[54px] text-sm font-bold tracking-widest rounded-[4px] flex items-center justify-center gap-3 transition-colors uppercase shadow-sm ${isInWishlist ? 'border-[#ff3e6c] text-[#ff3e6c]' : 'bg-white border-gray-300 text-[#282c3f] border-2 hover:bg-white hover:text-[#282c3f]'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-[#ff3e6c]' : ''}`} />
                                        {isInWishlist ? "Saved" : "Wishlist"}
                                    </Button>
                                </>
                            )}
                        </div>


                        {/* Delivery Options Placeholder */}
                        {/* <div className="mb-8 pl-1">
                            <div className="flex items-center gap-3 mb-4 text-[#282c3f] font-bold tracking-wide text-sm">
                                DELIVERY OPTIONS <Truck className="w-5 h-5 text-[#535665]" />
                            </div>
                            <div className="relative max-w-sm border border-gray-300 rounded-[4px] focus-within:border-[#282c3f] transition-colors bg-white">
                                <Input
                                    placeholder="Enter pincode"
                                    className="border-none focus-visible:ring-0 shadow-none bg-transparent h-[45px] pr-20 text-base"
                                />
                                <button className="absolute right-0 top-0 h-full px-4 text-[#ff3e6c] font-bold text-sm tracking-wide bg-white rounded-r-[4px]">
                                    Check
                                </button>
                            </div>
                            <p className="text-xs text-[#535665] mt-2 leading-relaxed max-w-sm">
                                Please enter PIN code to check delivery time & Pay on Delivery Availability
                            </p>
                        </div> */}

                        <Separator className="bg-gray-200 my-6" />

                        {/* Description */}
                        <div className="pl-1">
                            <div className="flex items-center gap-3 mb-4 text-[#282c3f] font-bold tracking-wide text-sm">
                                PRODUCT DETAILS
                            </div>
                            <div className="text-base text-[#535665] leading-relaxed pr-6 whitespace-pre-line font-light">
                                {productDetails?.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products Section */}
            {similarProducts.length > 0 && (
                <div className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-normal font-serif mb-4">You May Also Like</h2>
                        <div className="w-12 h-px bg-primary mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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

            {/*
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-32 border-t pt-24">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-serif mb-12">Customer Reviews</h2>
                    <div className="space-y-12">
                        {reviews && reviews.length > 0 ? (
                            reviews.map((reviewItem) => (
                                <div key={reviewItem?._id} className="flex gap-8 group">
                                    <Avatar className="w-12 h-12 border border-gray-100 shrink-0">
                                        <AvatarFallback className="bg-[#FAF9F6] text-primary font-normal text-lg">
                                            {reviewItem?.userName[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-3 flex-1 pb-12 border-b border-gray-50 group-last:border-none">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-[#1a1c24]">{reviewItem?.userName}</h3>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Verified Purchase</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`w-3 h-3 ${i < reviewItem.reviewValue ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed font-light italic">
                                            "{reviewItem.reviewMessage}"
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-[#FAF9F6] rounded-sm italic text-gray-400">
                                <p>Be the first to share your thoughts on this piece.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-32 bg-[#FAF9F6] p-10">
                        <h3 className="text-xl font-serif mb-8 text-[#1a1c24]">Share Your Review</h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase tracking-widest text-gray-400">Rating</Label>
                                <div className="flex gap-2">
                                    <StarRatingComponent
                                        rating={rating}
                                        handleRatingChange={handleRatingChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="review" className="text-[10px] uppercase tracking-widest text-gray-400">Your Experience</Label>
                                <textarea
                                    id="review"
                                    name="reviewMsg"
                                    value={reviewMsg}
                                    onChange={(event) => setReviewMsg(event.target.value)}
                                    placeholder="TELL US MORE..."
                                    className="w-full bg-white border border-gray-200 p-4 text-xs font-light tracking-wide outline-none focus:border-primary transition-all min-h-[120px] uppercase"
                                />
                            </div>

                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === "" || rating === 0}
                                className="luxury-button w-full bg-black text-white hover:bg-primary transition-all rounded-none"
                            >
                                Post Review
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </div>
    );
}

export default ProductDetailsPage;