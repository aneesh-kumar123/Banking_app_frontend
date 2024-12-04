import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../sharedComponents/kyc/Table";
import { getKycRequestsService, approveOrRejectKycRequestService } from '../../services/kyc/kycService';
import {  updateUserService } from "../../services/admin/adminService";
// import Pagination from "../../sharedComponents/Pagination";
// import PageSize from "../../sharedComponents/PageSize/PageSize";
// import getKycRequestsService from "../../services/kyc/getKycRequestsService"; 
// import approveOrRejectKycRequestService from "../../services/kyc/approveOrRejectKycRequestService"; 

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const KycRequests = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notes, setNotes] = useState({});

  const fetchKycRequests = async () => {
    try {
      const response = await getKycRequestsService(currentPage, pageSize);
      if (response.data) {
        const filteredData = response.data.map((row) => ({
          userId: row.userId,
          status: row.status,
          aadhar: (
            <button
              className="view-document-button"
              onClick={() => handleViewDocument(row.aadhar, 'Aadhar')}
            >
              View Aadhar
            </button>
          ),
          pan: (
            <button
              className="view-document-button"
              onClick={() => handleViewDocument(row.pan, 'PAN')}
            >
              View PAN
            </button>
          ),
          approve: (
            <button
              onClick={() => handleApprove(row.userId)}
              className="approve-button"
            >
              Approve
            </button>
          ),
          reject: (
            <button
              onClick={() => handleReject(row.userId, notes[row.userId])}
              className="reject-button"
            >
              Reject
            </button>
          ),
          note: (
            <div className="note-container">
              <input
                type="text"
                placeholder="Add rejection note"
                onChange={(e) => handleNoteChange(row.userId, e.target.value)}
                className="rejection-input"
              />
            </div>
          ),
        }));

        setKycRequests(filteredData);
        setHeaders(["userId", "status", "aadhar", "pan", "approve", "reject", "note"]);
        const totalCount = response.headers["x-total-count"] || 0;
        setTotalPages(Math.ceil(totalCount / pageSize));
      } else {
        setKycRequests([]);
        setHeaders([]);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Error fetching KYC requests. Please try again later.");
    }
  };

  useEffect(() => {
    fetchKycRequests();
  }, [currentPage, pageSize]);

  const handleViewDocument = (url, type) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.error(`${type} document URL is missing.`);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveOrRejectKycRequestService(userId, "approved", null);
      // await updateUserService(userId, { parameter, value });
      const parameter = "kycStatus";
    const value = "verified"; 

    // Update the user's KYC status
    await updateUserService(userId, { parameter, value });
      // await updateUserService(userId, { kycStatus: "verified" });
      toast.success("KYC Request Approved!");
      fetchKycRequests();
    } catch (error) {
      toast.error("Failed to approve KYC request. Please try again.");
    }
  };

  const handleReject = async (userId, note) => {
    if (!note || !note.trim()) {
      note = "No reason provided";
    }
    try {
      await approveOrRejectKycRequestService(userId, "rejected", note);
      const parameter = "kycStatus";
    const value = "rejected"; 

    await updateUserService(userId, { parameter, value });
    
      toast.success("KYC Request Rejected!");
      fetchKycRequests();
    } catch (error) {
      toast.error("Failed to reject KYC request. Please try again.");
    }
  };

  const handleNoteChange = (userId, value) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [userId]: value,
    }));
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="admin-kyc-requests-container">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Manage KYC Requests</h1>

      {/* <PageSize pageSize={pageSize} onPageSizeChange={handlePageSizeChange} /> */}

      <div className="table-container">
        {kycRequests.length > 0 ? (
          <Table headers={headers} tableData={kycRequests} />
        ) : (
          <div className="no-data">No KYC requests found</div>
        )}
      </div>

      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      /> */}
    </div>
  );
};

export default KycRequests;
