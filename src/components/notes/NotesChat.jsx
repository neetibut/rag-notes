import { useState } from "react";
import api from "../../services/api";

const NotesChat = ({ userId }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      // Send the question to the backend
      const response = await api.post(`/mongo/answer-question/${userId}`, {
        question,
      });
      setAnswer(response.data.answer || "No answer available.");
    } catch (err) {
      console.error("Error answering question:", err);
      setError("Failed to get an answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-8">
      <h2 className="text-xl font-bold mb-4">Ask a Question About Notes</h2>
      <form onSubmit={handleAskQuestion} className="space-y-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the notes..."
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {answer && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">AI's Answer:</h3>
          <p className="text-gray-800 bg-gray-100 p-4 rounded-md">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default NotesChat;
