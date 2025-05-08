import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile, getPublicNotes } from "../services/profileService";
import NotesChat from "../components/notes/NotesChat";

const PublicProfilePage = () => {
  const { userId } = useParams(); // Get user ID from the URL
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndNotes = async () => {
      try {
        const profileData = await getPublicProfile(userId);

        const notesData = await getPublicNotes(userId);
        setProfile(profileData.user);

        setNotes(notesData.notes);
      } catch (err) {
        console.error("Failed to fetch public profile or notes:", err);
        setError("Failed to load profile or notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndNotes();
  }, [userId]);

  if (loading)
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {profile.fullName}'s Public Profile
      </h1>
      <p className="text-gray-600 mb-6">Email: {profile.email}</p>
      <NotesChat userId={userId} />
      <h2 className="text-2xl font-bold mb-4">Public Notes</h2>
      {notes.length === 0 ? (
        <p className="text-gray-600">No public notes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">
                {note.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-4">
                {note.content}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;
