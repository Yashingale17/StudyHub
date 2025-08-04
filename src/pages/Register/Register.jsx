import React, { useEffect, useState } from 'react';
import TopComp from '../../Components/Top/TopComp';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from '../../Components/Login/log.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      conformPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      username: Yup.string().required('User Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      conformPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
   onSubmit: async (values, { setSubmitting, setErrors }) => {
  setGeneralError('');

  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', values);

    toast.success('Registration successful! Redirecting to login...', {
      position: 'top-right',
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate('/login');
    }, 1200);
  } catch (error) {
    const backendErrors = error.response?.data;
    const newErrors = {};

    if (backendErrors?.fieldErrors) {
      backendErrors.fieldErrors.forEach((err) => {
        newErrors[err.field] = err.message;
      });
    }
    setErrors(newErrors);

    if ((!backendErrors?.fieldErrors || backendErrors.fieldErrors.length === 0) &&
        (backendErrors?.general || backendErrors?.message)) {
      setGeneralError(backendErrors.general || backendErrors.message);
    };

    setSubmitting(false);
  }
}
,
  });

  return (
    <div>
  <div className="mt-[79px] md:mt-[77px] lg:mt-[117px]">
    <TopComp titleOne={'Student Registration Page'} titleTwo={'Student Registration Page'} />
  </div>

  <div className="mt-[40px] mb-[60px] pt-[80px] pb-[60px] md:pt-[120px] md:pb-[20px] lg:mt-0">
    <div className="max-w-[700px] mb-[60px] mx-auto w-[92%] md:p-[60px] border border-solid border-[#DDD8F9] rounded-sm custom-shadow">
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="p-6">
          <div className="mb-8 text-[22.5px] font-inter">Register to StudyHub</div>

          <div className="mb-5.5">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
              {...formik.getFieldProps('firstName')}
            />
            <p className="text-red-500 mt-1">
              {formik.touched.firstName && formik.errors.firstName
                ? formik.errors.firstName
                : generalError.toLowerCase().includes('first name')
                ? generalError
                : ''}
            </p>
          </div>

          {/* Last Name */}
          <div className="mb-5.5">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
              {...formik.getFieldProps('lastName')}
            />
            <p className="text-red-500 mt-1">
              {formik.touched.lastName && formik.errors.lastName
                ? formik.errors.lastName
                : generalError.toLowerCase().includes('last name')
                ? generalError
                : ''}
            </p>
          </div>

          {/* Username */}
          <div className="mb-5.5">
            <input
              type="text"
              name="username"
              placeholder="User Name"
              className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
              {...formik.getFieldProps('username')}
            />
            <p className="text-red-500 mt-1">
              {formik.touched.username && formik.errors.username
                ? formik.errors.username
                : generalError.toLowerCase().includes('username')
                ? generalError
                : ''}
            </p>
          </div>

          {/* Email */}
          <div className="mb-5.5">
            <input
              type="email"
              name="email"
              placeholder="E-Mail"
              className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
              {...formik.getFieldProps('email')}
            />
            <p className="text-red-500 mt-1">
              {formik.touched.email && formik.errors.email
                ? formik.errors.email
                : generalError.toLowerCase().includes('email')
                ? generalError
                : ''}
            </p>
          </div>

          {/* Password */}
          <div className="mb-5.5">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
              {...formik.getFieldProps('password')}
            />
            <p className="text-red-500 mt-1">
              {formik.touched.password && formik.errors.password
                ? formik.errors.password
                : generalError.toLowerCase().includes('password')
                ? generalError
                : ''}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <input
              type="password"
              name="conformPassword"
              placeholder="Password Confirmation"
              className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
              {...formik.getFieldProps('conformPassword')}
            />
            <p className="text-red-500 mt-1">
              {formik.touched.conformPassword && formik.errors.conformPassword
                ? formik.errors.conformPassword
                : generalError.toLowerCase().includes('confirm')
                ? generalError
                : ''}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="cursor-pointer py-3.5 px-[34px] w-full bg-dark-blue text-[15px] rounded-sm text-white border border-[#553CDF] text-center hover:text-[#553CDF] hover:bg-white transition-all duration-150 ease-in"
          >
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </button>

          {/* Login Redirect */}
          <div className="mt-5 text-[#41454F] text-center leading-[1.9] text-[17px]">
            Already have an account?{' '}
            <a href="/login" className={`txt-color text-inherit cursor-pointer font-medium ${style.register}`}>
              Login Now
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default Register;
