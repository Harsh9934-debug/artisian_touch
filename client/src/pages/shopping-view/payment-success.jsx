import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="bg-[#FAF9F6] p-12 md:p-20 max-w-2xl w-full border border-gray-100 shadow-sm transition-all hover:shadow-xl">
        <div className="mb-10 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#1a1c24] mb-6">Acquisition Confirmed</h1>
        <p className="text-sm text-gray-500 font-light leading-relaxed mb-12 italic">
          "Your selection has been secured. Our artisans are now preparing your piece with the utmost care and precision."
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            className="luxury-button bg-black text-white hover:bg-primary px-10 py-6 rounded-none transition-all"
            onClick={() => navigate("/shop/account")}
          >
            REVIEW ACQUISITIONS
          </Button>
          <Button
            variant="outline"
            className="rounded-none border-gray-200 text-[10px] uppercase tracking-widest px-10 py-6 hover:bg-gray-50 transition-all font-semibold"
            onClick={() => navigate("/shop/home")}
          >
            CONTINUE EXPLORING
          </Button>
        </div>
        <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-widest">
          Order reference details have been sent to your registered email
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
