import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "@/config/api";

const initialState = {
    wishlistItems: [],
    isLoading: false,
};

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async ({ userId, productId }) => {
        const response = await axios.post(
            `${API_URL}/api/shop/wishlist/add`,
            {
                userId,
                productId,
            }
        );

        return response.data;
    }
);

export const fetchWishlistItems = createAsyncThunk(
    "wishlist/fetchWishlistItems",
    async (userId) => {
        const response = await axios.get(
            `${API_URL}/api/shop/wishlist/get/${userId}`
        );

        return response.data;
    }
);

export const deleteWishlistItem = createAsyncThunk(
    "wishlist/deleteWishlistItem",
    async ({ userId, productId }) => {
        const response = await axios.delete(
            `${API_URL}/api/shop/wishlist/${userId}/${productId}`
        );

        return response.data;
    }
);

const shopWishlistSlice = createSlice({
    name: "shopWishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload.data.items;
            })
            .addCase(addToWishlist.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchWishlistItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchWishlistItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload.data.items;
            })
            .addCase(fetchWishlistItems.rejected, (state) => {
                state.isLoading = false;
                state.wishlistItems = [];
            })
            .addCase(deleteWishlistItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteWishlistItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload.data.items;
            })
            .addCase(deleteWishlistItem.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default shopWishlistSlice.reducer;
