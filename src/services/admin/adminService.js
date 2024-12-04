import axios from "axios";
import { handleAxiosError } from "../../utils/errors/ErrorHandler";

export const addUserService = async (userData) => {
  try {

    console.log("userData is", userData);
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    const response = await axios.post("http://localhost:5000/api/v1/user/user", userData,{
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    handleAxiosError(error); 
    throw error;
  }
};


export const getAllUsersService = async (limit, page, filters) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const queryParams = new URLSearchParams({
      limit,
      page,
      ...filters,
    }).toString();

    const response = await axios.get(
      `http://localhost:5000/api/v1/user?${queryParams}`,
      {
        headers: { auth: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};


export const deleteUserService = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:5000/api/v1/user/${userId}`,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};


export const updateUserService = async (userId, userData) => {
  try {
    
    console.log("USerId is", userId);
    console.log("userData is", userData)
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:5000/api/v1/user/${userId}`,
      userData,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error; // Let error handling in `CrudUsers` handle it
  }
};


export const getUserByIdService = async (userId, query = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:5000/api/v1/user/${userId}`,
      {
        // params: query, // Pass query params like { include: "account" }
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user.");
  }
};


