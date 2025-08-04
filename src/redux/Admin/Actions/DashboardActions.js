import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/api/admin/dashboard-summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchFiveUsers = createAsyncThunk(
  "dashboard/fetchFiveUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter by role === "USER" then take first 5
      const userOnly = res.data.filter(user => user.role === "USER").slice(0, 5);

      return userOnly;
    } catch (err) {
      console.error("Error fetching users:", err);
      return rejectWithValue(err.response?.data?.message || "User fetch error");
    }
  }
);


export const fetchAllInstructors = createAsyncThunk(
  "dashboard/fetchAllInstructors",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/api/admin/getAllInstructors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Instructor fetch error");
    }
  }
);

export const softDeleteInstructor = createAsyncThunk(
  "admin/softDeleteInstructor",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:8080/api/admin/softDeleteInstructor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id, message: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Soft delete failed");
    }
  }
);

export const reactiveInstructor = createAsyncThunk(
  "admin/reactiveInstructor",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8080/api/admin/reactiveInstructor/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Return both id and the updated instructor data
      return { id, instructor: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Reactivation failed");
    }
  }
);

export const deleteInstructor = createAsyncThunk(
  "admin/deleteInstructor",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:8080/api/admin/deleteInstructor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id, message: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "admin/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);


export const createCourse = createAsyncThunk(
  "admin/createCourse",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/admin/addCourse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create course"
      );
    }
  }
);


export const fetchInstructorById = createAsyncThunk(
  "dashboard/fetchInstructorById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/admin/getInstructors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch instructor details");
    }
  }
);


export const fetchCoursesByInstructor = createAsyncThunk(
  "admin/fetchCoursesByInstructor",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/admin/courses/instructor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Courses", response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses by instructor"
      );
    }
  }
);


export const updateInstructor = createAsyncThunk(
  "admin/updateInstructor",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/admin/updateInstructor/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle field-specific validation errors
        return thunkAPI.rejectWithValue(error.response.data.errors);
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update instructor"
      );
    }
  }
);