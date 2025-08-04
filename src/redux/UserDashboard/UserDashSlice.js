import { createSlice } from '@reduxjs/toolkit';
import { fetchUserEnrollments , fetchUserProfile} from './UserDashAction';

const initialState = {
  enrollments: null,
  counts: { 
    enrolled: 0,
    active: 0,
    completed: 0
  },
  loading: false,
  error: null,
  userProfile: null,
};

const userDashSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
        state.counts.enrolled = action.payload.enrollmentCount?.enrolled || 0;
        state.counts.active = action.payload.enrollmentCount?.active || 0;
        state.counts.completed = action.payload.enrollmentCount?.completed || 0;
      })
      .addCase(fetchUserEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load dashboard';
      })

      
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load user profile';
      });
  }
});

export default userDashSlice.reducer;