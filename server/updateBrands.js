require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Brand name mapping (lowercase IDs to display names)
const brandMapping = {
    "ArtMaster": "artmaster",
    "ColorFlow": "colorflow",
    "SketchPro": "sketchpro",
    "CanvasCraft": "canvascraft",
    "ClayMaster": "claymaster",
    "WriteArt": "writeart",
    "ThreadCraft": "threadcraft",
    "BrushMaster": "brushmaster",
    "JournalPro": "journalpro",
    "ColorPro": "colorpro",
    "ClayWorks": "clayworks",
    "MarkerArt": "markerart",
    "KnitCraft": "knitcraft",
    "GouachePro": "gouachepro",
    "StudioPro": "studiopro",
    "CharcoalArt": "charcoalart",
    "ResinCraft": "resincraft",
    "OrigamiPro": "origamipro",
    "MacrameCraft": "macramecrft",
    "KnifeMaster": "knifemaster"
};

async function updateBrands() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Update all products with new brand IDs
        for (const [oldBrand, newBrand] of Object.entries(brandMapping)) {
            const result = await Product.updateMany(
                { brand: oldBrand },
                { $set: { brand: newBrand } }
            );
            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} products from "${oldBrand}" to "${newBrand}"`);
            }
        }

        console.log("\n🎉 Brand update completed successfully!");

    } catch (error) {
        console.error("❌ Error updating brands:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
}

updateBrands();
