import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../services/register";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

function RegisterNewUser() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await RegisterUser(formData);
      if (response) {
        // Show success toast
        toast.success("Registration successful!");
        navigate("/"); // Redirect to login page
      }
    } catch (error) {
      // Show error toast with specific or fallback error message
      toast.error(error.specificMessage || error.message || "Registration failed.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-700 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white/90 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-800">
          Banking App
        </h2>
        <p className="mt-2 text-center text-gray-600">Create a new account</p>

        <form onSubmit={handleRegister} className="mt-6">
          {/* First Name */}
          <div className="mb-4 relative">
            <label
              htmlFor="firstName"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                id="firstName"
                type="text"
                className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your first name"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="mb-4 relative">
            <label
              htmlFor="lastName"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                id="lastName"
                type="text"
                className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your last name"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="mb-4 relative">
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <FaUserTie className="absolute left-3 top-3 text-gray-400" />
              <input
                id="username"
                type="text"
                className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Password */}
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
                type="password"
                className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Age */}
          <div className="mb-4 relative">
            <label
              htmlFor="age"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                id="age"
                type="number"
                className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your age"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: +e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Admin Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="isAdmin"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Are you an Admin?
            </label>
            <select
              id="isAdmin"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAdmin: e.target.value === "true", // Convert to boolean
                }))
              }
              required
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-purple-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterNewUser;
