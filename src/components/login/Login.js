import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../services/login";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({ checked: true });
  const [captcha, setCaptcha] = useState(generateCaptcha()); 
  const [captchaInput, setCaptchaInput] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

 
  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      // Validate CAPTCHA
      if (captchaInput !== captcha) {
        toast.error("Captcha does not match. Please try again.");
        return;
      }

      const response = await LoginUser(formData); 
      if (!response) throw new Error("Invalid credentials");

      localStorage.setItem("token", response);
      const decoded = jwtDecode(response);
       
      toast.success(
        `Login successful! Welcome ${
          decoded.isAdmin ? "Admin" : "User"
        } to the Dashboard`
      );

      setTimeout(() => {
        if (decoded.isAdmin) {
          navigate("/admindashboard", { replace: true });
        } else {
          navigate("/userdashboard", { replace: true });
        }
      }, 2000);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.specificMessage || error.message || "Login failed. Please try again."
      );
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-700 to-blue-600">
      {/* Left Section */}
      <div className="flex flex-col justify-center w-1/2 px-12 text-white">
        <h1 className="text-5xl font-bold mb-6">Welcome to Your Bank</h1>
        <p className="text-lg mb-8">
          Create accounts, manage funds, and transfer money seamlessly. Whether
          you're a business owner or an individual, we empower you to control
          your finances with ease.
        </p>
        <p className="font-semibold">
          Join us today and experience the future of banking.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-1/2">
        <div
          className="w-full max-w-md p-8 bg-white/90 rounded-xl shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 className="text-3xl font-bold text-center text-purple-800">
            Log In
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="mt-6">
            {/* Username Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="username"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your username"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <div
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* CAPTCHA Section */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Captcha
              </label>
              <div className="flex items-center">
                <div className="bg-gray-200 text-gray-700 font-mono px-4 py-2 rounded-md">
                  {captcha}
                </div>
                <FaSyncAlt
                  className="ml-4 text-purple-600 cursor-pointer"
                  onClick={() => setCaptcha(generateCaptcha())}
                  title="Refresh Captcha"
                />
              </div>
              <input
                type="text"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={formData.checked}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    checked: !formData.checked,
                  }))
                }
              />
              <label className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
              disabled={!formData.checked}
            >
              Log In
            </button>
          </form>

          {/* Sign Up */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-purple-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
