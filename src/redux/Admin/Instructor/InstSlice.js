// redux/Admin/Slices/DashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchInstructorDetails } from './InstAction';

const initialState = {
  instructors: [],
  instructorDetails: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    resetDashboardState: (state) => {
      state.error = null;
      state.loading = false;
    },
    clearInstructorDetails: (state) => {
      state.instructorDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all instructors
      .addCase(fetchAllInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchAllInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch instructors';
      })

      // Fetch instructor details
      .addCase(fetchInstructorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorDetails = action.payload;
      })
      .addCase(fetchInstructorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch instructor details';
      })

      // Soft delete (toggle status)
      .addCase(softDeleteInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteInstructor.fulfilled, (state, action) => {
        state.loading = false;
        const updatedInstructor = action.payload;
        state.instructors = state.instructors.map(inst =>
          inst.id === updatedInstructor.id ? updatedInstructor : inst
        );
        // Also update in details if it's the same instructor
        if (state.instructorDetails?.id === updatedInstructor.id) {
          state.instructorDetails = updatedInstructor;
        }
      })
      .addCase(softDeleteInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update instructor status';
      })

      .addCase(deleteInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = state.instructors.filter(
          inst => inst.id !== action.payload
        );
      })
      .addCase(deleteInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete instructor';
      });
  },
});

export default dashboardSlice.reducer;