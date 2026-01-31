import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useParams } from "react-router-dom";

function ProductDetailsPage() {
    const { id } = useParams();
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { reviews } = useSelector((state) => state.shopReview);
    const { productDetails, isLoading } = useSelector((state) => state.shopProducts);

    const { toast } = useToast();

    function handleRatingChange(getRating) {
        setRating(getRating);
    }

    function handleAddToCart(getCurrentProductId, getTotalStock) {
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

    const averageReview =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
            reviews.length
            : 0;

    if (isLoading) return <div className="text-center py-20 font-bold text-3xl">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="w-full h-auto object-cover aspect-square"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{productDetails?.title}</h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {productDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className={`text-4xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through text-gray-400" : ""
                                }`}
                        >
                            ${productDetails?.price}
                        </span>
                        {productDetails?.salePrice > 0 ? (
                            <span className="text-4xl font-bold text-red-600">
                                ${productDetails?.salePrice}
                            </span>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                        <StarRatingComponent rating={averageReview} />
                        <span className="text-gray-500 font-medium">
                            ({averageReview.toFixed(1)} / 5.0)
                        </span>
                    </div>
                    <div className="mt-4">
                        {productDetails?.totalStock === 0 ? (
                            <Button className="w-full lg:w-max px-12 py-6 text-lg opacity-60 cursor-not-allowed">
                                Out of Stock
                            </Button>
                        ) : (
                            <Button
                                className="w-full lg:w-max px-12 py-6 text-lg font-bold"
                                onClick={() =>
                                    handleAddToCart(
                                        productDetails?._id,
                                        productDetails?.totalStock
                                    )
                                }
                            >
                                Add to Cart
                            </Button>
                        )}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-8">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <div className="grid gap-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((reviewItem) => (
                                    <div key={reviewItem?._id} className="flex gap-4 p-4 rounded-xl bg-gray-50">
                                        <Avatar className="w-12 h-12 border">
                                            <AvatarFallback className="bg-primary text-white font-bold">
                                                {reviewItem?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-800">{reviewItem?.userName}</h3>
                                            </div>
                                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                                            <p className="text-gray-600 mt-1 italic">
                                                "{reviewItem.reviewMessage}"
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                            )}
                        </div>

                        <div className="mt-4 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col gap-4">
                            <h3 className="text-xl font-bold">Write a review</h3>
                            <div className="flex gap-1">
                                <StarRatingComponent
                                    rating={rating}
                                    handleRatingChange={handleRatingChange}
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="review" className="text-sm font-semibold">Your Review</Label>
                                <Input
                                    id="review"
                                    name="reviewMsg"
                                    value={reviewMsg}
                                    onChange={(event) => setReviewMsg(event.target.value)}
                                    placeholder="Share your thoughts about this product..."
                                    className="py-6"
                                />
                            </div>
                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === "" || rating === 0}
                                className="w-max"
                            >
                                Post Review
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;
