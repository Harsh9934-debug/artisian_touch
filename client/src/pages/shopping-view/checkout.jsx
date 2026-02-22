import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useUser();
  const { razorpayOrderId, orderId } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  function handleInitiateRazorpayPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.payload.amount,
          currency: data.payload.currency,
          name: "Artisian Touch",
          description: "Order Payment",
          order_id: data.payload.razorpayOrderId,
          handler: async function (response) {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.payload.orderId,
            };

            dispatch(capturePayment(paymentData)).then((captureData) => {
              if (captureData?.payload?.success) {
                toast({
                  title: "Payment successful! Your order is confirmed.",
                });
                navigate("/shop/payment-success");
              } else {
                toast({
                  title: "Payment verification failed.",
                  variant: "destructive",
                });
              }
              setIsPaymemntStart(false);
            });
          },
          prefill: {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          },
          theme: {
            color: "#000000",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setIsPaymemntStart(false);
        toast({
          title: "Failed to create order. Please try again.",
          variant: "destructive",
        });
      }
    });
  }



  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-16 border-b border-gray-100 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#1a1c24] mb-4">Secure Checkout</h1>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">Complete your acquisition with confidence</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Column: Address */}
          <div className="flex-1">
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-[#FAF9F6] p-8 md:p-12 sticky top-32">
              <h2 className="text-xl font-serif mb-12 text-[#1a1c24]">Bag Summary</h2>
              <div className="flex flex-col gap-8 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cartItems && cartItems.items && cartItems.items.length > 0
                  ? cartItems.items.map((item) => (
                    <UserCartItemsContent key={item.productId || item.id} cartItem={item} />
                  ))
                  : <p className="text-gray-400 italic font-serif">Your bag is empty.</p>}
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Total Selection Value</span>
                  <span className="text-2xl font-normal text-[#1a1c24]">₹{totalCartAmount}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center italic">
                  Luxury packaging and global shipping included
                </p>
              </div>

              <div className="mt-12">
                <Button
                  onClick={handleInitiateRazorpayPayment}
                  className="luxury-button w-full bg-black text-white hover:bg-primary py-8 rounded-none transition-all"
                  disabled={isPaymentStart}
                >
                  {isPaymentStart
                    ? "UNVEILING PAYMENT GATEWAY..."
                    : "CHECKOUT WITH RAZORPAY"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
