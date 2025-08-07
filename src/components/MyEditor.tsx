// components/MyEditor.tsx
import { useEffect, useRef, useState } from "react";

interface MyEditorProps {
  onChange?: (html: string) => void;
}

const MyEditor: React.FC<MyEditorProps> = ({ onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        document.execCommand("bold");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatText = (command: string) => {
    document.execCommand(command);
  };

  const handleInput = () => {
    const newHtml = editorRef.current?.innerHTML || "";
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  return (
    <div className="border rounded p-2">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => formatText("bold")}
          className="border px-2 py-1 rounded hover:bg-gray-200"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          className="border px-2 py-1 rounded hover:bg-gray-200"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => formatText("insertUnorderedList")}
          className="border px-2 py-1 rounded hover:bg-gray-200"
        >
          • Bullet
        </button>
        <button
          type="button"
          onClick={() => formatText("insertOrderedList")}
          className="border px-2 py-1 rounded hover:bg-gray-200"
        >
          1. Ordered
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[120px] border p-2 rounded outline-none"
        suppressContentEditableWarning={true}
      ></div>
    </div>
  );
};

export default MyEditor;
