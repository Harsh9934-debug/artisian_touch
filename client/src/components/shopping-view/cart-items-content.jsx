import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useUser();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-6 pb-6 border-b border-gray-50 last:border-none">
      <div className="relative w-24 h-32 bg-[#FAF9F6] shrink-0">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-full h-full object-cover rounded-none"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between h-32 py-1">
        <div>
          <h3 className="text-sm font-normal text-[#1a1c24] font-serif leading-tight mb-2 uppercase tracking-wide">
            {cartItem?.title}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center border border-gray-200">
              <button
                disabled={cartItem?.quantity === 1}
                onClick={() => handleUpdateQuantity(cartItem, "minus")}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
              >
                <Minus className="w-3 h-3 text-gray-500" />
              </button>
              <span className="w-8 text-center text-[10px] font-medium">{cartItem?.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(cartItem, "plus")}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-sm font-medium text-[#1a1c24]">
            ₹
            {(
              (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
              cartItem?.quantity
            ).toFixed(2)}
          </p>
          <button
            onClick={() => handleCartItemDelete(cartItem)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
