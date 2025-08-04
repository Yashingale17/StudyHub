import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllUsers,
  fetchUserDetails,
  deleteUser,
  updateUserStatus,
  fetchUserEnrolledCourses  // Add this import
} from './UserAdminAction';  // Make sure this matches your file name

const initialState = {
  users: [],
  enrolledCourses: [],
  userDetails: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add this new case for updateUserStatus
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload; // This should be the full user object

        // Update in users array
        state.users = state.users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );

        // Update in userDetails if it's the same user
        if (state.userDetails?.id === updatedUser.id) {
          state.userDetails = updatedUser;
        }

        state.success = true;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch enrolled courses by user ID
      .addCase(fetchUserEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchUserEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  },
});


export const { resetUserState, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;