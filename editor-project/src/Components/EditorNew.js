import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';

function EditorNew() {
  const files = {
    "script.js": {
      name: 'script.js',
      language: 'javascript',
      value: '//let name = 5',
    },
    "script.py": {
      name: 'script.py',
      language: 'python',
      value: "#print('Hello')",
    },
    "index.html": {
      name: 'index.html',
      language: 'html',
      value: '<p>This is a paragraph</p>',
    },
  };

  const [fileName, setFileName] = useState('script.js');

  const editorRef = useRef(null);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    editorRef.current.onDidChangeModelContent((event) => {
      console.log('Content changed:', event);
      const {origin} = event
    });
    editorRef.current.setValue(`let name`)
  };

  return (
    <div id="realTimeEditor">
      <Editor
        height="100vh"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorMount}
        path={files[fileName].name}
        defaultValue={files[fileName].value}
      />
    </div>
  );
}

export default EditorNew;
