import axios from "axios";

export const addBankService = async (bankData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    const response = await axios.post("http://localhost:5000/api/v1/bank", bankData, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllBanksService = async (limit, page, filters) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  
  const queryParams = new URLSearchParams({
    limit,
    page,
    // ...filters,
  }).toString();
  // const query = `limit=${limit}&page=${page}`;
  const response = await axios.get(`http://localhost:5000/api/v1/bank?${queryParams}`, {
    headers: { auth: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteBankService = async (bankId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`http://localhost:5000/api/v1/bank/${bankId}`, {
    headers: { auth: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBankService = async (bankId, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `http://localhost:5000/api/v1/bank/${bankId}`,
    data,
    { headers: { auth: `Bearer ${token}` } }
  );
  return response.data;
};
