import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlockNoteEditor from "../../components/BlockNoteEditor";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);

  const navigate = useNavigate();

  const saveArticle = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            title,
            content,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save article");
      }

      alert("Article Successfully Created");

      setTitle("");
      setContent(null);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error saving article");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-plus"></i>
            Create Article
          </h1>

          <Link
            to="/"
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm transition"
          >
            <i className="fa fa-arrow-left"></i>
            View Articles
          </Link>
        </div>

        {/* Card */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* Title */}

          <div className="mb-5">
            <label className="text-gray-600 font-medium block mb-2">
              Article Title
            </label>

            <input
              type="text"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Content */}

          <div className="mb-6">
            <label className="text-gray-600 font-medium block mb-2">
              Article Content
            </label>

            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <BlockNoteEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* Save Button */}

          <div className="flex justify-end">
            <button
              onClick={saveArticle}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition"
            >
              <i className="fa-solid fa-save"></i>
              Save Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
