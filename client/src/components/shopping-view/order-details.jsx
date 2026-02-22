import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useUser();

  return (
    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl">
      <div className="grid grid-cols-1">
        <div className="bg-[#FAF9F6] p-8 border-b border-gray-100 mt-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] text-primary uppercase tracking-[0.3em] font-semibold mb-2 block">Order Statement</span>
              <h2 className="text-2xl font-serif font-normal text-[#1a1c24]">{orderDetails?._id}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Placed on</p>
              <p className="text-sm font-light">{orderDetails?.orderDate.split("T")[0]}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold border-b border-gray-50 pb-2">Acquisition Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-light">Price</span>
                  <span className="text-[#1a1c24]">₹{orderDetails?.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-light">Method</span>
                  <span className="text-[#1a1c24] uppercase tracking-wider text-[10px]">{orderDetails?.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-light">Payment</span>
                  <span className="text-[#1a1c24] uppercase tracking-wider text-[10px]">{orderDetails?.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400 font-light">Status</span>
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 ${orderDetails?.orderStatus === "confirmed" ? "bg-green-50 text-green-700" :
                      orderDetails?.orderStatus === "rejected" ? "bg-red-50 text-red-700" :
                        "bg-gray-50 text-gray-700"
                    }`}>
                    {orderDetails?.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold border-b border-gray-50 pb-2">Delivery Destination</h3>
              <div className="space-y-1 text-sm font-light text-gray-500 italic">
                <p className="text-[#1a1c24] not-italic font-medium mb-1">{user.userName}</p>
                <p>{orderDetails?.addressInfo?.address}</p>
                <p>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</p>
                <p className="not-italic mt-2 text-[10px] uppercase tracking-widest">{orderDetails?.addressInfo?.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold border-b border-gray-50 pb-2">Selected Pieces</h3>
            <ul className="space-y-6">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-serif text-[#1a1c24] group-hover:text-primary transition-colors">{item.title}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-normal">₹{item.price}</span>
                  </li>
                ))
                : null}
            </ul>
          </div>
        </div>

        <div className="p-8 bg-[#FAF9F6] text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Thank you for choosing Artisan Touch</p>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
