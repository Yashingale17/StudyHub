import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserEnrollments = createAsyncThunk(
  'dashboard/fetchEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/user/dashboard/enrollments',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'userDashboard/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/user/me',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);