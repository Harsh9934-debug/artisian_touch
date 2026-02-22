export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "combobox",
    options: [
      { id: "painting", label: "Painting" },
      { id: "drawing", label: "Drawing" },
      { id: "sculpting", label: "Sculpting" },
      { id: "canvas", label: "Canvas" },
      { id: "calligraphy", label: "Calligraphy" },
      { id: "embroidery", label: "Embroidery" },
      { id: "paper", label: "Paper" },
      { id: "markers", label: "Markers" },
      { id: "knitting", label: "Knitting" },
      { id: "accessories", label: "Accessories" },
      { id: "resin", label: "Resin" },
      { id: "macrame", label: "Macrame" },
    ],
  },

  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "All Supplies",
    path: "/shop/listing",
  },
  {
    id: "painting",
    label: "Painting",
    path: "/shop/listing",
  },
  {
    id: "drawing",
    label: "Drawing",
    path: "/shop/listing",
  },
  {
    id: "sculpting",
    label: "Sculpting",
    path: "/shop/listing",
  },
  {
    id: "canvas",
    label: "Canvas",
    path: "/shop/listing",
  },
  {
    id: "more",
    label: "Explore More",
    path: "/shop/listing",
  },
];

export const categoryOptionsMap = {
  painting: "Painting",
  drawing: "Drawing",
  sculpting: "Sculpting",
  canvas: "Canvas",
  calligraphy: "Calligraphy",
  embroidery: "Embroidery",
  paper: "Paper",
  markers: "Markers",
  knitting: "Knitting",
  accessories: "Accessories",
  resin: "Resin",
  macrame: "Macrame",
};



export const filterOptions = {
  category: [
    { id: "painting", label: "Painting" },
    { id: "drawing", label: "Drawing" },
    { id: "sculpting", label: "Sculpting" },
    { id: "canvas", label: "Canvas" },
    { id: "calligraphy", label: "Calligraphy" },
    { id: "embroidery", label: "Embroidery" },
    { id: "paper", label: "Paper" },
    { id: "markers", label: "Markers" },
    { id: "knitting", label: "Knitting" },
    { id: "accessories", label: "Accessories" },
    { id: "resin", label: "Resin" },
    { id: "macrame", label: "Macrame" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
