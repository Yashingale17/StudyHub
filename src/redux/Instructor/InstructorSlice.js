// instructorSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchInstructorById, fetchInstructorCourses , fetchInstructorByIdSecure } from './InstructorAction';

const instructorSlice = createSlice({
  name: 'instructor',
  initialState: {
    instructor: null,
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Instructor Info
      .addCase(fetchInstructorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorById.fulfilled, (state, action) => {
        state.loading = false;
        state.instructor = action.payload;
      })
      .addCase(fetchInstructorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Instructor Courses
      .addCase(fetchInstructorCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
       .addCase(fetchInstructorByIdSecure.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorByIdSecure.fulfilled, (state, action) => {
        state.loading = false;
        state.instructor = action.payload;
      })
      .addCase(fetchInstructorByIdSecure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export default instructorSlice.reducer;
