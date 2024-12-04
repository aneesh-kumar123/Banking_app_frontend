// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="text-xl">Page Not Found</p>
        <Link to="/" className="text-blue-600 underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
