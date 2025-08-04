import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,

    subTotal: 0,
    grandTotal: 0,
    totalPriceLoading: false,
    totalPriceError: null,
  },
  reducers: {
    // Cart fetching
    fetchCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Total price fetching
    fetchTotalPriceRequest: (state) => {
      state.totalPriceLoading = true;
      state.totalPriceError = null;
    },
    fetchTotalPriceSuccess: (state, action) => {
      state.totalPriceLoading = false;
      state.subTotal = action.payload.subtotal;
      state.grandTotal = action.payload.grandTotal;
    },
    fetchTotalPriceFailure: (state, action) => {
      state.totalPriceLoading = false;
      state.totalPriceError = action.payload;
    },
  },
});

export const {
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  fetchTotalPriceRequest,
  fetchTotalPriceSuccess,
  fetchTotalPriceFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
