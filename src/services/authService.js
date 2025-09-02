import api from "./api"; // Axios instance with withCredentials:true

export const signupUser = async ({ fullName, email, password }) => {
  const response = await api.post("/mongo/auth/register", {
    fullName,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/mongo/auth/cookie/login", {
    email,
    password,
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/mongo/auth/profile");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/mongo/auth/logout");
  return response.data;
};
