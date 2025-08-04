// instructorAction.js
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInstructorById = createAsyncThunk(
  'instructor/fetchInstructorById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/getInstructors/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInstructorCourses = createAsyncThunk(
  'instructor/fetchInstructorCourses',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/instructors/${id}/courses`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchInstructorByIdSecure = createAsyncThunk(
  'instructor/fetchInstructorByIdSecure',
  async (id, { rejectWithValue, getState }) => {
    try {
       const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/getInstructors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
