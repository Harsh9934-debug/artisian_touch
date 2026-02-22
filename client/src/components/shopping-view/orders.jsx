import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useUser();
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");

  return (
    <div className="bg-white">
      <div className="mb-12 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-serif font-normal text-[#1a1c24]">Order History</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Order Reference</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Date</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Value</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                <TableRow key={orderItem?._id} className="group border-gray-50 hover:bg-[#FAF9F6] transition-colors">
                  <TableCell className="font-light text-xs text-gray-500">{orderItem?._id}</TableCell>
                  <TableCell className="font-light text-xs">{orderItem?.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <span
                      className={`text-[9px] uppercase tracking-widest py-1 px-3 rounded-none ${orderItem?.orderStatus === "confirmed"
                        ? "bg-green-50 text-green-700"
                        : orderItem?.orderStatus === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {orderItem?.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-xs">₹{orderItem?.totalAmount}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="text-[10px] uppercase tracking-[0.2em] text-primary hover:text-black transition-colors font-semibold"
                      >
                        Review details
                      </button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 italic text-gray-400 font-serif">
                    No orders found in your history.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ShoppingOrders;
