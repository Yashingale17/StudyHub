import axios from "axios";
import {
  fetchEnrollmentsStart,
  fetchEnrollmentsSuccess,
  fetchEnrollmentsFailure,
} from "./EnrollmentSlice";

export const fetchUserEnrollments = (token) => async (dispatch) => {
  dispatch(fetchEnrollmentsStart());
  try {
    const response = await axios.get(`http://localhost:8080/api/user/user/Enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchEnrollmentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchEnrollmentsFailure(error.response?.data?.message || "Something went wrong"));
  }
};
