import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import TopComp from '../../Components/Top/TopComp';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserCart, fetchTotalPrice } from '../../redux/Enrollment/CartAction';
import { useNavigate } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import style from "./Carts.module.css"

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { 
    items: cartItems, 
    loading, 
    error, 
    totalPriceLoading, 
    subTotal, 
    grandTotal 
  } = useSelector(state => state.cart);
  
  const cartCount = cartItems.length;

  const fetchCartData = useCallback(async () => {
    try {
      if (token) {
        await Promise.all([
          dispatch(fetchUserCart(token)),
          dispatch(fetchTotalPrice(token))
        ]);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const handleRemove = async (courseId) => {
    try {
      const toastId = toast.loading("Removing item...", {
        position: "top-right"
      });

      await axios.delete(`http://localhost:8080/api/user/remove/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCartData();
      
      toast.dismiss(toastId);
      toast.success("Removed successfully", {
        autoClose: 2000,
        position: "top-right"
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to remove course.");
      console.error("Remove Error:", error);
    }
  };

  // Loading skeleton for smoother transition
  if (loading || totalPriceLoading) return (
    <div className="min-h-screen">
      <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"Cart"} titleTwo={"Cart"} />
      </div>
      <div className="px-2.5 py-[45px] max-w-[1410px] mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded">
                <div className="w-[200px] h-[120px] bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-8 w-1/4 h-32 bg-gray-200 rounded float-right"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div>
      <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"Cart"} titleTwo={"Cart"} />
      </div>
      <p className="text-center text-red-500 py-4">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className='mt-[79px] md:mt-[77px] lg:mt-[117px]'>
        <TopComp titleOne={"Cart"} titleTwo={"Cart"} />
      </div>

      <div className='px-2.5'>
        <div className='py-[45px] max-w-[1410px] mx-auto'>
          <div className={`mt-9 flex flex-col ${style.cartContainer}`}>
            {cartItems.length === 0 ? (
              <div className="flex justify-center w-full px-4 mt-10">
                <div className="text-center font-inter border border-dashed border-[#ccc] px-6 py-10 rounded-md bg-[#f9f9f9] w-full max-w-md">
                  <AiOutlineShoppingCart className="text-5xl text-[#553CDF] mx-auto mb-4" />
                  <p className="text-[18px] text-gray-600 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`${style.cartleft}`}>
                  <h3 className='text-[31px] mb-4 font-hind font-bold text-[#212327]'>{cartCount} Course{cartCount !== 1 ? 's' : ''} in Cart</h3>
                  {cartItems.map((item) => (
                    <div key={item.cartId} className={`flex items-center gap-3 mb-5 p-7 border border-[#cdcfd5] ${style.cartBox}`}>
                      <img
                        src={`http://localhost:8080${item.courseThumbnail}`}
                        alt={item.courseTitle}
                        className="w-[200px] h-[120px] object-cover rounded"
                        loading="lazy"
                      />
                      <div className='flex flex-col gap-3 w-full'>
                        <h3 className="text-lg font-hind font-normal mt-2">{item.courseTitle}</h3>
                        <span className="flex items-center flex-wrap gap-2 text-gray-600">
                          <p>{item.instructorName}</p>
                          <span className="flex items-center justify-center text-[20px] leading-none h-full">•</span>
                          <p className="capitalize">{item.level.toLowerCase()}</p>
                        </span>
                      </div>
                      <div className={`text-[#000] font-bold flex flex-col gap-9 ml-auto`}>
                        <div className='flex flex-col'>
                          ₹{Math.round(item.discountedPrice || item.price).toFixed(2)}
                          {(item.discountedPrice && item.discountedPrice !== item.price) && (
                            <span className="text-[#767E8E] line-through text-sm ml-2">
                              ₹{Math.round(item.price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          className='text-[#553CDF] font-medium font-inter cursor-pointer text-left'
                          onClick={() => handleRemove(item.courseId)}
                          aria-label={`Remove ${item.courseTitle} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`${style.cartright}`}>
                  <div className='mt-[36px]'>
                    <h3 className='mb-4 text-[#212327] font-hind text-[30px] font-bold'>Summary</h3>

                    <div className='border border-[#cdcfc5] rounded-sm'>
                      <div className={`p-4 border-b border-b-[#cdcfc5] ${style.subtotal}`}>
                        <div className='flex flex-row flex-wrap justify-between'>
                          <span>Subtotal:</span>
                          <span className='text-[18px] text-hind text-[#000] font-semibold'>
                            ${subTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className={`p-4 ${style.grandtotal}`}>
                        <div className={`mb-[40px] flex flex-row flex-wrap justify-between`}>
                          <span>Grand Total:</span>
                          <span className='text-[18px] text-hind text-[#000] font-semibold'>
                            ${grandTotal.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => navigate("/checkout")}
                          className='w-full py-3 px-8 bg-[#553CDF] text-center text-[16px] font-inter text-[#FFFFFF] hover:text-[#553CDF] hover:bg-[#FFFFFF] border border-[#553CDF] transition-all ease-in-out duration-200 rounded-sm cursor-pointer'
                        >
                          Proceed to checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;  