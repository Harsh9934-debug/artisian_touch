require("dotenv").config();
const mongoose = require("mongoose");
const Feature = require("./models/Feature");

// Art & Craft themed banner images
const bannerImages = [
    {
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&h=600&fit=crop",
    },
    {
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&h=600&fit=crop",
    },
    {
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&h=600&fit=crop",
    },
];

async function seedBanners() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing banners
        await Feature.deleteMany({});
        console.log("🗑️  Cleared existing banners");

        // Insert new art-themed banners
        const insertedBanners = await Feature.insertMany(bannerImages);
        console.log(`✅ Successfully added ${insertedBanners.length} banner images!`);

        console.log("\n📸 Banners Added:");
        insertedBanners.forEach((banner, index) => {
            console.log(`${index + 1}. ${banner.image}`);
        });

        console.log("\n🎉 Banner seeding completed successfully!");

    } catch (error) {
        console.error("❌ Error seeding banners:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

seedBanners();
