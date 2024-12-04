import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUniversity } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white">
      <div className="container mx-auto p-12">
        <h1 className="text-4xl font-bold mb-10 text-center">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-16">
          {/* CRUD on Users */}
          <div
            onClick={() => navigate("/admindashboard/crud-users")}
            className="p-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
          >
            <FaUsers size={80} className="text-white mb-6" />
            <h2 className="text-2xl font-bold">Manage Users</h2>
            <p className="mt-4">Add, Edit, Delete, and View Users</p>
          </div>
          {/* CRUD on Banks */}
          <div
            onClick={() => navigate("/admindashboard/crud-banks")}
            className="p-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
          >
            <FaUniversity size={80} className="text-white mb-6" />
            <h2 className="text-2xl font-bold">Manage Banks</h2>
            <p className="mt-4">Add, Edit, Delete, and View Banks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
