import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteNote, getMyNotes, searchNotes } from "../services/notesService";
import NoteCard from "../components/notes/NoteCard";
import CreateNote from "./CreateNote";

const DashboardPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchNotes = async () => {
    try {
      const data = await getMyNotes();
      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchNotes();
      return;
    }

    try {
      const data = await searchNotes(searchQuery);
      setNotes(data.notes || []);
    } catch (err) {
      console.error("Failed to search notes:", err);
      setError("Failed to search notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loadingNotes)
    return (
      <div className="text-center mt-10 text-xl">Loading user notes...</div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-10 bg-blue-200">
      <h1 className="text-4xl font-extrabold text-black mb-10 border-4 border-black rounded-lg bg-green-200 py-4  text-center">
        Welcome, {user?.fullName || "User"} 👋
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title, content, or tags"
          className="w-full p-3 border-4 border-black rounded-lg bg-white shadow-[2px_2px_0_0_#000] font-mono text-black"
        />
        <button
          type="submit"
          className="cursor-pointer mt-3 bg-pink-300 border-4 border-black text-black font-extrabold px-6 py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-pink-400 transition-all duration-200"
        >
          Search
        </button>
      </form>

      {/* Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer mb-10 bg-blue-300 border-4 border-black text-black font-extrabold px-6 py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-blue-400 transition-all duration-200"
      >
        Create Note
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-yellow-100 border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000] p-8 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-black bg-white border-2 border-black rounded-full w-8 h-8 flex items-center justify-center shadow-[2px_2px_0_0_#000] hover:bg-pink-200 transition"
            >
              ✖
            </button>
            <CreateNote
              onNoteAdded={() => {
                fetchNotes();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {Array.isArray(notes) && notes.length === 0 ? (
        <p className="text-black font-mono text-lg">You have no notes yet. Start writing!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDeleteNote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
