import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Paintbrush,
  Pencil,
  Palette,
  ChevronLeftIcon,
  ChevronRightIcon,
  Scissors,
  Sparkles,
  Brush,
  Ruler,
  Layers,
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

const categoriesWithIcon = [
  { id: "painting", label: "Painting", icon: Paintbrush },
  { id: "drawing", label: "Drawing", icon: Pencil },
  { id: "sculpting", label: "Sculpting", icon: Layers },
  { id: "canvas", label: "Canvas", icon: Palette },
  { id: "paper", label: "Paper & Journals", icon: Ruler },
  { id: "calligraphy", label: "Calligraphy", icon: Brush },
  { id: "embroidery", label: "Embroidery", icon: Scissors },
  { id: "knitting", label: "Knitting", icon: Sparkles },
  { id: "markers", label: "Markers", icon: Pencil },
  { id: "accessories", label: "Accessories", icon: Palette },
];


function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);



  const { user } = useSelector((state) => state.auth);

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
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
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

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-4 bg-white border-b sticky top-[64px] z-30 shadow-sm overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex flex-nowrap gap-8 pb-2">
            {categoriesWithIcon.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-primary/10 group-hover:shadow-md transition-all duration-300">
                  <categoryItem.icon className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-primary transition-colors whitespace-nowrap">
                  {categoryItem.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              loading={index === 0 ? "eager" : "lazy"}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
          : null}
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>




      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                <ShoppingProductTile
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : null}
          </div>
        </div>
      </section>

    </div>
  );
}

export default ShoppingHome;
