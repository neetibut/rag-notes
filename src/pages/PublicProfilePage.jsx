import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile, getPublicNotes } from "../services/profileService";
import NotesChat from "../components/notes/NotesChat";

const PublicProfilePage = () => {
  const { userId } = useParams(); // Get user ID from the URL
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // pagination state for public notes
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchPublicNotes = useCallback(async (nextPage = page, nextLimit = pageSize) => {
    try {
      const notesData = await getPublicNotes(userId, { page: nextPage, limit: nextLimit });
      setNotes(notesData.notes || []);
      if (typeof notesData.total === "number") setTotal(notesData.total);
      if (typeof notesData.page === "number") setPage(notesData.page);
      if (typeof notesData.limit === "number") setPageSize(notesData.limit);
    } catch (err) {
      console.error("Failed to fetch public notes:", err);
      setError("Failed to load public notes.");
    } finally {
      setLoading(false);
    }
  }, [userId, page, pageSize]);

  useEffect(() => {
    const fetchProfileAndNotes = async () => {
      try {
        const profileData = await getPublicProfile(userId);
        setProfile(profileData.user);
        await fetchPublicNotes(1, pageSize);
      } catch (err) {
        console.error("Failed to fetch public profile or notes:", err);
        setError("Failed to load profile or notes.");
      }
    };

    fetchProfileAndNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const handlePrev = () => {
    if (page > 1) fetchPublicNotes(page - 1, pageSize);
  };
  const handleNext = () => {
    if (page < totalPages) fetchPublicNotes(page + 1, pageSize);
  };
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value) || 10;
    setPageSize(newSize);
    fetchPublicNotes(1, newSize);
  };

  if (loading)
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen  bg-blue-200 ">
      <div className="min-h-screen max-w-5xl mx-auto px-6 py-10 bg-blue-200 ">
        <h1 className="text-4xl font-extrabold text-black mb-6 border-4 border-black rounded-lg bg-green-200 py-4  text-center">
          {profile.fullName}'s Public Profile
        </h1>
        <p className="text-black font-mono mb-8  py-2 px-4">
          Email: {profile.email}
        </p>
        <NotesChat userId={userId} />
        <h2 className="text-2xl font-extrabold text-black mb-6 border-4 border-black rounded-lg bg-pink-200 py-2 px-2 text-center">
          Public Notes
        </h2>
        {notes.length === 0 ? (
          <p className="text-black font-mono text-lg">
            No public notes available.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] transition-all duration-200"
                >
                  <h3 className="text-2xl font-extrabold mb-3 text-black border-2 border-black rounded-lg bg-pink-200 px-2 py-1 shadow-[2px_2px_0_0_#000] truncate">
                    {note.title}
                  </h3>
                  <p className="text-black text-base font-mono bg-yellow-50 border-2 border-black rounded-lg px-2 py-2 mt-2 shadow-[1px_1px_0_0_#000] line-clamp-4 overflow-y-auto">
                    {note.content}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-200 border-2 border-black text-black text-xs font-bold px-3 py-1 rounded-full shadow-[1px_1px_0_0_#000] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
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
                disabled={page >= Math.max(1, Math.ceil((total || 0) / pageSize))}
                className={`px-4 py-2 border-4 border-black rounded-lg shadow-[2px_2px_0_0_#000] font-bold ${
                  page >= Math.max(1, Math.ceil((total || 0) / pageSize))
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Next
              </button>
              <label className="ml-4 text-black font-mono">
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
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;
