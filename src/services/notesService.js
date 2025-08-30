import api from "./api"; // Our Axios instance withCredentials=true

// Fetch notes for the logged-in user with optional pagination and search
export const getMyNotes = async ({ page = 1, limit = 10, q } = {}) => {
  const params = { page, limit };
  if (q && String(q).trim()) params.q = q.trim();
  const response = await api.get("/mongo/get-all-notes", { params });
  return response.data; // { error, notes, page, limit, total, totalPages, message }
};

// Fetch a single note by ID
export const getNoteById = async (noteId) => {
  const response = await api.get(`/mongo/get-note/${noteId}`);
  return response.data;
};

// Create a new note
export const createNote = async (noteData) => {
  const response = await api.post("/mongo/add-note", noteData);
  return response.data;
};

// Update an existing note
export const updateNote = async (noteId, updatedData) => {
  const response = await api.put(`/mongo/edit-note/${noteId}`, updatedData);
  return response.data;
};

// Delete a note
export const deleteNote = async (noteId) => {
  const response = await api.delete(`/mongo/delete-note/${noteId}`);
  return response.data;
};

// Search notes by title, content, or tags
// Backward-compatible search wrapper; now delegates to paginated endpoint
export const searchNotes = async (query, { page = 1, limit = 10 } = {}) => {
  return getMyNotes({ page, limit, q: query });
};

// Update note visibility (publish/unpublish)
export const updateNoteVisibility = async (noteId, isPublic) => {
  const response = await api.put(`/mongo/notes/${noteId}/visibility`, {
    isPublic,
  });
  return response.data;
};
