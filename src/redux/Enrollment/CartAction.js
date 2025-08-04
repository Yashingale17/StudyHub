import axios from 'axios';
import {
  fetchCartRequest, fetchCartSuccess, fetchCartFailure, fetchTotalPriceRequest,
  fetchTotalPriceSuccess,
  fetchTotalPriceFailure,
} from './CartSlice';


export const fetchUserCart = (token) => async (dispatch) => {

  dispatch(fetchCartRequest());
  try {
    const response = await axios.get('http://localhost:8080/api/user/allItems', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchCartSuccess(response.data));
  } catch (error) {
    const errorMsg =
      error?.response?.data?.message || error?.response?.data?.general || "Failed to fetch cart.";
    dispatch(fetchCartFailure(errorMsg));
  }
};

export const fetchTotalPrice = () => async (dispatch) => {
  try {
    dispatch(fetchTotalPriceRequest());

    const token = localStorage.getItem("token");

    const res = await axios.get('http://localhost:8080/api/user/total-price', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(fetchTotalPriceSuccess(res.data));
  } catch (err) {
    dispatch(fetchTotalPriceFailure(err.message));
  }
};
