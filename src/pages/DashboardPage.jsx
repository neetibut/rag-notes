import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteNote, getMyNotes, searchNotes } from "../services/notesService";
import NoteCard from "../components/notes/NoteCard";
import CreateNote from "./CreateNote";

const DashboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  // pagination state
  const [page, setPage] = useState(() => Math.max(1, parseInt(searchParams.get("page") || "1", 10)));
  const [pageSize, setPageSize] = useState(() => {
    const v = parseInt(searchParams.get("limit") || "5", 10);
    return Number.isNaN(v) ? 5 : v;
  });
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const setURLParams = useCallback((p, l, q) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("limit", String(l));
    if (q && q.trim()) params.set("q", q.trim());
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const fetchNotes = useCallback(
    async (nextPage = page, nextLimit = pageSize, q = searchQuery) => {
      try {
        const data = await getMyNotes({
          page: nextPage,
          limit: nextLimit,
          q: q?.trim() || undefined,
        });
        setNotes(data.notes || []);
        if (typeof data.total === "number") setTotal(data.total);
        if (typeof data.page === "number") setPage(data.page);
        if (typeof data.limit === "number") setPageSize(data.limit);
        // reflect current state in URL
        setURLParams(nextPage, nextLimit, q);
      } catch (err) {
        console.error(err);
        setError("Failed to load notes.");
      } finally {
        setLoadingNotes(false);
      }
    },
  [page, pageSize, searchQuery, setURLParams]
  );

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      fetchNotes(page, pageSize, searchQuery);
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
  setURLParams(1, pageSize, undefined);
  fetchNotes(1, pageSize);
      return;
    }

    try {
      const data = await searchNotes(searchQuery, { page: 1, limit: pageSize });
      setNotes(data.notes || []);
      if (typeof data.total === "number") setTotal(data.total);
      if (typeof data.page === "number") setPage(data.page);
      if (typeof data.limit === "number") setPageSize(data.limit);
  setURLParams(1, pageSize, searchQuery);
    } catch (err) {
      console.error("Failed to search notes:", err);
      setError("Failed to search notes.");
    }
  };

  const handlePrev = () => {
    if (page > 1) fetchNotes(page - 1, pageSize);
  };

  const handleNext = () => {
    if (page < totalPages) fetchNotes(page + 1, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value) || 10;
    setPageSize(newSize);
    fetchNotes(1, newSize);
  };

  useEffect(() => {
    const p = Math.max(1, parseInt(searchParams.get("page") || String(page), 10));
    const lRaw = parseInt(searchParams.get("limit") || String(pageSize), 10);
    const l = Number.isNaN(lRaw) ? pageSize : lRaw;
    const q = searchParams.get("q") || "";
    setPage(p);
    setPageSize(l);
    setSearchQuery(q);
    fetchNotes(p, l, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingNotes)
    return (
      <div className="text-center mt-10 text-xl">Loading user notes...</div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-blue-200">
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
          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              className="cursor-pointer bg-pink-300 border-4 border-black text-black font-extrabold px-6 py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-pink-400 transition-all duration-200"
            >
              Search
            </button>
            <label className="ml-auto text-black font-mono">
              Page size:
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="ml-2 p-2 border-2 border-black rounded bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
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
          <p className="text-black font-mono text-lg">
            You have no notes yet. Start writing!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                disabled={page <= 1}
                className={`px-4 py-2 border-4 border-black rounded-lg shadow-[2px_2px_0_0_#000] font-bold ${
                  page <= 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Prev
              </button>
              <span className="text-black font-mono">
                Page {page} of {Math.max(1, Math.ceil((total || 0) / pageSize))}
              </span>
              <button
                onClick={handleNext}
                disabled={
                  page >= Math.max(1, Math.ceil((total || 0) / pageSize))
                }
                className={`px-4 py-2 border-4 border-black rounded-lg shadow-[2px_2px_0_0_#000] font-bold ${
                  page >= Math.max(1, Math.ceil((total || 0) / pageSize))
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
