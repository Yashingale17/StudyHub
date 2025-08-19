import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCourses,
  addCourseContent,
  getCourseContent,
  updateCourseContent,
  deleteCourseContent
} from './CourseContentAction';

const initialState = {
  courses: [],
  selectedContent: null,
  isLoading: false,
  error: null,
  success: false,
};

const courseContentSlice = createSlice({
  name: 'courseContent',
  initialState,
  reducers: {
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedContent: (state) => {
      state.selectedContent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses Cases
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Content Cases
      .addCase(addCourseContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCourseContent.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(addCourseContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Content Cases
      .addCase(getCourseContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCourseContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedContent = action.payload;
      })
      .addCase(getCourseContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Content Cases
      .addCase(updateCourseContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCourseContent.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.selectedContent = null;
      })
      .addCase(updateCourseContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Content Cases
      .addCase(deleteCourseContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCourseContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const { courseId, contentId } = action.payload;
        state.courses = state.courses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              content: course.content?.filter(content => content.id !== contentId) || []
            };
          }
          return course;
        });
      })
      .addCase(deleteCourseContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSelectedCourse,
  resetSuccess,
  clearError,
  clearSelectedContent
} = courseContentSlice.actions;
export default courseContentSlice.reducer;