import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats, fetchFiveUsers, fetchAllInstructors, fetchAllCategories, createCourse, fetchInstructorById, fetchCoursesByInstructor, updateInstructor, reactiveInstructor } from "./Actions/DashboardActions";
import { toast } from "react-toastify";


const dashboardSlice = createSlice({
  name: "adminDashboard",

  initialState: {
    stats: null,
    loading: false,
    users: [],
    instructors: [],
    categories: [],
    courses: [],
    currentInstructor: null,
    instructorCourses: [],
    error: null,
  },


  reducers: {
    clearCurrentInstructor: (state) => {
      state.currentInstructor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFiveUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchFiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllInstructors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchAllInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.courses) state.courses = [];
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchInstructorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInstructor = action.payload;
      })
      .addCase(fetchInstructorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCoursesByInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorCourses = action.payload; // ✅ storing separately
      })
      .addCase(fetchCoursesByInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstructor.fulfilled, (state, action) => {
        state.loading = false;
        if (state.instructors) {
          state.instructors = state.instructors.map(instructor =>
            instructor.id === action.payload.id ? action.payload : instructor
          );
        }
        if (state.currentInstructor?.id === action.payload.id) {
          state.currentInstructor = action.payload;
        }
      })
      .addCase(updateInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(reactiveInstructor.pending, (state) => {
        state.loading = true;
      })
      .addCase(reactiveInstructor.fulfilled, (state, action) => {
          console.log("Reactivation payload:", action.payload);
        state.loading = false;
        // Update the specific instructor in the state
        if (state.instructors) {
          state.instructors = state.instructors.map(instructor =>
            instructor.id === action.payload.id
              ? { ...instructor, active: true, ...action.payload.instructor }
              : instructor
          );
        }
        // Also update currentInstructor if it's the same one
        if (state.currentInstructor?.id === action.payload.id) {
          state.currentInstructor = {
            ...state.currentInstructor,
            active: true,
            ...action.payload.instructor
          };
        }
        toast.success("Instructor reactivated successfully");
      })
      .addCase(reactiveInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to reactivate instructor");
      })

  },
});

export const { clearCurrentInstructor } = dashboardSlice.actions;
export default dashboardSlice.reducer;
