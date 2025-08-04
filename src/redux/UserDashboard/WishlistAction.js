
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/user';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addToWishlist/${courseId}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/removeWishlist/${courseId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getWishList`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);