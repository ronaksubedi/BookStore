import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useLoginUserMutation } from "./userApi.js";
import { useDispatch } from "react-redux";
import { userSlice } from "./userSlice.js";
import { loadUserCart } from "../cart/cartSlice.js";
import Swal from "sweetalert2";
import { signInWithGoogle } from "./firebaseAuth.js";
import { baseApi } from "../../app/mainApi.js";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      if (result.error) {
        Swal.fire("Error", result.error.data?.message || "Login failed", "error");
        return;
      }
      const userData = result.data.user;
      localStorage.setItem("token", result.data.token);
      dispatch(userSlice.actions.setUser(userData));
      dispatch(loadUserCart(userData.id)); // ✅ load this user's cart
      Swal.fire("Success", "Login successful!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const { idToken } = await signInWithGoogle();
      const response = await fetch(`${baseApi}users/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Google login failed");
      }

      localStorage.setItem("token", data.token);
      dispatch(userSlice.actions.setUser(data.user));
      dispatch(loadUserCart(data.user.id));
      Swal.fire("Success", data.isNewUser ? "Google account created successfully!" : "Google login successful!", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message || "Google login failed", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl flex mx-auto rounded-2xl shadow-lg overflow-hidden mt-10">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-10 bg-[#008080]">
          <div>
            <h1 className="text-white text-5xl font-extrabold italic mb-4">Login page</h1>
            <p className="text-gray-300 text-xl italic font-light">
              Log in to pick up where you left off and keep exploring books made for curious readers like you.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Login to your account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Email</label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-primary text-sm focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-primary">Password</label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    {...register("password", { required: "Password is required" })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login now"}
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-primary font-medium py-2.5 rounded-lg transition text-sm"
              >
                <FcGoogle size={18} />
                {isGoogleLoading ? "Signing in..." : "Continue with Google"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}