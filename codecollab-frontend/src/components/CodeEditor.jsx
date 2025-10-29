import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const CodeEditor = ({ fileId, initialContent, language, onSave }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent || '');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io('http://localhost:6700', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    setSocket(newSocket);

    // Join file room
    newSocket.emit('join-file', { fileId });

    // Listen for initial file content
    newSocket.on('file-content', (data) => {
      if (data.fileId === fileId) {
        setContent(data.content);
      }
    });

    // Listen for edits from other users
    newSocket.on('edit', (data) => {
      if (data.userId !== user?.id) {
        isRemoteChange.current = true;
        setContent(data.content);
      }
    });

    // Listen for cursor movements
    newSocket.on('cursor-move', (data) => {
      // Handle cursor display for other users
      console.log('Cursor moved:', data);
    });

    // Listen for user joins
    newSocket.on('user-joined', (data) => {
      setOnlineUsers(prev => [...prev, data.userId]);
    });

    // Listen for errors
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      alert('Connection error: ' + error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [fileId, user?.id]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure Monaco Editor
    monaco.editor.defineTheme('customTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
      }
    });
    monaco.editor.setTheme('customTheme');

    // Listen for cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (socket) {
        socket.emit('cursor-move', {
          fileId,
          position: e.position,
          userId: user?.id
        });
      }
    });
  };

  const handleEditorChange = (value) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    setContent(value);

    // Emit changes to other users
    if (socket) {
      socket.emit('edit', {
        fileId,
        content: value,
        userId: user?.id
      });
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(content);
    }
  };

  const handleRunCode = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const code = model.getValue();

      // For now, we'll just log the code to console
      // In a real implementation, you'd send this to a backend service
      // that can execute the code in a sandboxed environment
      console.log('Running code:', code);

      // Show a simple alert for demonstration
      alert(`Code execution not implemented yet.\n\nCode to run:\n${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* File Tree Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Explorer</h3>
        </div>

        {/* File Tree */}
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="text-gray-400 text-xs mb-2">PROJECT FILES</div>
          <div className="space-y-1">
            <div className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-700 rounded cursor-pointer">
              <span className="text-xs">📄 {fileId}</span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
          <div>Online: {onlineUsers.length + 1} user{onlineUsers.length > 0 ? 's' : ''}</div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Title Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">📄</span>
              <span className="text-white text-sm font-medium">{fileId}</span>
            </div>
            <div className="text-gray-500 text-xs">•</div>
            <span className="text-gray-400 text-xs">{language}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready</span>
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleRunCode}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              ▶ Run
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 bg-gray-900">
          <Editor
            height="100%"
            language={language}
            value={content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true, size: 'proportional' },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              theme: 'vs-dark',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              tabSize: 2,
              insertSpaces: true,
              detectIndentation: true,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              renderWhitespace: 'selection',
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: true,
              smoothScrolling: true,
              mouseWheelZoom: true,
              multiCursorModifier: 'ctrlCmd',
              accessibilitySupport: 'auto'
            }}
          />
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Ln 1, Col 1</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>{language}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Live Collaboration</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
