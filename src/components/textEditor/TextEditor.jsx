"use client"
import { useRef } from "react";

function TextEditor() {
  const editorRef = useRef(null);

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div>
      <div>
        <button onClick={() => formatText("bold")}>Bold</button>
        <button onClick={() => formatText("italic")}>Italic</button>
        <button onClick={() => formatText("underline")}>Underline</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        style={{
          border: "1px solid gray",
          minHeight: "200px",
          padding: "10px",
        }}
      ></div>
    </div>
  );
}

export default TextEditor;
