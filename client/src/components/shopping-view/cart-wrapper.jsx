import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-white border-none shadow-2xl">
      <SheetHeader className="border-b pb-6">
        <SheetTitle className="text-2xl font-serif font-normal text-[#1a1c24] mt-4">Shopping Bag</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-6 overflow-y-auto max-h-[60vh] pr-2">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent key={item.productId || item.id} cartItem={item} />)
          : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground font-serif italic mb-4">Your bag is currently empty</p>
              <Button onClick={() => setOpenCartSheet(false)} variant="link" className="text-black uppercase tracking-widest text-[10px]">Continue Shopping</Button>
            </div>
          )}
      </div>
      <div className="mt-auto pt-8 border-t space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
          <span className="text-xl font-normal text-[#1a1c24]">₹{totalCartAmount}</span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mt-2">Shipping and taxes calculated at checkout</p>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="luxury-button w-full bg-black text-white hover:bg-primary"
        >
          Secure Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
