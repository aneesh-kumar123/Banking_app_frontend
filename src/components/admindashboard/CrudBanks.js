import React, { useState, useEffect } from "react";
import {
  getAllBanksService,deleteBankService,updateBankService,addBankService
  
} from "../../services/admin/bankService";
import Table from "../../sharedComponents/Table";
import Pagination from "../../sharedComponents/Pagination";
import SizeBar from "../../sharedComponents/SizeBar";
import { showErrorToast, showSuccessToast } from "../../utils/helpers/toast";
import { useNavigate } from "react-router-dom";

const CrudBanks = () => {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalBanks, setTotalBanks] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    bankName: "",
    abbreviation: "",
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Bank Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deleteBankId, setDeleteBankId] = useState(null);
  const [editBank, setEditBank] = useState(null);
  const [newBank, setNewBank] = useState({ bankName: "", abbreviation: "" }); 

  const fetchBanks = async () => {
    try {
      
      const response = await getAllBanksService(limit, page, searchFilters);
      console.log("the response is", response);
      if (response && response.data) {
        setBanks(response.data);
        setTotalBanks(response.total);
      } else {
        setBanks([]);
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch banks");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBankService(newBank);
      showSuccessToast("Bank added successfully!");
      setIsAddModalOpen(false);
      setNewBank({ bankName: "", abbreviation: "" });
      fetchBanks();
    } catch (error) {
      showErrorToast(error.message || "Failed to add bank.");
    }
  };

  const resetFilters = () => {
    setSearchFilters({ bankName: "", abbreviation: "" });
    fetchBanks();
  };

  const handleSearch = () => {
    fetchBanks();
  };

  const handleDelete = async () => {
    try {
      await deleteBankService(deleteBankId);
      showSuccessToast("Bank deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchBanks();
    } catch (error) {
      showErrorToast(error.message || "Failed to delete bank.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const bankId = editBank?.id;
      if (!bankId) throw new Error("Bank ID is undefined.");

      const updatedFields = Object.keys(editBank).filter(
        (key) =>
          editBank[key] !== banks.find((bank) => bank.id === bankId)?.[key]
      );

      for (const parameter of updatedFields) {
        const value = editBank[parameter];
        await updateBankService(bankId, { parameter, value });
      }

      showSuccessToast("Bank updated successfully!");
      setIsUpdateModalOpen(false);
      fetchBanks();
    } catch (error) {
      showErrorToast(error.message || "Failed to update bank.");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [limit, page]);

  const totalPages = Math.ceil(totalBanks / limit);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Banks</h1>

      <div className="bg-white rounded-lg p-4 shadow-lg">
        {/* Search Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Bank Name"
            className="px-4 py-2 border rounded-md w-1/3 text-black"
            value={searchFilters.bankName}
            onChange={(e) =>
              setSearchFilters({ ...searchFilters, bankName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Abbreviation"
            className="px-4 py-2 border rounded-md w-1/3 text-black"
            value={searchFilters.abbreviation}
            onChange={(e) =>
              setSearchFilters({ ...searchFilters, abbreviation: e.target.value })
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
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add New Bank
          </button>
        </div>

        {/* Table */}
        <Table
          data={banks}
          requiredColumns={["id", "bankName", "abbreviation"]}
          isAdmin={true}
          onView={(id) => {
            console.log("View bank ID:", id); // Implement View functionality
          }}
          onEdit={(bank) => {
            setEditBank(bank);
            setIsUpdateModalOpen(true);
          }}
          onDelete={(id) => {
            setDeleteBankId(id);
            setIsDeleteModalOpen(true);
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
            <p>Are you sure you want to delete this bank?</p>
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
            <h2 className="text-xl font-semibold mb-4">Update Bank</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={editBank?.bankName || ""}
                  onChange={(e) =>
                    setEditBank({ ...editBank, bankName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Abbreviation
                </label>
                <input
                  type="text"
                  value={editBank?.abbreviation || ""}
                  onChange={(e) =>
                    setEditBank({ ...editBank, abbreviation: e.target.value })
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

        {/* Add Bank Modal */}
        {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Bank</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={newBank.bankName}
                  onChange={(e) =>
                    setNewBank({ ...newBank, bankName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Abbreviation
                </label>
                <input
                  type="text"
                  value={newBank.abbreviation}
                  onChange={(e) =>
                    setNewBank({ ...newBank, abbreviation: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Add
                </button>
                </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default CrudBanks;
