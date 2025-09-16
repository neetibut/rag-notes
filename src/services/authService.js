import api from "./api"; // Axios instance with withCredentials:true

export const loginUser = async (email, password) => {
  const response = await api.post("/mongo/auth/cookie/login", {
    email,
    password,
  });

  // Store token in localStorage as fallback for mobile browsers
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/mongo/auth/logout");

  // Clear localStorage token on logout
  localStorage.removeItem("authToken");

  return response.data;
};

export const signupUser = async ({ fullName, email, password }) => {
  const response = await api.post("/mongo/auth/register", {
    fullName,
    email,
    password,
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/mongo/auth/profile");
  return response.data;
};
