const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product");

const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            // Create new wishlist if none exists
            wishlist = new Wishlist({
                userId,
                items: [{ productId }],
            });
            await wishlist.save();

            await wishlist.populate({
                path: "items.productId",
                select: "image title price salePrice totalStock",
            });

            const populateWishlistItems = wishlist.items.map((item) => ({
                productId: item.productId ? item.productId._id : null,
                image: item.productId ? item.productId.image : null,
                title: item.productId ? item.productId.title : "Product not found",
                price: item.productId ? item.productId.price : null,
                salePrice: item.productId ? item.productId.salePrice : null,
                totalStock: item.productId ? item.productId.totalStock : null,
            }));

            return res.status(200).json({
                success: true,
                data: {
                    ...wishlist._doc,
                    items: populateWishlistItems.filter(item => item.productId !== null),
                },
            });
        }

        // Check if product is already in wishlist
        const findCurrentItemIndex = wishlist.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (findCurrentItemIndex === -1) {
            wishlist.items.push({ productId });
            await wishlist.save();

            await wishlist.populate({
                path: "items.productId",
                select: "image title price salePrice totalStock",
            });

            const populateWishlistItems = wishlist.items.map((item) => ({
                productId: item.productId ? item.productId._id : null,
                image: item.productId ? item.productId.image : null,
                title: item.productId ? item.productId.title : "Product not found",
                price: item.productId ? item.productId.price : null,
                salePrice: item.productId ? item.productId.salePrice : null,
                totalStock: item.productId ? item.productId.totalStock : null,
            }));

            return res.status(200).json({
                success: true,
                data: {
                    ...wishlist._doc,
                    items: populateWishlistItems.filter(item => item.productId !== null),
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Item already in wishlist",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching",
        });
    }
};

const fetchWishlistItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const wishlist = await Wishlist.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice totalStock",
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        // Filter out items where the product might have been deleted from DB
        const validItems = wishlist.items.filter(
            (productItem) => productItem.productId
        );

        if (validItems.length < wishlist.items.length) {
            wishlist.items = validItems;
            await wishlist.save();
        }

        const populateWishlistItems = validItems.map((item) => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            totalStock: item.productId.totalStock,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...wishlist._doc,
                items: populateWishlistItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching",
        });
    }
};

const deleteWishlistItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided",
            });
        }

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.items = wishlist.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await wishlist.save();

        await wishlist.populate({
            path: "items.productId",
            select: "image title price salePrice totalStock",
        });

        const populateWishlistItems = wishlist.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            totalStock: item.productId ? item.productId.totalStock : null,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...wishlist._doc,
                items: populateWishlistItems.filter(item => item.productId !== null),
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching",
        });
    }
};

module.exports = {
    addToWishlist,
    fetchWishlistItems,
    deleteWishlistItem,
};
