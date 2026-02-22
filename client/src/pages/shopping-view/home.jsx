import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBag,
  ArrowRight,
  Star,
  Award,
  Hand,
  Leaf,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useUser } from "@clerk/clerk-react";
import { Testimonials } from "@/components/ui/unique-testimonial";

const categoriesWithImages = [
  { id: "painting", label: "Painting", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2070&auto=format&fit=crop" },
  { id: "drawing", label: "Drawing", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2070&auto=format&fit=crop" },
  { id: "sculpting", label: "Sculpting", image: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?q=80&w=2070&auto=format&fit=crop" },
  { id: "canvas", label: "Canvas", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2070&auto=format&fit=crop" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const { user } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % (featureImageList?.length || 1));
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <div
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute inset-0 transition-opacity duration-1000`}
            >
              <img
                src={slide?.image}
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center px-6">
                <div className="max-w-4xl">
                  <span className="text-white uppercase tracking-[0.3em] text-sm mb-4 block animate-fade-in">
                    The Artist's Studio
                  </span>
                  <h1 className="text-5xl md:text-8xl text-white font-normal mb-8 leading-tight">
                    Artisan Touch <br /> Supplies
                  </h1>
                  <Button
                    onClick={() => navigate("/shop/listing")}
                    className="luxury-button bg-primary text-white hover:bg-white hover:text-black"
                  >
                    Explore Supplies
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-[#1a1c24] flex items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <span className="text-white uppercase tracking-[0.3em] text-sm mb-4 block animate-fade-in">
                The Artist's Studio
              </span>
              <h1 className="text-5xl md:text-8xl text-white font-normal mb-8 leading-tight">
                Artisan Touch <br /> Supplies
              </h1>
              <Button
                onClick={() => navigate("/shop/listing")}
                className="luxury-button bg-primary text-white hover:bg-white hover:text-black"
              >
                Explore Supplies
              </Button>
            </div>
          </div>
        )}

        <div className="absolute bottom-10 left-10 flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) =>
                  (prevSlide - 1 + featureImageList.length) %
                  featureImageList.length
              )
            }
            className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) => (prevSlide + 1) % featureImageList.length
              )
            }
            className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl mb-4 font-normal">Our Collection</h2>
              <p className="text-muted-foreground">Premium tools and mediums for the modern artisan</p>
            </div>
            <Button variant="link" className="text-black p-0 flex items-center gap-2 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesWithImages.map((category) => (
              <div
                key={category.id}
                onClick={() => handleNavigateToListingPage(category, "category")}
                className="group relative h-[450px] overflow-hidden cursor-pointer rounded-[2.5rem]"
              >
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-2xl mb-2">{category.label}</h3>
                  <span className="text-xs uppercase tracking-widest border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 px-6 md:px-12 bg-[#FAF9F6]">
        <div className="max-w-[1400px] mx-auto bg-[#D6BC9F] rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-stretch min-h-[600px] shadow-xl">
          {/* Image Column - Left */}
          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?q=80&w=2070&auto=format&fit=crop"
              alt="Artisan at work"
              className="absolute inset-0 w-full h-full object-cover p-12 rounded-[4rem]"
            />
          </div>

          {/* Text Column - Right */}
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center bg-[#D6BC9F]">
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight font-serif text-[#1a1c24]">
              Where Heritage <br /> Meets The Heart
            </h2>
            <p className="text-lg text-[#1a1c24]/80 leading-relaxed mb-12 font-light">
              Rooted in centuries of tradition, our tools are more than just supplies—they are a bridge between ancient artistic ethics and the grace of the modern creator. Every brush, pigment, and canvas is a testament to generations of artistry.
            </p>

            <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-black/10 rounded-full flex items-center justify-center">
                  <Award className="w-7 h-7 text-[#1a1c24]" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1c24]">Quality <br /> Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-black/10 rounded-full flex items-center justify-center">
                  <Hand className="w-7 h-7 text-[#1a1c24]" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1c24]">Artisan <br /> Handcrafted</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-black/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-[#1a1c24]" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1c24]">Ethically <br /> Sourced</span>
              </div>
            </div>

            <Button variant="link" className="text-black p-0 flex items-center gap-2 justify-start group underline underline-offset-8 decoration-black/20 hover:decoration-black transition-all">
              Read full story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-5xl mb-16 text-center">Featured Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productList && productList.length > 0
              ? productList.slice(0, 4).map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id || productItem.id}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : null}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}

export default ShoppingHome;
