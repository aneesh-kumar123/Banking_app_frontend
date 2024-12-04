import React, { useEffect, useState } from "react";
import { getUserByIdService } from "../../services/admin/adminService";
import { getAllAccountsService } from "../../services/user/userService";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";
import Table from "../../sharedComponents/Table";
import Pagination from "../../sharedComponents/Pagination";
import SizeBar from "../../sharedComponents/SizeBar";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    accountId: "",
    bankId: "",
  });
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not logged in");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      

      const userResponse = await getUserByIdService(userId);
      setUser(userResponse); // Set user data
      setKycStatus(userResponse.kycStatus); // Set KYC status

      const accountsResponse = await getAllAccountsService(userId, limit, page);
      setAccounts(accountsResponse.data); // Set user accounts
      setTotalAccounts(accountsResponse.total); // Total accounts for pagination

      setIsLoading(false); // Stop loading
    } catch (error) {
      toast.error(error.message || "Failed to fetch user details.");
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    await fetchUserDetails(); // Re-fetch user details with updated search filters
  };

  const resetFilters = () => {
    setSearchFilters({ accountId: "", bankId: "" });
    fetchUserDetails(); // Reset and re-fetch
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details on component mount
  }, [limit, page]); // Refetch on pagination or limit change

  if (isLoading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  const handleViewBalance = (accountId) => {
    toast.info(`View balance for account ID: ${accountId}`);
    // Add logic for viewing account balance
  };

  const handleViewPassbook = (accountId) => {
    toast.info(`View passbook for account ID: ${accountId}`);
    // Add logic for viewing passbook
  };

  const handleDeleteAccount = (accountId) => {
    toast.info(`Delete account with ID: ${accountId}`);
    // Add logic for deleting account
  };

  const handleCreateAccount = () => {
    toast.info("Redirecting to account creation...");
    // Add logic for account creation modal or navigation
  };

  const handleDoKYC = () => {
    navigate("/userdashboard/kyc"); // Navigate to the KYC component
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}</h1>
      </div>

      <div className="flex justify-between items-center mb-8">
        {/* KYC Status */}
        <div className="text-xl">
          <strong>KYC Status:</strong>{" "}
          {kycStatus === "Not done" ? (
            <span className="text-red-500">Not Done</span>
          ) : kycStatus === "rejected" ? (
            <span className="text-yellow-500">Rejected</span>
          ) : (
            <span className="text-green-500">Verified</span>
          )}
        </div>
        {/* KYC Button */}
        {kycStatus === "Not done" && (
          <button
            className="bg-white text-purple-600 px-4 py-2 rounded shadow-md hover:bg-purple-100"
            onClick={handleDoKYC}
          >
            Do KYC
          </button>
        )}
        {kycStatus === "rejected" && (
          <button
            className="bg-white text-purple-600 px-4 py-2 rounded shadow-md hover:bg-purple-100"
            onClick={handleDoKYC}
          >
            KYC Rejected!
          </button>
        )}
        {kycStatus === "verified" && (
          <button
            className="bg-white text-purple-600 px-4 py-2 rounded shadow-md hover:bg-purple-100"
            onClick={handleDoKYC}
          >
            KYC Verified!
          </button>
        )}

      </div>

      {/* Accordions for Deposit, Withdraw, Transfer */}
      <div className="space-y-4 mb-6">
        <div className="bg-white text-black rounded-lg shadow-lg p-4">
          <h2
            className="text-xl font-bold cursor-pointer"
            onClick={() => setUser((prev) => ({ ...prev, depositOpen: !prev?.depositOpen }))}
          >
            Deposit Money
          </h2>
          {user?.depositOpen && (
            <div className="mt-4">
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md mb-4"
                placeholder="Enter amount to deposit"
              />
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Submit Deposit
              </button>
            </div>
          )}
        </div>
        {/* Withdraw Accordion */}
        <div className="bg-white text-black rounded-lg shadow-lg p-4">
          <h2
            className="text-xl font-bold cursor-pointer"
            onClick={() => setUser((prev) => ({ ...prev, withdrawOpen: !prev?.withdrawOpen }))}
          >
            Withdraw Money
          </h2>
          {user?.withdrawOpen && (
            <div className="mt-4">
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md mb-4"
                placeholder="Enter amount to withdraw"
              />
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Submit Withdrawal
              </button>
            </div>
          )}
        </div>
        {/* Transfer Accordion */}
        <div className="bg-white text-black rounded-lg shadow-lg p-4">
          <h2
            className="text-xl font-bold cursor-pointer"
            onClick={() => setUser((prev) => ({ ...prev, transferOpen: !prev?.transferOpen }))}
          >
            Transfer Money
          </h2>
          {user?.transferOpen && (
            <div className="mt-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md mb-4"
                placeholder="Enter recipient account ID"
              />
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md mb-4"
                placeholder="Enter amount to transfer"
              />
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Submit Transfer
              </button>
            </div>
          )}
        </div>
      </div>

     

      {/* Accounts Table */}
      <div className="bg-white text-black rounded-lg shadow-lg p-6">
         {/* Search Filters and Create Account */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Account ID"
            className="w-full px-4 py-2 border rounded-md"
            value={searchFilters.accountId}
            onChange={(e) => setSearchFilters({ ...searchFilters, accountId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Bank ID"
            className="w-full px-4 py-2 border rounded-md"
            value={searchFilters.bankId}
            onChange={(e) => setSearchFilters({ ...searchFilters, bankId: e.target.value })}
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Search
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
        <button
          onClick={handleCreateAccount}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Account
        </button>
      </div>
        <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
        <Table
          data={accounts}
          requiredColumns={["id", "bankId", "accountType"]}
          isAdmin={user.isAdmin} // Pass user type
          onView={handleViewBalance}
          onEdit={handleViewPassbook} // Adjusted for passbook viewing
          onDelete={handleDeleteAccount}
        />
      </div>

      {/* Pagination and Size Bar */}
      <div className="flex justify-between items-center mt-4">
        <SizeBar setLimit={setLimit} />
        <Pagination page={page} setPage={setPage} totalPages={Math.ceil(totalAccounts / limit)} />
      </div>
    </div>
  );
};

export default UserDashboard;
