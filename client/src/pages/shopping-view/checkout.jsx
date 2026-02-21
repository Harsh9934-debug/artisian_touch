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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Address */}
        <div className="flex-1">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6 lg:pl-8 lg:border-l">
          <h2 className="text-xl font-bold border-b pb-4">Your Order</h2>
          <div className="flex flex-col gap-4">
            {cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId || item.id} cartItem={item} />
              ))
              : <p className="text-gray-500">Your cart is empty.</p>}
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex justify-between border-t pt-4">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="w-full mt-2">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full h-12">
              {isPaymentStart
                ? "Processing Payment..."
                : "Checkout with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
