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
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4">Ask Questions About Notes</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about the notes..."
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Ask"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Search Results:</h3>
          <ul className="space-y-4">
            {results.map((note, index) => (
              <li
                key={note._id || index}
                className="border p-4 rounded-md shadow-sm"
              >
                <h4 className="font-bold text-gray-800">{note.title}</h4>
                <p className="text-gray-600">{note.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotesSemanticSearch;
