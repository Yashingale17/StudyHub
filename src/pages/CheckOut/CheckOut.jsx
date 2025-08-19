import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserCart, fetchTotalPrice } from '../../redux/Enrollment/CartAction';
import { useNavigate } from 'react-router-dom';
import TopComp from '../../Components/Top/TopComp';
import { FiShoppingCart } from 'react-icons/fi';

const countryStateData = {
  India: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
  USA: ['California', 'Texas', 'Florida', 'New York', 'Illinois'],
  Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
};

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'India',
    state: '',
    city: '',
    postcode: '',
    phone: '',
    address: '',
    paymentMethod: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);


  const { loading, error, totalPriceLoading, subTotal, grandTotal, items: cartItems = [] } = useSelector(state => state.cart);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserCart(token));
      dispatch(fetchTotalPrice(token));
    } else {
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'state', 'city', 'postcode', 'phone', 'address', 'paymentMethod'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/checkout",
        {
          paymentMethod: formData.paymentMethod,
          courses: cartItems.map(item => item.courseId),
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            postcode: formData.postcode,
            phone: formData.phone,
            address: formData.address
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Payment successful! You've been enrolled in the courses.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (loading) {
    return (
      <div>
        <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
          <TopComp titleOne={"CheckOut"} titleTwo={"Checkout"} />
        </div>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#553CDF] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
          <TopComp titleOne={"CheckOut"} titleTwo={"Checkout"} />
        </div>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center text-red-500">
            <p>Error loading cart: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#553CDF] text-white px-4 py-2 rounded-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (cartItems.length === 0) {
    return (
      <div>
        <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
          <TopComp titleOne={"CheckOut"} titleTwo={"Checkout"} />
        </div>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
          <FiShoppingCart className="text-5xl text-[#553CDF] mb-4" />
          <h3 className="text-2xl font-medium text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-[#553CDF] text-white px-6 py-2 rounded-sm hover:bg-[#3e2bbf] transition"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"CheckOut"} titleTwo={"Checkout"} />
      </div>

      <div className='px-2.5'>
        <div className='pt-[80px] pb-[60px] max-w-6xl mx-auto'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className='px-6 pt-6 pb-4 bg-[#fafafa] rounded-sm'>
              <h5 className='border-b border-b-[#cdcdd5] pb-2 text-[22px] font-hind mb-[26px]'>Order Details</h5>
              {cartItems.map((item) => (
                <div key={item.cartId} className='flex justify-between flex-wrap gap-5 py-6 border-b border-b-[#cdcdd5]'>
                  <div className='flex gap-4'>
                    <img 
                      className='w-20 h-19 object-cover rounded-md' 
                      src={`http://localhost:8080${item.courseThumbnail}`} 
                      alt={item.courseTitle}
                      onError={(e) => e.target.src = '/placeholder-course.jpg'}
                    />
                    <p>{item.courseTitle}</p>
                  </div>
                  <div className='text-right ml-auto'>
                    <div className='flex flex-col'>
                      ${Math.round(item.discountedPrice || item.price).toFixed(2)}
                      {(item.discountedPrice && item.discountedPrice !== item.price) && (
                        <span className="text-[#767E8E] line-through text-sm ml-2">
                          ${Math.round(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="w-full mt-5">
                <div className='flex flex-col gap-2'>
                  <div className="flex justify-between mb-2 text-sm text-[#555]">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between mb-2 text-sm text-green-600">
                    <span>Discount</span>
                    <span>
                      {subTotal > grandTotal ?
                        `- $${(subTotal - grandTotal).toFixed(2)}` :
                        `$0`
                      }
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-3 mt-3 border-t border-gray-300 font-semibold text-base text-[#222]">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Billing and Payment */}
            <div>
              <h5 className='pb-2 text-[22px] font-hind mb-[24px]'>Billing & Payment</h5>
              
              {/* Billing Address */}
              <div className='bg-[#fafafa] p-6 rounded-sm'>
                <h6 className='font-medium mb-4'>Billing Address</h6>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* First Name */}
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder='First Name*'
                      className={`border w-full px-3 py-2 ${formErrors.firstName ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                  </div>
                  
                  {/* Last Name */}
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder='Last Name*'
                      className={`border w-full px-3 py-2 ${formErrors.lastName ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                  </div>
                  
                  {/* Email */}
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='Email Address*'
                      className={`border w-full px-3 py-2 ${formErrors.email ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  
                  {/* Country */}
                  <div className="md:col-span-1">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="border w-full px-3 py-2 text-gray-500 border-[#cdcfd5] rounded-sm"
                    >
                      {Object.keys(countryStateData).map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* State */}
                  <div className="md:col-span-1">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`border w-full px-3 py-2 ${formErrors.state ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                      disabled={!formData.country}
                    >
                      <option value="">Select State*</option>
                      {(countryStateData[formData.country] || []).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                  </div>
                  
                  {/* City */}
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder='City*'
                      className={`border w-full px-3 py-2 ${formErrors.city ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                  
                  {/* Postcode */}
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      placeholder='Postcode/ZIP*'
                      className={`border w-full px-3 py-2 ${formErrors.postcode ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.postcode && <p className="text-red-500 text-xs mt-1">{formErrors.postcode}</p>}
                  </div>
                  
                  {/* Phone */}
                  <div className="md:col-span-2">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder='Phone*'
                      className={`border w-full px-3 py-2 ${formErrors.phone ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  {/* Address */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder='Address*'
                      className={`border w-full px-3 py-2 ${formErrors.address ? 'border-red-500' : 'border-[#cdcfd5]'} rounded-sm`}
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className='bg-[#fafafa] p-6 rounded-sm mt-6'>
                <h6 className='font-medium mb-4'>Payment Method*</h6>
                <div className="space-y-3">
                  {formErrors.paymentMethod && <p className="text-red-500 text-xs -mt-2 mb-2">{formErrors.paymentMethod}</p>}
                  
                  <div className="flex items-center border rounded-md p-4 hover:border-[#553CDF]">
                    <input 
                      type="radio" 
                      id="card" 
                      name="paymentMethod"
                      value="CARD"
                      checked={formData.paymentMethod === 'CARD'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#553CDF] focus:ring-[#553CDF]"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center border rounded-md p-4 hover:border-[#553CDF]">
                    <input 
                      type="radio" 
                      id="upi" 
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#553CDF] focus:ring-[#553CDF]"
                    />
                    <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
                      UPI Payment
                    </label>
                  </div>
                  
                  <div className="flex items-center border rounded-md p-4 hover:border-[#553CDF]">
                    <input 
                      type="radio" 
                      id="netbanking" 
                      name="paymentMethod"
                      value="NETBANKING"
                      checked={formData.paymentMethod === 'NETBANKING'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#553CDF] focus:ring-[#553CDF]"
                    />
                    <label htmlFor="netbanking" className="ml-3 block text-sm font-medium text-gray-700">
                      Net Banking
                    </label>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-[#553CDF] text-white py-3 px-4 rounded-sm hover:bg-[#3e2bbf] transition"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Complete Payment & Enroll'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;