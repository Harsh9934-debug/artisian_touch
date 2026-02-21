import { Outlet } from "react-router-dom";
import { ImageSlider } from "../ui/image-slider";
import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1565191999001-551c187427bb?w=900&auto=format&fit=crop&q=60", // Pottery
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&auto=format&fit=crop&q=60", // Sketching/Art supplies
  "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=900&auto=format&fit=crop&q=60", // Painting/Abstract
  "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&auto=format&fit=crop&q=60", // Crafting/Tools
];

function AuthLayout() {
  return (
    <div className="w-full h-screen min-h-[700px] flex items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-5xl h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left side: Image Slider */}
        <div className="hidden lg:block relative">
          <ImageSlider images={images} interval={4000} />
          {/* Optional Overlay Text */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none flex flex-col justify-end p-12 text-white">
            <h2 className="text-3xl font-bold mb-2">Artisan Touch</h2>
            <p className="text-white/80">Discover unique handcrafted tools and materials.</p>
          </div>
        </div>

        {/* Right side: Auth Content */}
        <div className="w-full h-full bg-card text-card-foreground flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md flex flex-col items-center">
            <Outlet />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;

