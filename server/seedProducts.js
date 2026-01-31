require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Art and Craft Products Data
const artCraftProducts = [
    {
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
        title: "Professional Acrylic Paint Set - 24 Colors",
        description: "Premium quality acrylic paint set with 24 vibrant colors. Perfect for canvas painting, crafts, and DIY projects. Non-toxic and quick-drying formula suitable for all skill levels.",
        category: "painting",
        brand: "ArtMaster",
        price: 45.99,
        salePrice: 35.99,
        totalStock: 50,
        averageReview: 4.5
    },
    {
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500",
        title: "Watercolor Paint Set with Brushes",
        description: "36 vibrant watercolor paints with 6 premium brushes. Includes mixing palette and water brush pen. Ideal for beginners and professional artists.",
        category: "painting",
        brand: "ColorFlow",
        price: 32.99,
        salePrice: 24.99,
        totalStock: 75,
        averageReview: 4.7
    },
    {
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
        title: "Artist Sketch Pencil Set - 29 Pieces",
        description: "Complete sketching set with graphite pencils, charcoal pencils, erasers, and blending stumps. Comes in a portable zippered case.",
        category: "drawing",
        brand: "SketchPro",
        price: 28.99,
        salePrice: 21.99,
        totalStock: 100,
        averageReview: 4.8
    },
    {
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
        title: "Premium Canvas Panels - Pack of 12",
        description: "12x16 inch stretched canvas panels, triple-primed and ready to paint. Acid-free, 100% cotton canvas suitable for acrylic and oil painting.",
        category: "canvas",
        brand: "CanvasCraft",
        price: 38.99,
        salePrice: 29.99,
        totalStock: 60,
        averageReview: 4.6
    },
    {
        image: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=500",
        title: "Polymer Clay Starter Kit - 50 Colors",
        description: "50 vibrant colors of polymer clay with sculpting tools and accessories. Perfect for jewelry making, miniatures, and craft projects. Oven-bake clay.",
        category: "sculpting",
        brand: "ClayMaster",
        price: 42.99,
        salePrice: 34.99,
        totalStock: 45,
        averageReview: 4.5
    },
    {
        image: "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=500",
        title: "Calligraphy Pen Set with Ink",
        description: "Professional calligraphy set with 5 nibs, pen holder, and 6 vibrant inks. Includes practice sheets and instruction guide for beginners.",
        category: "calligraphy",
        brand: "WriteArt",
        price: 26.99,
        salePrice: 19.99,
        totalStock: 80,
        averageReview: 4.4
    },
    {
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500",
        title: "Embroidery Starter Kit - Complete Set",
        description: "Everything you need to start embroidery: 50 color threads, hoops, needles, fabric, and patterns. Perfect for beginners and hobbyists.",
        category: "embroidery",
        brand: "ThreadCraft",
        price: 34.99,
        salePrice: 27.99,
        totalStock: 55,
        averageReview: 4.6
    },
    {
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500",
        title: "Oil Painting Brush Set - 15 Pieces",
        description: "Professional quality oil painting brushes with natural and synthetic bristles. Various sizes and shapes for different techniques. Durable wooden handles.",
        category: "painting",
        brand: "BrushMaster",
        price: 39.99,
        salePrice: 31.99,
        totalStock: 70,
        averageReview: 4.7
    },
    {
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
        title: "Mixed Media Art Journal - A4 Size",
        description: "200-page hardbound art journal with thick mixed media paper. Suitable for watercolor, acrylic, ink, and collage. Lay-flat binding.",
        category: "paper",
        brand: "JournalPro",
        price: 24.99,
        salePrice: 18.99,
        totalStock: 90,
        averageReview: 4.5
    },
    {
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
        title: "Colored Pencil Set - 72 Premium Colors",
        description: "Professional grade colored pencils with soft, blendable cores. Vibrant pigments and smooth application. Includes tin storage case.",
        category: "drawing",
        brand: "ColorPro",
        price: 49.99,
        salePrice: 39.99,
        totalStock: 65,
        averageReview: 4.8
    },
    {
        image: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=500",
        title: "Air Dry Clay - 5 lbs White",
        description: "Premium air-dry modeling clay that doesn't require baking. Smooth texture, easy to mold, and dries hard. Perfect for sculptures and crafts.",
        category: "sculpting",
        brand: "ClayWorks",
        price: 22.99,
        salePrice: 17.99,
        totalStock: 85,
        averageReview: 4.4
    },
    {
        image: "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=500",
        title: "Alcohol Markers Set - 80 Colors",
        description: "Dual-tip alcohol-based markers with brush and chisel tips. Vibrant, blendable colors perfect for illustration, manga, and design work.",
        category: "markers",
        brand: "MarkerArt",
        price: 56.99,
        salePrice: 44.99,
        totalStock: 40,
        averageReview: 4.7
    },
    {
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500",
        title: "Knitting Needles Set with Yarn",
        description: "Complete knitting set with bamboo needles in 5 sizes, stitch markers, and 10 skeins of premium yarn in assorted colors.",
        category: "knitting",
        brand: "KnitCraft",
        price: 44.99,
        salePrice: 36.99,
        totalStock: 50,
        averageReview: 4.6
    },
    {
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500",
        title: "Gouache Paint Set - 18 Colors",
        description: "Professional gouache paint set with rich, opaque colors. Perfect for illustration and design. Includes white and black for mixing.",
        category: "painting",
        brand: "GouachePro",
        price: 37.99,
        salePrice: 29.99,
        totalStock: 55,
        averageReview: 4.5
    },
    {
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
        title: "Easel Stand - Adjustable Wooden",
        description: "Sturdy wooden easel with adjustable height and angle. Folds flat for easy storage. Suitable for canvas up to 32 inches.",
        category: "accessories",
        brand: "StudioPro",
        price: 68.99,
        salePrice: 54.99,
        totalStock: 30,
        averageReview: 4.7
    },
    {
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
        title: "Charcoal Drawing Set - Complete Kit",
        description: "Professional charcoal set with compressed charcoal, vine charcoal, white charcoal, and blending tools. Includes sketch pad.",
        category: "drawing",
        brand: "CharcoalArt",
        price: 31.99,
        salePrice: 24.99,
        totalStock: 75,
        averageReview: 4.6
    },
    {
        image: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=500",
        title: "Resin Casting Kit - Epoxy Resin",
        description: "Crystal clear epoxy resin kit for jewelry, coasters, and art projects. Includes resin, hardener, molds, and mixing tools.",
        category: "resin",
        brand: "ResinCraft",
        price: 52.99,
        salePrice: 42.99,
        totalStock: 35,
        averageReview: 4.5
    },
    {
        image: "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=500",
        title: "Origami Paper Set - 500 Sheets",
        description: "500 sheets of colorful origami paper in various sizes and patterns. Includes instruction booklet with 20 projects.",
        category: "paper",
        brand: "OrigamiPro",
        price: 18.99,
        salePrice: 14.99,
        totalStock: 100,
        averageReview: 4.4
    },
    {
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500",
        title: "Macrame Cord Kit - 8 Colors",
        description: "Premium cotton macrame cord in 8 beautiful colors. Includes wooden rings, beads, and pattern guide. Perfect for wall hangings and plant hangers.",
        category: "macrame",
        brand: "MacrameCraft",
        price: 36.99,
        salePrice: 28.99,
        totalStock: 60,
        averageReview: 4.7
    },
    {
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500",
        title: "Palette Knife Set - 5 Pieces",
        description: "Professional stainless steel palette knives in various shapes. Perfect for oil and acrylic painting, mixing colors, and creating texture.",
        category: "accessories",
        brand: "KnifeMaster",
        price: 21.99,
        salePrice: 16.99,
        totalStock: 95,
        averageReview: 4.5
    }
];

// Connect to MongoDB and seed products
async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing products (optional - comment out if you want to keep existing products)
        // await Product.deleteMany({});
        // console.log("🗑️  Cleared existing products");

        // Insert art and craft products
        const insertedProducts = await Product.insertMany(artCraftProducts);
        console.log(`✅ Successfully added ${insertedProducts.length} art and craft products!`);

        // Display summary
        console.log("\n📦 Products Added:");
        insertedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title} - ₹${product.salePrice} (${product.category})`);
        });

        console.log("\n🎉 Database seeding completed successfully!");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

// Run the seed function
seedProducts();
