import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCourses = createAsyncThunk(
  'courseContent/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.get('/courses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCourseContent = createAsyncThunk(
  'courseContent/addCourseContent',
  async (contentData, { rejectWithValue }) => {
    try {
      const payload = {
        ...contentData,
        courseId: contentData.courseId
      };
      
      const response = await adminApi.post('/courseContent', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCourseContent = createAsyncThunk(
  'courseContent/getCourseContent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminApi.get(`/courseContent/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const deleteCourseContent = createAsyncThunk(
  'courseContent/deleteCourseContent',
  async ({ courseId, contentId }, { rejectWithValue }) => {
    try {
      await adminApi.delete(`/courseContent/${contentId}`, {
        data: { courseId } 
      });
      return { courseId, contentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCourseContent = createAsyncThunk(
  'courseContent/updateCourseContent',
  async ({ contentId, contentData }, { rejectWithValue }) => {
    try {
      const response = await adminApi.put(`/courseContent/${contentId}`, contentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);