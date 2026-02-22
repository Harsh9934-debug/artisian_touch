import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 rounded-none border ${selectedId?._id === addressInfo?._id
          ? "border-primary shadow-lg bg-[#FAF9F6]"
          : "border-gray-100 hover:border-gray-300 bg-white"
        }`}
    >
      <CardContent className="grid p-6 gap-2">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Shipping Address</span>
          {selectedId?._id === addressInfo?._id && (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-sm font-normal text-[#1a1c24] font-serif">{addressInfo?.address}</p>
        <p className="text-xs text-gray-500 font-light italic">{addressInfo?.city}, {addressInfo?.pincode}</p>
        <p className="text-xs text-gray-400 font-light mt-2 tracking-wide">{addressInfo?.phone}</p>
        {addressInfo?.notes && (
          <p className="text-[10px] text-gray-400 mt-2 border-t pt-2 italic">Note: {addressInfo?.notes}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); handleEditAddress(addressInfo); }}
          className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addressInfo); }}
          className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
