import React from "react";
// import Navbar from "../navbar/NavBar";

function MainPage() {
  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Banking App</h1>
        <p className="text-xl mb-6">
          Experience effortless banking at your fingertips.
        </p>
      </div>
    </div>
  );
}

export default MainPage;
