import { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

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
    <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[6px_6px_0_0_#000] my-10">
      <h2 className="text-2xl font-extrabold text-black mb-6 border-4 border-black rounded-lg bg-pink-200 py-2 px-2 text-center">
        Ask a Question About Notes
      </h2>
      <form onSubmit={handleAskQuestion} className="space-y-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the notes..."
          className="w-full p-3 border-4 border-black rounded-lg bg-yellow-50 shadow-[2px_2px_0_0_#000] font-mono text-black"
          required
        />
        <Link
          type="submit"
          disabled={loading}
          className="bg-blue-300 border-4 border-black text-black font-extrabold px-6 py-3 rounded-lg shadow-[2px_2px_0_0_#000] hover:bg-blue-400 transition-all duration-200 w-full"
        >
          {loading ? "Asking..." : "Ask"}
        </Link>
      </form>

      {error && <p className="text-red-500 mt-4 font-mono">{error}</p>}

      {answer && (
        <div className="mt-8">
          <h3 className="text-lg font-extrabold mb-4 text-black">
            AI's Answer:
          </h3>
          <p className="text-black bg-yellow-100 border-2 border-black rounded-lg p-4 shadow-[1px_1px_0_0_#000] font-mono">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesChat;
