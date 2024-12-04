import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import RegisterNewUser from "./components/RegisterNewUser";
import AdminDashboard from "./components/admindashboard/AdminDashBoard";
import UserDashboard from "./components/userdashboard/UserDashBoard";
import NotFound from "./components/NotFound";
import Navbar from "./components/navbar/NavBar";
import AddNewUser from "./components/admindashboard/AddNewUser";
import GetAllUsers from "./components/admindashboard/GetAllUsers";
import CrudUsers from "./components/admindashboard/CrudUsers";
import CrudBanks from "./components/admindashboard/CrudBanks";
import KYC from "./components/userdashboard/KYC";
import KycRequests from "./components/admindashboard/KycRequests";
import {jwtDecode} from "jwt-decode";

// Helper to get user role from token
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.isAdmin ? "admin" : "user";
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userRole = getUserRole();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterNewUser />} />

        {/* Admin Routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/crud-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <CrudUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/kyc-requests"
          element={
            <ProtectedRoute allowedRole="admin">
              <KycRequests />
            </ProtectedRoute>
            
          }
          />

        <Route
          path="/admindashboard/crud-banks"
          element={
            <ProtectedRoute allowedRole="admin">
              <CrudBanks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/add-user"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddNewUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/get-all-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <GetAllUsers />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
        path="/userdashboard/kyc"
        element={
          <ProtectedRoute allowedRole="user">
            <KYC/>
          </ProtectedRoute>
        }
        />

        

        {/* Fallback for Undefined Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
