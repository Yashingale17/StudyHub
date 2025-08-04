import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchTags = createAsyncThunk(
  'user/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/api/tags");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchLevels = createAsyncThunk(
  'user/fetchLevels',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/api/filters/levels");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPrices = createAsyncThunk(
  'user/fetchPrices',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/api/filters/prices");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      console.log('API Response:', response.data); // Add this line
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);