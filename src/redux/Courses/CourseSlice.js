import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredCourses, fetchSearchCourses , fetchCourseById } from "./CourseAction";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    courseDetail: null, 
    loading: false,
    error: null,
  },
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
    },
    fetchCoursesSuccess: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
    },
    fetchCoursesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // filter
      .addCase(fetchFilteredCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilteredCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchFilteredCourses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // search
      .addCase(fetchSearchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSearchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchCourses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

       .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetail = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  clearCourseDetail,
} = courseSlice.actions;

export default courseSlice.reducer;
