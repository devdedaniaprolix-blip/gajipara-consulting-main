import { useEffect, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { Link } from "react-router-dom";

function DemoCard({ demo }) {
  const editor = useCreateBlockNote({
    initialContent:
      demo.content && demo.content.length > 0
        ? demo.content
        : [{ type: "paragraph", content: [] }],
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 mb-6">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {demo.title}
      </h2>

      {/* Date */}
      <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
        <i className="fa fa-calendar"></i>
        {new Date(demo.createdAt).toLocaleDateString()}
      </p>

      {/* Content */}
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
        <BlockNoteView
          editor={editor}
          editable={false}
          theme="light"
          formattingToolbar={false}
          slashMenu={false}
        />
      </div>
    </div>
  );
}

export default function ViewDemo() {
  const [demos, setDemos] = useState([]);

  const loadDemos = () => {
    fetch("http://localhost:1337/api/demos")
      .then((res) => res.json())
      .then((data) => {
        setDemos(data?.data || []);
      });
  };

  useEffect(() => {
    loadDemos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Demos
          </h1>

        </div>

        {/* Demo List */}
        <div>
          {demos.map((demo) => (
            <DemoCard
              key={demo.documentId}
              demo={demo}
            />
          ))}
        </div>

      </div>
    </div>
  );
}