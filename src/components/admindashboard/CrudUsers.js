import React, { useState, useEffect } from "react";
import { addUserService, getAllUsersService, deleteUserService, updateUserService, getUserByIdService } from "../../services/admin/adminService";
import Table from "../../sharedComponents/Table";
import Pagination from "../../sharedComponents/Pagination";
import SizeBar from "../../sharedComponents/SizeBar";
import { showErrorToast, showSuccessToast } from "../../utils/helpers/toast";
import { useNavigate } from "react-router-dom";

const CrudUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    firstName: "",
    lastName: "",
    username: "",
    // age: "",
  });

  // Modal state for delete and update
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editUser, setEditUser] = useState(null); // User to edit

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null); // User details to display

  //add user
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // Modal open/close state
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
  }); // New user data



  const handleKycRequest = () => {
    navigate('/admindashboard/kyc-requests'); 
  };






  const fetchUsers = async () => {
    try {
      const response = await getAllUsersService(limit, page, searchFilters);
      if (response && response.data) {
        setUsers(response.data);
        setTotalUsers(response.total);
      } else {
        setUsers([]);
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch users");
    }
  };

  const resetFilters = () => {
    setSearchFilters({ firstName: "", lastName: "", username: "", age: "" });
    fetchUsers();
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      // Backend API call to add the user
      const response = await addUserService(newUser); // Replace `addUserService` with your API service function

      if (response) {
        showSuccessToast("User added successfully!"); // Display success message
        fetchUsers(); // Refresh the table
        setIsAddUserModalOpen(false); // Close the modal
        setNewUser({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          dateOfBirth: "",
        }); // Reset the form
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to add user."); // Display error message
    }
  };


  const handleDelete = async () => {
    try {
      await deleteUserService(deleteUserId);
      showSuccessToast("User deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      showErrorToast(error.message || "Failed to delete user.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    try {
      // Extract userId from the nested `user` object
      console.log("the whole data is:", editUser.user)

      const userId = editUser?.user?.id;
      if (!userId) {
        throw new Error("User ID is undefined.");
      }

      // Determine updated fields
      const updatedFields = Object.keys(editUser).filter(
        (key) =>
          key !== "user" && // Ignore the `user` key itself
          editUser[key] !== editUser.user?.[key] // Compare with the original value
      );

      // Send each updated field as a separate request (one at a time)
      for (const parameter of updatedFields) {
        const value = editUser[parameter]; // New value
        await updateUserService(userId, { parameter, value });
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
              ...user, ...updatedFields.reduce((acc, key) => {
                acc[key] = editUser[key];
                return acc;
              }, {})
            }
            : user
        )
      );

      showSuccessToast("User updated successfully!");
      setIsUpdateModalOpen(false);
      fetchUsers(); // Refresh the table
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorToast(error.message || "Failed to update user.");
    }
  };


  const handleViewUser = async (id) => {
    try {
      const response = await getUserByIdService(id, { include: "account" }); // Adjust query params as needed
      if (response) {
        console.log("the response we got on view is", response)

        setViewUser(response); // Save user details in state
        setIsViewModalOpen(true); // Open the modal
      } else {
        showErrorToast("Failed to fetch user details.");
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch user details.");
    }
  };


  const updatedUsers = users.map((user) => ({
    ...user,
    age: user.dateOfBirth
      ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
      : "N/A",
  }));






  useEffect(() => {
    fetchUsers();
  }, [limit, page]);

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white rounded-lg p-4 shadow-lg">
      <button
          onClick={handleKycRequest}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 mb-4"
        >
          KYC Requests
        </button>
        {/* Search Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            className="px-4 py-2 border rounded-md w-1/4 text-black"
            value={searchFilters.firstName}
            onChange={(e) =>
              setSearchFilters({ ...searchFilters, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="px-4 py-2 border rounded-md w-1/4 text-black"
            value={searchFilters.lastName}
            onChange={(e) =>
              setSearchFilters({ ...searchFilters, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 border rounded-md w-1/4 text-black"
            value={searchFilters.username}
            onChange={(e) =>
              setSearchFilters({ ...searchFilters, username: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Age"
            className="px-4 py-2 border rounded-md w-1/4 text-black"
            value={searchFilters.age}
            onChange={(e) =>
              setSearchFilters({ ...searchFilters, age: e.target.value })
            }
          />
        </div>

        {/* Search and Reset Buttons */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              All
            </button>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add New User
          </button>
        </div>

        {/* Table */}
        <Table
          data={updatedUsers}
          requiredColumns={["id", "firstName", "lastName", "username", "dateOfBirth", "age", "email"]}
          isAdmin={true}
          onView={handleViewUser}
          onDelete={(id) => {
            setDeleteUserId(id);
            setIsDeleteModalOpen(true);
          }}
          onEdit={(user) => {
            setEditUser({ user });
            setIsUpdateModalOpen(true);
          }}
        />
        <div className="flex justify-between items-center mt-4">
          <SizeBar setLimit={setLimit} />
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={editUser.hasOwnProperty("firstName") ? editUser.firstName : editUser.user?.firstName || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editUser.hasOwnProperty("lastName") ? editUser.lastName : editUser.user?.lastName || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={editUser.hasOwnProperty("username") ? editUser.username : editUser.user?.username || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editUser.hasOwnProperty("email") ? editUser.email : editUser.user?.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editUser.hasOwnProperty("dateOfBirth") ? editUser.dateOfBirth : editUser.user?.dateOfBirth || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, dateOfBirth: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* view update Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-center">
              <div className="bg-purple-200 w-16 h-16 rounded-full flex items-center justify-center text-2xl text-purple-800 shadow-lg">
                <i className="fas fa-user"></i>
              </div>
            </h2>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {viewUser?.username || "User Name"}
              </h3>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">User Information:</h3>
              <p>First Name: {viewUser?.firstName || "N/A"}</p>
              <p>Last Name: {viewUser?.lastName || "N/A"}</p>
              <p>Date of Birth: {viewUser?.dateOfBirth || "N/A"}</p>
              <p>
                Age:{" "}
                {viewUser?.dateOfBirth
                  ? new Date().getFullYear() -
                  new Date(viewUser.dateOfBirth).getFullYear() -
                  (new Date().getMonth() < new Date(viewUser.dateOfBirth).getMonth() ||
                    (new Date().getMonth() === new Date(viewUser.dateOfBirth).getMonth() &&
                      new Date().getDate() < new Date(viewUser.dateOfBirth).getDate())
                    ? 1
                    : 0)
                  : "N/A"}
              </p>

              <p>Email: {viewUser?.email || "N/A"}</p>
              <p>KYC Status: {viewUser?.kycStatus || "Not Verified"}</p>
              <p>Created At: {viewUser?.createdAt || "N/A"}</p>
              <p>Updated At: {viewUser?.updatedAt || "N/A"}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form
              onSubmit={handleAddUserSubmit}
              className="flex flex-col space-y-4"
            >
              {/* First Name */}
              <input
                type="text"
                placeholder="First Name"
                required
                className="border rounded-md px-4 py-2"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
              />

              {/* Last Name */}
              <input
                type="text"
                placeholder="Last Name"
                required
                className="border rounded-md px-4 py-2"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
              />

              {/* Username */}
              <input
                type="text"
                placeholder="Username"
                required
                className="border rounded-md px-4 py-2"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />

              {/* password */}
              <input
                type="password"
                placeholder="Password"
                required
                className="border rounded-md px-4 py-2"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                required
                className="border rounded-md px-4 py-2"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />

              {/* Date of Birth */}
              <input
                type="date"
                placeholder="Date of Birth"
                required
                className="border rounded-md px-4 py-2"
                value={newUser.dateOfBirth}
                onChange={(e) =>
                  setNewUser({ ...newUser, dateOfBirth: e.target.value })
                }
              />

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}








    </div>
  );
};

export default CrudUsers;
