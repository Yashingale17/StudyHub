import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Instructor - Fetch Categories
export const fetchInstructorCategories = createAsyncThunk(
  "instructor/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/instructor/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch categories";
      return rejectWithValue(errorMsg);
    }
  }
);

// Create Course New 
export const createInstructorCourse = createAsyncThunk(
  "instructor/createCourse",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/instructor/courses",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create course";
      return rejectWithValue(errorMsg);
    }
  }
);


// Add Course Content
export const createCourseContent = createAsyncThunk(
  "instructor/createCourseContent",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/instructor/courseContent",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add content");
    }
  }
);

export const updateCourseInst = createAsyncThunk(
  "instructor/updateCourseInst",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/instructor/courses/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update course";
      return rejectWithValue(errorMsg);
    }
  }
);


// get instructor courses 
export const fetchMyInstructorCourses = createAsyncThunk(
  "instructor/fetchMyCourses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/instructor/courses/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch your courses";
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchCourseContentByCourseId = createAsyncThunk(
  "instructor/fetchCourseContentByCourseId",
  async (courseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/instructor/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch content");
    }
  }
);

export const updateCourseContent = createAsyncThunk(
  "instructor/updateCourseContent",
  async ({ id, contentData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/instructor/courseContent/${id}`,
        contentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Update failed");
    }
  }
);
