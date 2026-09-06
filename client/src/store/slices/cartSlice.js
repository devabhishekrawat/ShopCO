import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../../services/cartService";
import { validateCoupon } from "../../services/couponService";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity, size }, { rejectWithValue }) => {
    try {
      const data = await addToCart(productId, quantity, size);
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const changeCartQuantity = createAsyncThunk(
  "cart/changeCartQuantity",
  async ({ productId, quantity, size, itemId }, { rejectWithValue }) => {
    try {
      const data = await updateCartItemQuantity(
        productId,
        quantity,
        size,
        itemId
      );
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId, size, itemId }, { rejectWithValue }) => {
    try {
      const data = await removeCartItem(productId, size, itemId);
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const resetCart = createAsyncThunk(
  "cart/resetCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCart();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const applyCouponCode = createAsyncThunk(
  "cart/applyCouponCode",
  async (code, { rejectWithValue }) => {
    try {
      const data = await validateCoupon(code);
      return data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid coupon"
      );
    }
  }
);

const initialState = {
  cart: null,
  appliedCoupon: null,
  loading: false,
  error: null,
  couponError: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponError = null;
    },
    clearCartError: (state) => {
      state.error = null;
      state.couponError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeCartQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(resetCart.fulfilled, (state) => {
        if (state.cart) {
          state.cart.products = [];
        }
        state.appliedCoupon = null;
      })
      .addCase(applyCouponCode.pending, (state) => {
        state.couponError = null;
      })
      .addCase(applyCouponCode.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload;
        state.couponError = null;
      })
      .addCase(applyCouponCode.rejected, (state, action) => {
        state.couponError = action.payload;
      });
  },
});

export const { removeAppliedCoupon, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
