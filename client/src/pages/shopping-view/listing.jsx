import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, FilterIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@clerk/clerk-react";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, hasMore } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useUser();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    setPage(1); // Reset page on filter change
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }



  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
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
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: { ...filters, page }, sortParams: sort })
      );
  }, [dispatch, sort, filters, page]);

  useEffect(() => {
    let currentTarget = null;
    let observer = null;

    if (observerTarget.current) {
      currentTarget = observerTarget.current;
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget && observer) {
        observer.unobserve(currentTarget);
      }
    };
  }, [observerTarget, productList]);

  console.log(productList, "productListproductListproductList");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12 px-6 md:px-12 py-12">
        <aside className="hidden md:block">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </aside>
        <main className="w-full">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-3xl font-serif font-normal text-[#1a1c24] mb-2">Our Collection</h2>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Showing {productList?.length || 0} exquisite pieces
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden flex items-center gap-2 text-[11px] uppercase tracking-widest hover:bg-transparent hover:text-primary transition-colors px-0"
                  >
                    <FilterIcon className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <ProductFilter filters={filters} handleFilter={handleFilter} />
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-[11px] uppercase tracking-widest hover:bg-transparent hover:text-primary transition-colors"
                  >
                    <ArrowUpDownIcon className="h-3 w-3" />
                    <span>Sort Collections</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] rounded-none border-gray-100 shadow-xl">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                        className="text-[11px] uppercase tracking-wider py-3 focus:bg-gray-50 cursor-pointer"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id || productItem.id}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : <div className="col-span-full text-center py-32 border border-dashed border-gray-100">
                <p className="text-gray-400 font-serif italic mb-2">No pieces found in this selection.</p>
                <Button onClick={() => setFilters({})} variant="link" className="text-black uppercase tracking-widest text-[10px]">Clear all filters</Button>
              </div>}
          </div>

          {productList && productList.length > 0 && hasMore && (
            <div ref={observerTarget} className="flex justify-center mt-20 mb-8 w-full h-10">
              <span className="text-gray-400 font-serif italic text-sm animate-pulse">Unveiling more pieces...</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ShoppingListing;
