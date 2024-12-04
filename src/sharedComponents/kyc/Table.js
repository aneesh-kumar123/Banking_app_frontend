import React from 'react';
import camelCaseToTitleCase from '../../utils/helpers/camelCaseToTitleCase';

const Table = ({ headers, tableData }) => {
  if (!tableData || tableData.length === 0) {
    return <div className="text-center text-gray-700">No data available</div>;
  }

  const updatedHeaders = headers.map(header => camelCaseToTitleCase(header));

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="w-full table-auto border-collapse bg-white">
        <thead className="bg-purple-700 text-white">
          <tr>
            {updatedHeaders.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 border border-gray-200 text-left text-sm font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {Object.keys(row).map((key, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 border border-gray-200 text-center text-sm"
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
