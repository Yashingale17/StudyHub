import { createSlice } from "@reduxjs/toolkit";
import { fetchInstructorCategories, createInstructorCourse, createCourseContent, fetchMyInstructorCourses, updateCourseInst, updateCourseContent , fetchCourseContentByCourseId } from "./InstructorPannelAction";

const initialState = {
  categories: { data: [], loading: false, error: null },
  createCourse: { loading: false, error: null, success: false },
  createContent: { loading: false, error: null, success: false },
  myCourses: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null
  },
  updateCourse: { loading: false, error: null, success: false },
  courseContentByCourseId: { data: [], loading: false, error: null },
  updateCourseContent: { success: false, loading: false, error: null },

};

const instructorCourseSlice = createSlice({
  name: "instructorCourse",
  initialState,
  reducers: {
    resetCourseState: (state) => {
      state.createCourse = initialState.createCourse;
      state.createContent = initialState.createContent;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchInstructorCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchInstructorCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload;
      })
      .addCase(fetchInstructorCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })

      // Create Course
      .addCase(createInstructorCourse.pending, (state) => {
        state.createCourse.loading = true;
        state.createCourse.success = false;
        state.createCourse.error = null;
      })
      .addCase(createInstructorCourse.fulfilled, (state) => {
        state.createCourse.loading = false;
        state.createCourse.success = true;
      })
      .addCase(createInstructorCourse.rejected, (state, action) => {
        state.createCourse.loading = false;
        state.createCourse.error = action.payload;
      })

      // Create Course Content
      .addCase(createCourseContent.pending, (state) => {
        state.createContent.loading = true;
        state.createContent.success = false;
        state.createContent.error = null;
      })
      .addCase(createCourseContent.fulfilled, (state) => {
        state.createContent.loading = false;
        state.createContent.success = true;
      })
      .addCase(createCourseContent.rejected, (state, action) => {
        state.createContent.loading = false;
        state.createContent.error = action.payload;
      })

      .addCase(fetchMyInstructorCourses.pending, (state) => {
        state.myCourses.loading = true;
        state.myCourses.error = null;
      })
      .addCase(fetchMyInstructorCourses.fulfilled, (state, action) => {
        state.myCourses.loading = false;
        state.myCourses.data = action.payload;
        state.myCourses.lastFetched = new Date().toISOString();
      })
      .addCase(fetchMyInstructorCourses.rejected, (state, action) => {
        state.myCourses.loading = false;
        state.myCourses.error = action.payload;
      })

      //Update course 
      .addCase(updateCourseInst.pending, (state) => {
        state.updateCourse.loading = true;
        state.updateCourse.success = false;
        state.updateCourse.error = null;
      })
      .addCase(updateCourseInst.fulfilled, (state) => {
        state.updateCourse.loading = false;
        state.updateCourse.success = true;
      })
      .addCase(updateCourseInst.rejected, (state, action) => {
        state.updateCourse.loading = false;
        state.updateCourse.error = action.payload;
      })

      // Fetch course content by courseId
      .addCase(fetchCourseContentByCourseId.pending, (state) => {
        state.courseContentByCourseId.loading = true;
      })
      .addCase(fetchCourseContentByCourseId.fulfilled, (state, action) => {
        state.courseContentByCourseId.loading = false;
        state.courseContentByCourseId.data = action.payload;
      })
      .addCase(fetchCourseContentByCourseId.rejected, (state, action) => {
        state.courseContentByCourseId.loading = false;
        state.courseContentByCourseId.error = action.payload;
      })

      // Update course content
      .addCase(updateCourseContent.pending, (state) => {
        state.updateCourseContent.loading = true;
      })
      .addCase(updateCourseContent.fulfilled, (state) => {
        state.updateCourseContent.loading = false;
        state.updateCourseContent.success = true;
      })
      .addCase(updateCourseContent.rejected, (state, action) => {
        state.updateCourseContent.loading = false;
        state.updateCourseContent.error = action.payload;
      })


  },
});

export const { resetCourseState } = instructorCourseSlice.actions;
export default instructorCourseSlice.reducer; 
