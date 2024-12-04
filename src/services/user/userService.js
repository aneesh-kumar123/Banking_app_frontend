import axios from "axios";
import { handleAxiosError } from "../../utils/errors/ErrorHandler";

/**
 * Fetch all accounts for a specific user.
 * @param {string} userId - The user ID whose accounts are to be fetched.
 * @param {number} limit - The number of results to fetch per page.
 * @param {number} page - The current page number.
 * @param {object} filters - Additional filters such as account ID or bank ID.
 * @returns {object} - An object containing the count and rows of accounts.
 */
export const getAllAccountsService = async (userId, limit = 5, page = 1, filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const queryParams = new URLSearchParams({
      limit,
      page,
      ...filters, // Include additional filters
    }).toString();

    const response = await axios.get(
      `http://localhost:5000/api/v1/user/${userId}/account?${queryParams}`,
      {
        headers: { auth: `Bearer ${token}` }, // Include token in the headers
      }
    );

    return response.data; // Return the API response
  } catch (error) {
    handleAxiosError(error); // Handle API errors
    throw error; // Re-throw the error for further handling
  }
};
