import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function BlockNoteEditor({ value, onChange }) {

  const initialBlocks =
    value && value.length > 0
      ? value
      : [
          {
            type: "paragraph",
            content: [],
          },
        ];

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  const handleDrop = async (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    // LOCAL FILE DRAG DROP
    if (files && files.length > 0) {
      const file = files[0];

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
          editor.insertBlocks(
            [
              {
                type: "image",
                props: {
                  url: reader.result,
                },
              },
            ],
            editor.getTextCursorPosition().block
          );
        };

        reader.readAsDataURL(file);
        return;
      }
    }

    // WEBSITE IMAGE DRAG DROP
    const url = event.dataTransfer.getData("text/uri-list");

    if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
      editor.insertBlocks(
        [
          {
            type: "image",
            props: {
              url: url,
            },
          },
        ],
        editor.getTextCursorPosition().block
      );
    }
  };

  return (
    <div
      className="border border-gray-200 rounded-md bg-gray-50 p-3 hover:border-indigo-400 transition"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <BlockNoteView
        editor={editor}
        formattingToolbar={true}
        slashMenu={true}
        filePanel={true}
        emojiPicker={true}
        onChange={() => onChange(editor.document)}
        className="min-h-[350px] bg-white rounded-md p-4 text-black"
      />
    </div>
  );
}