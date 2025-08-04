import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure
} from "./CourseSlice";

export const getAllCourses = () => async (dispatch) => {
  try {
    dispatch(fetchCoursesStart());
    const res = await axios.get("http://localhost:8080/api/courses");
    dispatch(fetchCoursesSuccess(res.data));
  } catch (error) {
    dispatch(fetchCoursesFailure(error.message));
  }
};

export const fetchFilteredCourses = createAsyncThunk(
  "courses/fetchFilteredCourses",
  async ({ category, price, level, tag }, thunkAPI) => {
    try {
      const params = new URLSearchParams();

      if (category?.length) category.forEach(c => params.append("category", c));
      if (price?.length) price.forEach(p => params.append("price", p));
      if (level?.length) level.forEach(l => params.append("level", l));
      if (tag?.length) tag.forEach(t => params.append("tag", t));

      const response = await axios.get(`http://localhost:8080/api/filter?${params.toString()}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const fetchSearchCourses = createAsyncThunk(
  "courses/fetchSearchCourses",
  async (query, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/search?query=${query}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/course/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

