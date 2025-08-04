import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_BASE = "http://localhost:8080/api"

const getAuthConfig = () => {
  const token = localStorage.getItem('adminToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchInstructorDetails = createAsyncThunk(
  'adminDashboard/fetchInstructorDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE}/admin/getInstructors/${id}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch instructor details' });
    }
  }
);

