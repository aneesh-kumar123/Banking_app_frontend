// import axios from "axios";
import { handleAxiosError } from "../../utils/errors/ErrorHandler";
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

export const getKycService = async () => {
  try {

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    // const userId = jwtDecode(token.split(" ")[1]).userId;
    console.log("userId: ", userId);
    
    const response = await axios.get(`http://localhost:5000/api/v1/user/${userId}/kyc`, {
      headers: {
        auth: `Bearer ${token}`,
      }, 
    });

    return response;
  } catch (error) {
    console.error('Error fetching KYC:', error);
    throw new AxiosError(error);  
  }
};

export const submitKycService = async (aadhar,pan) => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const response = await axios.put(`http://localhost:5000/api/v1/user/${userId}/kyc`, {aadhar:aadhar,pan:pan}, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error updating KYC:', error);
    throw new AxiosError(error);   
  }
};

export const getKycRequestsService = async ({ page, limit }) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get('http://localhost:5000/api/v1/kyc-request', {
      headers: {
        auth: `Bearer ${token}`,
      },
      params: { page, limit },  
    });
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error fetching KYC requests:', error);
    throw new AxiosError(error.message, error.config, error.code, error.request, error.response);  
  }
};


export const approveOrRejectKycRequestService = async (userId,status,note) => {
  try {
    const token = localStorage.getItem('token');
    console.log(status, " ", note)
    
    const response = await axios.put(`http://localhost:5000/api/v1/kyc-request`,{userId:userId,status:status,adminNote:note}, {
      headers: {
        auth: `Bearer ${token}`,
      },  
    });

    return response;
  } catch (error) {
    console.error('Error fetching KYC:', error);
    throw new AxiosError(error);  
  }
};