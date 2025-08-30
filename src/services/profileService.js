import api from "./api"; // Our Axios instance withCredentials=true

// Fetch public profile by user ID
export const getPublicProfile = async (userId) => {
  const response = await api.get(`/mongo/public-profile/${userId}`);
  return response.data;
};

// Fetch public notes for a user with pagination
export const getPublicNotes = async (userId, { page = 1, limit = 10 } = {}) => {
  const response = await api.get(`/mongo/public-notes/${userId}`, {
    params: { page, limit },
  });
  return response.data; // { error, notes, page, limit, total, totalPages }
};
