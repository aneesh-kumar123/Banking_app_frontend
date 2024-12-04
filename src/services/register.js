import axios from "axios";
import { handleAxiosError } from "../utils/errors/ErrorHandler";

export const RegisterUser = async (formData) => {
  try {
    // Determine the endpoint dynamically based on isAdmin value
    const endpoint =
      formData.isAdmin === true
        ? "http://localhost:5000/api/v1/user/admin" // Admin registration
        : "http://localhost:5000/api/v1/user/user"; // User registration

    // Make the POST request to the appropriate endpoint
    const response = await axios.post(endpoint, formData);
    return response.data; // Return response data on success
  } catch (error) {
    // Use centralized error handling
    handleAxiosError(error);

    // Rethrow the error for further handling in the component
    throw error;
  }
};
