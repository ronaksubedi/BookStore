import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useRegisterUserMutation, useLoginUserMutation } from "./userApi.js";
import { useDispatch } from "react-redux";
import { userSlice } from "./userSlice.js";
import { loadUserCart } from "../cart/cartSlice.js";
import Swal from "sweetalert2";
import { signInWithGoogle } from "./firebaseAuth.js";
import { baseApi } from "../../app/mainApi.js";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);
      if (result.error) {
        Swal.fire("Error", result.error.data?.message || "Registration failed", "error");
        return;
      }
      const loginResult = await loginUser({ email: data.email, password: data.password });
      if (loginResult.error) {
        navigate("/login");
        return;
      }
      const userData = loginResult.data.user;
      localStorage.setItem("token", loginResult.data.token);
      dispatch(userSlice.actions.setUser(userData));
      dispatch(loadUserCart(userData.id)); // ✅ load this user's cart
      Swal.fire("Success", "Account created and logged in!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSignup = async () => {
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
        throw new Error(data?.message || "Google signup failed");
      }

      localStorage.setItem("token", data.token);
      dispatch(userSlice.actions.setUser(data.user));
      dispatch(loadUserCart(data.user.id));
      Swal.fire("Success", data.isNewUser ? "Google account created successfully!" : "Google login successful!", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.message || "Google signup failed", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl flex mx-auto rounded-2xl shadow-lg overflow-hidden mt-10">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-10 bg-[#008080]">
          <div>
            <h1 className="text-white text-5xl font-extrabold italic mb-4">Signup page</h1>
            <p className="text-gray-300 text-xl italic font-light">
              Create your account and unlock a smooth, personalized book-shopping experience made for true readers.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Create an account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Full Name</label>
                <input
                  {...register("fullname", { required: "Full name is required" })}
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-primary text-sm focus:outline-none"
                />
                {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>}
              </div>
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
                <label className="block text-sm font-medium text-primary mb-1">Password</label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" }
                    })}
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
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-primary font-medium py-2.5 rounded-lg transition text-sm"
              >
                <FcGoogle size={18} />
                {isGoogleLoading ? "Signing up..." : "Signup with Google"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Already have account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}