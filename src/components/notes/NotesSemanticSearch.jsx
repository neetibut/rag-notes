import { useState } from "react";
import api from "../../services/api";

const NotesSemanticSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await api.post("/mongo/search-notes", { query });
      setResults(response.data.results || []);
    } catch (err) {
      console.error("Error performing search:", err);
      setError("Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[6px_6px_0_0_#000] mt-10">
      <h2 className="text-2xl font-extrabold text-black mb-6 border-2 border-black rounded-lg bg-pink-200 py-2 px-2 shadow-[2px_2px_0_0_#000] text-center">Ask Questions About Notes</h2>
      <form onSubmit={handleSearch} className="space-y-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about the notes..."
          className="w-full p-3 border-4 border-black rounded-lg bg-yellow-50 shadow-[2px_2px_0_0_#000] font-mono text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-300 border-4 border-black text-black font-extrabold px-6 py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-blue-400 transition-all duration-200 w-full"
        >
          {loading ? "Searching..." : "Ask"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 font-mono">{error}</p>}

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-extrabold mb-4 text-black">Search Results:</h3>
          <ul className="space-y-4">
            {results.map((note, index) => (
              <li
                key={note._id || index}
                className="bg-yellow-100 border-2 border-black rounded-lg p-4 shadow-[1px_1px_0_0_#000]"
              >
                <h4 className="font-bold text-black">{note.title}</h4>
                <p className="text-black font-mono">{note.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotesSemanticSearch;
