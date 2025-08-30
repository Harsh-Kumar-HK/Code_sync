import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const textArea = document.getElementById("realTimeEditor");

      editorRef.current = CodeMirror.fromTextArea(textArea, {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      editorRef.current.setSize(null, "100%");

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);

        if (origin !== "setValue") {
          socketRef.current.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    }
  }, []); // init editor only once

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    // cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.off("code-change");
      }
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <textarea id="realTimeEditor"></textarea>
    </div>
  );
};

export default Editor;
