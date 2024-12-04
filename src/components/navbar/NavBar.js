import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { getUserByIdService } from "../../services/admin/adminService";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user details on profile button click
  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const response = await getUserByIdService(userId);
      setUserProfile(response); // Save user details in state
      console.log("the user profile is",userProfile);


      setIsProfileModalOpen(true); // Open the profile modal
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Failed to fetch profile details.");
    }
  };

  const handleLogout = () => {
    // Close the modal and remove the token
    setIsLogoutModalOpen(false);
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      <nav className="bg-red-500 text-white px-6 py-3 flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Banking App
        </h1>
        <div className="flex items-center space-x-4">
          {!token ? null : (
            <>
              <button
                className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-200"
                onClick={fetchUserProfile} // Fetch and open profile modal
              >
                Profile
              </button>
              <button
                className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-200"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Profile Modal */}
      {isProfileModalOpen && userProfile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
            <div className="text-gray-800">
              <p>
                <strong>First Name:</strong> {userProfile.firstName || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {userProfile.lastName || "N/A"}
              </p>
              <p>
                <strong>Username:</strong> {userProfile.username || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {userProfile.email || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {userProfile.dateOfBirth || "N/A"}
              </p>
              <p>
                <strong>KYC Status:</strong> {userProfile.kycStatus || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {userProfile.isAdmin ? "Admin" : "User"}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsLogoutModalOpen(false)} // Close modal without logging out
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleLogout} // Logout and close modal
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
