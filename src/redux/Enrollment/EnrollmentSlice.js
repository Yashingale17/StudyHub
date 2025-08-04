import { createSlice } from "@reduxjs/toolkit";

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState: {
    userEnrollments: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchEnrollmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchEnrollmentsSuccess(state, action) {
      state.loading = false;
      state.userEnrollments = action.payload;
    },
    fetchEnrollmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEnrollmentsStart,
  fetchEnrollmentsSuccess,
  fetchEnrollmentsFailure,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
