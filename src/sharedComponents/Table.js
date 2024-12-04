import React from "react";
import { TableDataFilter } from "./TableDataFilter";

const Table = ({ data = [], requiredColumns = [], isAdmin, onView, onEdit, onDelete }) => {
  // console.log("isadmin is", isAdmin);
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-700">No data found</div>;
  }

  const filteredData = TableDataFilter(data, requiredColumns);
  const headers = Object.keys(filteredData[0]);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-purple-800 text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 border border-gray-200">
                {header.toUpperCase()}
              </th>
            ))}
            <th className="px-4 py-2 border border-gray-200">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-gray-800 bg-white hover:bg-gray-100">
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 border border-gray-200 text-center">
                  {cell}
                </td>
              ))}
              <td className="px-4 py-2 border border-gray-200 flex justify-center gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => onView(row.id)}
                >
                  {isAdmin ? "View" : "Balance"}
                </button>
                <button
                  className={`px-3 py-1 ${
                    isAdmin ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  } text-white rounded`}
                  onClick={() => onEdit(row)}
                >
                  {isAdmin ? "Edit" : "Passbook"}
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => onDelete(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
