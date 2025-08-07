import { useRef, useEffect } from "react";

interface RichTextEditorProps {
  onContentChange: (content: string) => void;
}

const RichTextEditor = ({ onContentChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            document.execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            document.execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            document.execCommand("underline");
            break;
          case "z":
            e.preventDefault();
            document.execCommand("undo");
            break;
          case "y":
            e.preventDefault();
            document.execCommand("redo");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      className="border-none rounded min-h-[200px] w-full p-2 overflow-auto"
      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
    >
      <div aria-placeholder="Type your message here..."
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[160px] w-full focus:outline-none break-words overflow-auto"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      />
    </div>
  );
};

export default RichTextEditor;
