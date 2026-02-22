import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { ImageSlider } from "../ui/image-slider";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useUser();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
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
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-12 p-0 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[75vw] overflow-hidden border-none shadow-2xl">
        <div className="relative bg-[#FAF9F6] h-[400px] md:h-full">
          {productDetails?.images && productDetails.images.length > 1 ? (
            <ImageSlider images={productDetails.images} />
          ) : (
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-8 md:p-12 flex flex-col h-full bg-white max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <span className="text-[10px] text-primary uppercase tracking-[0.3em] font-semibold mb-4 block">
              {productDetails?.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-normal font-serif text-[#1a1c24] leading-tight mb-4">
              {productDetails?.title}
            </h1>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center gap-6 mb-8">
            {productDetails?.salePrice > 0 ? (
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-normal text-[#1a1c24]">
                  ₹{productDetails?.salePrice}
                </span>
                <span className="text-lg text-gray-300 line-through">
                  ₹{productDetails?.price}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-normal text-[#1a1c24]">
                ₹{productDetails?.price}
              </span>
            )}
          </div>

          {/*
          <div className="flex items-center gap-4 py-3 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-1">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              ({reviews?.length || 0} reviews)
            </span>
          </div>
          */}

          <div className="mb-12">
            {productDetails?.totalStock === 0 ? (
              <Button className="luxury-button w-full bg-gray-100 text-gray-400 cursor-not-allowed border-none" disabled>
                UNAVAILABLE
              </Button>
            ) : (
              <Button
                className="luxury-button w-full bg-black text-white hover:bg-primary transition-all rounded-none py-6"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                ADD TO BAG
              </Button>
            )}
          </div>

          {/*
          <div className="flex-1">
            <h2 className="text-lg font-serif mb-8 text-[#1a1c24]">Customer Reflections</h2>
            <div className="space-y-8 mb-12">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem?._id} className="flex gap-4 group">
                    <Avatar className="w-8 h-8 border border-gray-100 shrink-0">
                      <AvatarFallback className="bg-[#FAF9F6] text-primary text-[10px]">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 flex-1 pb-6 border-b border-gray-50 group-last:border-none">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-[#1a1c24]">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-2.5 h-2.5 ${i < reviewItem.reviewValue ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 font-light italic leading-relaxed">
                        "{reviewItem.reviewMessage}"
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No reviews yet for this piece.</p>
              )}
            </div>

            <div className="bg-[#FAF9F6] p-6">
              <h3 className="text-xs uppercase tracking-widest text-[#1a1c24] mb-4">Share Your Experience</h3>
              <div className="space-y-4">
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="YOUR THOUGHTS..."
                  className="w-full bg-white border border-gray-200 p-3 text-[10px] tracking-wide outline-none focus:border-primary transition-all uppercase"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === "" || rating === 0}
                  className="luxury-button w-full bg-black text-white hover:bg-primary transition-all rounded-none py-4 text-[10px]"
                >
                  POST REVIEW
                </Button>
              </div>
            </div>
          </div>
          */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
