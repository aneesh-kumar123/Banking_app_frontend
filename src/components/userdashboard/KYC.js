import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKycService, submitKycService } from '../../services/kyc/kycService';
// import {updateUserService} from '../../services/admin/adminService';
import photoUrlService from '../../utils/helpers/photoUrlService';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const KYC = () => {
  const [kycData, setKycData] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [panPhoto, setPanPhoto] = useState(null);
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchKYC = async () => {
      try {
        const response = await getKycService();
        setKycData(response.data);
        setStatus(response.data.status);
        setAdminNote(response.data.adminNote || '');
      } catch (error) {
        console.error("Error fetching KYC:", error);
        toast.error('Could not fetch KYC data.');
      }
    };

    fetchKYC();
  }, []);

  const handleFileChange = (e, type) => {
    if (type === 'aadhar') {
      setAadharPhoto(e.target.files[0]);
    } else if (type === 'pan') {
      setPanPhoto(e.target.files[0]);
    }
  };

  const handleUploadDocuments = async (e) => {
    e.preventDefault();

    if (!aadharPhoto || !panPhoto) {
      toast.error('Both Aadhar and PAN documents must be uploaded');
      return;
    }

    try {
      const aadharUrl = await photoUrlService(aadharPhoto);
      const panUrl = await photoUrlService(panPhoto);


      await submitKycService(aadharUrl, panUrl);
      // await updateUserService(userId, { kycStatus, Submitted });

      toast.success("KYC documents uploaded successfully!");

      const freshKycData = await getKycService();
      setKycData(freshKycData.data);
      setStatus(freshKycData.data.status);
      setAdminNote(freshKycData.data.adminNote || '');
    } catch (error) {
      console.error("Error uploading KYC documents:", error);
      toast.error("Failed to upload the documents. Please try again.");
    }
  };

  const handleBack = () => {
    navigate('/userdashboard');
  };

  const getButtonText = () => {
    if (status === 'not submitted') return 'Upload Documents';
    else if (status === 'rejected') return 'Upload Your Documents Again';
    else return 'Update Documents';
  };

  const handleViewDocument = (type) => {
    if (type === 'aadhar' && kycData?.aadhar) {
      window.open(kycData.aadhar, '_blank');
    } else if (type === 'pan' && kycData?.pan) {
      window.open(kycData.pan, '_blank');
    } else {
      toast.error(`${type === 'aadhar' ? 'Aadhar' : 'PAN'} document URL is missing.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white p-6">
      <ToastContainer />

      <button
        onClick={handleBack}
        className="bg-white text-purple-600 px-4 py-2 rounded shadow-md hover:bg-purple-100 mb-4"
      >
        Back to Dashboard
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">User KYC</h2>

        <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
          <table className="table-auto w-full mb-6">
            <thead>
              <tr>
                {status && <th className="px-4 py-2 text-left">Status</th>}
                {adminNote && <th className="px-4 py-2 text-left">Note</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {status && <td className="px-4 py-2">{status}</td>}
                {adminNote && <td className="px-4 py-2">{adminNote}</td>}
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mb-6">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              onClick={() => setShowUploadModal(true)}
            >
              {getButtonText()}
            </button>

            {(status === 'submitted' || status === 'approved' || status === 'rejected') && (
              <button
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
                onClick={() => setShowViewModal(true)}
              >
                View Documents
              </button>
            )}
          </div>
        </div>
      </div>

    
      {showUploadModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-96">
            <span
              className="absolute top-0 right-0 p-2 text-black cursor-pointer"
              onClick={() => setShowUploadModal(false)}
            >
              &times;
            </span>
            <h3 className="text-2xl text-black mb-4">{getButtonText()}</h3>
            <form onSubmit={handleUploadDocuments}>
              <div className="mb-4">
                <label htmlFor="aadhar" className="block text-black mb-2">Upload Aadhar Card:</label>
                <input
                  type="file"
                  id="aadhar"
                  onChange={(e) => handleFileChange(e, 'aadhar')}
                  accept="image/*"
                  required
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pan" className="block text-black mb-2">Upload PAN Card:</label>
                <input
                  type="file"
                  id="pan"
                  onChange={(e) => handleFileChange(e, 'pan')}
                  accept="image/*"
                  required
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  // onClick={() => setShowUploadModal(false)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 w-full"
                >
                  {getButtonText()}
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 w-full"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      {showViewModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 w-96">
            <span
              className="absolute top-0 right-0 p-2 text-black cursor-pointer"
              onClick={() => setShowViewModal(false)}
            >
              &times;
            </span>
            <h3 className="text-2xl text-black mb-4">View Documents</h3>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg mb-4 w-full hover:bg-blue-700"
              onClick={() => handleViewDocument('aadhar')}
            >
              View Aadhar Document
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700"
              onClick={() => handleViewDocument('pan')}
            >
              View PAN Document
            </button>
            <button
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 mt-4 w-full"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYC;
