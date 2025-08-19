import React, { useState, useEffect } from "react";
import style from "./log.module.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/Auth/Authslice";

const Login = () => {
  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  const newErrors = {};
  if (!loginData.userName.trim()) {
    newErrors.userName = "Username is required";
  }
  if (!loginData.password.trim()) {
    newErrors.password = "Password is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", loginData);
    const { token, userName, role , id} = response.data;

    const user = { userName, role , id};

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(setCredentials({ token, user }));

     toast.success("Login success", {
          autoClose: 2000,
          position: "top-right"
        });

    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (error) {
    if (error.response?.data) {
      setErrors({
        general: error.response.data.message || error.response.data.general || "Invalid credentials",
      });
    } else {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="mt-[60px] md:mt-[100px] pt-[117px]">
        <div className="max-w-[700px] mb-[60px] mx-auto w-[90%] md:p-[60px] border-[1px] border-solid border-[#DDD8F9] rounded-sm custom-shadow ">
          <div className="">
            <div className="p-6">
              <div className="mb-8 text-[22.5px] leading-[1.6] font-inter">
                Hi, Welcome back!
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <input
                    name="userName"
                    value={loginData.userName}
                    onChange={handleChange}
                    className="py-1 px-5 h-[52px] w-full rounded-sm text-[18px] border-[1px] border-solid border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
                    type="text"
                    placeholder="Username"
                  />
                  {(errors?.userName || (errors?.general && errors.general.toLowerCase().includes("user"))) && (
                    <p className="text-red-500 mt-1">{errors.userName || errors.general}</p>
                  )}
                </div>

                <div className="mb-8">
                  <input
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    className="py-1 px-5 mb-2.5 h-[52px] w-full rounded-sm text-[18px] border-[1px] border-solid border-[#DDD8F9] focus:border-[#553CDF] focus:outline-none"
                    type="password"
                    placeholder="Password"
                  />
                  {(errors?.password || (errors?.general && errors.general.toLowerCase().includes("password"))) && (
                    <p className="text-red-500 mt-1">{errors.password || errors.general}</p>
                  )}
                </div>

                {/* Remember me + forgot password */}
                <div className="flex justify-between items-center mb-5">
                  <div className="inline-block">
                    <input className="mr-2 w-6 h-4" type="checkbox" />
                    <label className="inline-block text-gray-700 cursor-pointer text-[17px] font-hind font-medium leading-[24px]">
                      Keep me signed in
                    </label>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="font-hind relative cursor-pointer text-gray-700 inline-flex items-center text-center font-normal leading-[1.2] txt-hover"
                    >
                      Forget password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="cursor-pointer py-3.5 px-[34px] w-full bg-dark-blue text-[15px] rounded-sm text-[#ffffff] border-[1px] border-solid border-[#553CDF] text-center inline-block register-hover"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <div className="mt-5 text-[#41454F] text-center leading-[1.9] text-[17px]">
                  Don’t have an account?{" "}
                  <a
                    href="/register"
                    className={`txt-color text-inherit cursor-pointer font-medium ${style.register}`}
                  >
                    Register Now
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
