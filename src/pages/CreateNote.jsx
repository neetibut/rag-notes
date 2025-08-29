import { useState } from "react";
import { createNote } from "../services/notesService";

const CreateNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); // New state for tags
  const [isPinned, setIsPinned] = useState(false); // New state for pin state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newNote = await createNote({
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert tags string to array
        isPinned,
      });
      setTitle("");
      setContent("");
      setTags("");
      setIsPinned(false);
      if (onNoteAdded) onNoteAdded(newNote); // Trigger re-fetch or update notes
    } catch (err) {
      console.error("Failed to create note:", err);
      setError("Failed to create note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-6 bg-yellow-100 border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000]">
      <h1 className="text-3xl font-extrabold text-black mb-8 border-4 border-black rounded-lg bg-pink-200 py-3 shadow-[4px_4px_0_0_#000] text-center">
        Create a New Note
      </h1>

      {error && (
        <div className="bg-red-200 text-red-900 border-2 border-black rounded-lg px-4 py-2 mb-4 text-center shadow-[2px_2px_0_0_#000] font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-bold text-black">Title</label>
          <input
            type="text"
            className="w-full p-3 border-4 border-black rounded-lg bg-white shadow-[2px_2px_0_0_#000] focus:ring-2 focus:ring-pink-300 font-mono text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-bold text-black">Content</label>
          <textarea
            className="w-full p-3 border-4 border-black rounded-lg bg-white shadow-[2px_2px_0_0_#000] min-h-[150px] focus:ring-2 focus:ring-pink-300 font-mono text-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-bold text-black">Tags</label>
          <input
            type="text"
            className="w-full p-3 border-4 border-black rounded-lg bg-white shadow-[2px_2px_0_0_#000] focus:ring-2 focus:ring-pink-300 font-mono text-black"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPinned"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="mr-2 border-2 border-black rounded shadow-[1px_1px_0_0_#000]"
          />
          <label htmlFor="isPinned" className="font-bold text-black">
            Pin this note
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-300 border-4 border-black text-black font-extrabold py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-pink-400 transition-all duration-200"
        >
          {loading ? "Saving..." : "Create Note"}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
