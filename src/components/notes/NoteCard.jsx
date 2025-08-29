import { Link } from "react-router-dom";
import { useState } from "react";
import { updateNoteVisibility } from "../../services/notesService";

const NoteCard = ({ note, onDelete }) => {
  const [isPublic, setIsPublic] = useState(note.isPublic); // Local state for visibility

  const handleToggleVisibility = async () => {
    try {
      const updatedNote = await updateNoteVisibility(note._id, !isPublic);
      setIsPublic(updatedNote.note.isPublic); // Update local state to trigger re-render
    } catch (err) {
      console.error("Failed to update note visibility:", err);
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-2xl p-6 flex flex-col justify-between shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] transition-all duration-200">
      <div>
        {/* Pinned Icon
        {note.isPinned && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-600 text-base font-extrabold border-2 border-black rounded px-2 py-1 bg-yellow-200 ">📌 Pinned</span>
          </div>
        )} */}

        {/* Title */}
        <h2 className="text-2xl font-extrabold mb-3 text-black border-2 border-black rounded-lg bg-pink-200 px-2 py-1  truncate">
          {note.title}
        </h2>

        {/* Content */}
        <p className="text-black text-base font-mono bg-yellow-50 border-2 border-black rounded-lg px-2 py-2 mt-2  line-clamp-4 overflow-y-auto">{note.content}</p>
 <div className="mt-4 flex flex-wrap gap-2">
         
          
              {note.isPinned &&  <span
      
              className="bg-yellow-200 border-2 border-black text-black text-xs font-bold px-3 py-1 rounded-full font-mono"
            >📌 Pinned</span>}
           
      
        </div>
        
        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-200 border-2 border-black text-black text-xs font-bold px-3 py-1 rounded-full font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 text-xs text-black font-mono">
        {/* Created Date */}
        <span className=" px-2 py-1">Created on: {new Date(note.createdOn).toLocaleDateString()}</span>

        {/* Actions */}
        <div className="flex-col space-x-2 space-y-2 items-center">
          <div className="flex gap-x-1">
          <Link
            to={`/notes/${note._id}`}
            className="font-bold text-blue-700 bg-white border-2 border-black rounded px-2 py-1 shadow-[1px_1px_0_0_#000] hover:bg-blue-200 transition"
          >
            View
          </Link>
          <Link
            to={`/notes/${note._id}`}
            className="font-bold text-green-700 bg-white border-2 border-black rounded px-2 py-1 shadow-[1px_1px_0_0_#000] hover:bg-green-200 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(note._id)}
            className="cursor-pointer font-bold text-red-700 bg-white border-2 border-black rounded px-2 py-1 shadow-[1px_1px_0_0_#000] hover:bg-red-200 transition"
          >
            Delete
          </button>
</div>
          <button
            onClick={handleToggleVisibility}
            className={`cursor-pointer font-bold border-2 border-black rounded px-2 py-1 shadow-[1px_1px_0_0_#000] transition ${isPublic ? 'bg-yellow-200 text-yellow-700 hover:bg-yellow-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {isPublic ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
