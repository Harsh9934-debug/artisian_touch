import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/artisan_account_header.png";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img
          src={accImg}
          alt="Luxury Jewelry Account"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-[3000ms] hover:scale-100"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white font-normal tracking-tight">Your Portfolio</h1>
        </div>
      </div>
      <div className="container mx-auto px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start rounded-none h-auto p-0 mb-12 gap-12">
              <TabsTrigger
                value="orders"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs uppercase tracking-[0.2em] font-semibold pb-4 transition-all px-0"
              >
                Acquisitions
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs uppercase tracking-[0.2em] font-semibold pb-4 transition-all px-0"
              >
                Destinations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-0 outline-none">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-0 outline-none">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
