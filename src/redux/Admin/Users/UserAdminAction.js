import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/admin';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/users`, getAuthConfig());
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
      return rejectWithValue(error.response?.data || { message: 'Unauthorized access' });
    }
  }
);

// Get single user details
export const fetchUserDetails = createAsyncThunk(
  'users/fetchDetails',
  async (Id, { rejectWithValue }) => {  // Changed Id to userId for consistency
    try {
      const response = await axios.get(`${API_BASE}/users/${Id}`, getAuthConfig());
      return response.data;
    } catch (error) {
       console.error('Delete error:', error); // Debug log
      if (error.response?.status === 401) {
        console.log()
        window.location.href = '/admin/login';
      }
      return rejectWithValue(error.response?.data || { message: 'Unauthorized access' });
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {  
    try {
      await axios.delete(`${API_BASE}/users/${id}`, getAuthConfig());
      return id;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
      return rejectWithValue(error.response?.data || { message: 'Unauthorized access' });
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ id, enabled }, { rejectWithValue }) => {
    try {
      const endpoint = enabled ? 'enable' : 'deActivate';
      const response = await axios.patch(
        `${API_BASE}/users/${id}/${endpoint}`,
        {}, 
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
      return rejectWithValue(error.response?.data || { message: 'Failed to update status' });
    }
  }
);


export const fetchUserEnrolledCourses = createAsyncThunk(
  'users/fetchEnrolledCourses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/users/${userId}/enrollments`, getAuthConfig());
      console.log("Enrolled Courses" , response)
      return response.data;
    } catch (error) {
      console.error('Fetch enrolled courses error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch enrolled courses' }
      );
    }
  }
);
