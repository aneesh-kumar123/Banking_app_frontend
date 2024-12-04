import React, { useState, useEffect } from "react";
import { getAllUsersService } from "../../services/admin/adminService";
import Table from "../../sharedComponents/Table";
import Pagination from "../../sharedComponents/Pagination";
import SizeBar from "../../sharedComponents/SizeBar";
import { showErrorToast } from "../../utils/helpers/toast";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState(5); // Default limit
  const [page, setPage] = useState(1); // Default page
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersService(limit, page);
      if (response && response.data) {
        const sequentialUsers = response.data.map((user, index) => ({
          ...user,
          id: (page - 1) * limit + index + 1, 
          // ID = (1 - 1) * 5 + (index + 1) = 1, 2, 3, 4, 5
          // ID = (2 - 1) * 5 + (index + 1) = 6, 7, 8, 9, 10
        }));
        setUsers(sequentialUsers);
        setTotalUsers(response.total);
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [limit, page]); // Refetch users when limit or page changes

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      <div className="bg-white rounded-lg p-4 shadow-lg">
        <Table data={users} />
        <div className="flex justify-between items-center mt-4">
          <SizeBar setLimit={setLimit} />
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default GetAllUsers;
