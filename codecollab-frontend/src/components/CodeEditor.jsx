import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { detectLanguage, getLanguageDisplayName } from '../utils/languageDetection';
import { getFiles, createFile, renameFile, deleteFile } from '../api/files';
import { executeCode } from '../api/execute';

const CodeEditor = ({ fileId, initialContent, language, onSave, projectId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent || '');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(language || detectLanguage(fileId));
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Load project files
    const loadFiles = async () => {
      if (projectId) {
        try {
          const response = await getFiles(projectId);
          setFiles(response.files || []);
        } catch (error) {
          console.error('Failed to load files:', error);
        } finally {
          setLoadingFiles(false);
        }
      }
    };

    loadFiles();
  }, [projectId]);

  // Update language when files are loaded or fileId changes
  useEffect(() => {
    if (files.length > 0 && fileId) {
      const currentFile = files.find(file => file._id === fileId);
      if (currentFile) {
        const detectedLanguage = detectLanguage(currentFile.name);
        setCurrentLanguage(language || detectedLanguage);
      }
    }
  }, [files, fileId, language]);

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

  const handleRunCode = async () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const code = model.getValue();

      if (currentLanguage === 'javascript') {
        // Execute JavaScript code locally and capture output
        try {
          // Capture console.log outputs
          let output = '';
          const originalLog = console.log;
          console.log = (...args) => {
            output += args.join(' ') + '\n';
          };

          // Execute the code
          const result = eval(code);

          // Restore console.log
          console.log = originalLog;

          // Show result in terminal
          const finalOutput = output || (result !== undefined ? result.toString() : 'Code executed successfully');
          setTerminalOutput(prev => prev + `\n> Running JavaScript code...\n${finalOutput}\n`);
          setShowTerminal(true);
        } catch (error) {
          setTerminalOutput(prev => prev + `\n> Error running code:\n${error.message}\n`);
          setShowTerminal(true);
        }
      } else {
        // For other languages, call backend API
        try {
          setTerminalOutput(prev => prev + `\n> Running ${getLanguageDisplayName(currentLanguage)} code...\n`);
          setShowTerminal(true);

          const response = await executeCode(projectId, code, currentLanguage);

          let output = response.output || '';
          if (response.error) {
            output += `\nError:\n${response.error}`;
          }

          setTerminalOutput(prev => prev + output + '\n');
        } catch (error) {
          setTerminalOutput(prev => prev + `\n> Error executing code:\n${error.response?.data?.message || error.message}\n`);
        }
      }
    }
  };

  // Helper function to build file tree structure
  const buildFileTree = (files) => {
    const tree = {};
    const rootFiles = [];

    files.forEach(file => {
      if (!file.parentId) {
        rootFiles.push(file);
      } else {
        if (!tree[file.parentId]) {
          tree[file.parentId] = [];
        }
        tree[file.parentId].push(file);
      }
    });

    return { rootFiles, tree };
  };

  // Handle right-click context menu
  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setSelectedFile(file);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file: file
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
    setSelectedFile(null);
  };

  // Handle file operations
  const handleCreateFile = async () => {
    const fileName = prompt('Enter file name:');
    if (fileName && selectedFile) {
      try {
        await createFile(projectId, {
          name: fileName,
          type: 'file',
          parentId: selectedFile._id
        });
        // Reload files
        const response = await getFiles(projectId);
        setFiles(response.files || []);
      } catch (error) {
        console.error('Failed to create file:', error);
        alert('Failed to create file');
      }
    }
    closeContextMenu();
  };

  const handleRenameFile = async () => {
    const newName = prompt('Enter new name:', selectedFile.name);
    if (newName && selectedFile) {
      try {
        await renameFile(projectId, selectedFile._id, newName);
        // Reload files
        const response = await getFiles(projectId);
        setFiles(response.files || []);
      } catch (error) {
        console.error('Failed to rename file:', error);
        alert('Failed to rename file');
      }
    }
    closeContextMenu();
  };

  const handleDeleteFile = async () => {
    if (confirm(`Are you sure you want to delete "${selectedFile.name}"?`)) {
      try {
        await deleteFile(projectId, selectedFile._id);
        // Reload files
        const response = await getFiles(projectId);
        setFiles(response.files || []);
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert('Failed to delete file');
      }
    }
    closeContextMenu();
  };

  const handleCopyPath = () => {
    const path = buildFilePath(selectedFile);
    navigator.clipboard.writeText(path);
    alert(`Path copied: ${path}`);
    closeContextMenu();
  };

  // Build file path
  const buildFilePath = (file) => {
    const path = [];
    let current = file;
    while (current) {
      path.unshift(current.name);
      current = files.find(f => f._id === current.parentId);
    }
    return path.join('/');
  };

  // Handle terminal commands
  const handleTerminalCommand = async (command) => {
    if (command.trim()) {
      setTerminalOutput(prev => prev + `\n$ ${command}\n`);
      try {
        // For now, simulate terminal commands
        // In a real implementation, this would send commands to a backend
        if (command === 'ls') {
          const fileList = files.map(f => f.name).join('\n');
          setTerminalOutput(prev => prev + fileList + '\n');
        } else if (command === 'pwd') {
          setTerminalOutput(prev => prev + `/projects/${projectId}\n`);
        } else if (command.startsWith('echo ')) {
          setTerminalOutput(prev => prev + command.substring(5) + '\n');
        } else {
          setTerminalOutput(prev => prev + `Command not found: ${command}\n`);
        }
      } catch (error) {
        setTerminalOutput(prev => prev + `Error: ${error.message}\n`);
      }
      setTerminalInput('');
    }
  };

  // Render file tree recursively
  const renderFileTree = (currentFiles, allFiles, level = 0) => {
    return currentFiles.map(file => (
      <div key={file._id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center px-2 py-1 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
            file._id === fileId ? 'bg-gray-700' : ''
          }`}
          onClick={() => {
            // Navigate to file
            window.location.href = `/projects/${projectId}/editor/${file._id}`;
          }}
          onContextMenu={(e) => handleContextMenu(e, file)}
        >
          <span className="text-xs mr-2">
            {file.type === 'folder' ? '📁' : '📄'}
          </span>
          <span className="text-xs truncate">{file.name}</span>
        </div>
        {file.type === 'folder' && buildFileTree(allFiles).tree[file._id] && (
          <div>
            {renderFileTree(buildFileTree(allFiles).tree[file._id], allFiles, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-900" onClick={closeContextMenu}>
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
            {loadingFiles ? (
              <div className="text-gray-500 text-xs">Loading files...</div>
            ) : (
              renderFileTree(buildFileTree(files).rootFiles, files)
            )}
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
            <span className="text-gray-400 text-xs">{getLanguageDisplayName(currentLanguage)}</span>
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
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Terminal
            </button>
          </div>
        </div>

        {/* Monaco Editor and Terminal */}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${showTerminal ? 'h-2/3' : 'h-full'} bg-gray-900`}>
            <Editor
              height="100%"
              language={currentLanguage}
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

          {/* Terminal */}
          {showTerminal && (
            <div className="h-1/3 bg-gray-800 border-t border-gray-700 flex flex-col">
              <div className="p-2 border-b border-gray-700 text-xs text-gray-400">
                Terminal
              </div>
              <div className="flex-1 p-2 overflow-y-auto font-mono text-sm text-green-400 bg-black">
                <div className="whitespace-pre-wrap">
                  {terminalOutput || 'Welcome to CodeCollab Terminal\nType commands like: ls, pwd, echo hello\n\nTo run JavaScript code, click the ▶ Run button above.\nFor other languages, use the terminal for basic commands.\n'}
                </div>
              </div>
              <div className="p-2 border-t border-gray-700 flex">
                <span className="text-green-400 mr-2">$</span>
                <input
                  ref={terminalRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalCommand(terminalInput);
                    }
                  }}
                  className="flex-1 bg-transparent text-green-400 outline-none font-mono text-sm"
                  placeholder="Enter command..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Ln 1, Col 1</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>{getLanguageDisplayName(currentLanguage)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Live Collaboration</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.file.type === 'folder' && (
            <div
              className="px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 cursor-pointer"
              onClick={handleCreateFile}
            >
              New File
            </div>
          )}
          <div
            className="px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 cursor-pointer"
            onClick={handleRenameFile}
          >
            Rename
          </div>
          <div
            className="px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 cursor-pointer"
            onClick={handleDeleteFile}
          >
            Delete
          </div>
          <div
            className="px-4 py-2 text-xs text-gray-300 hover:bg-gray-700 cursor-pointer"
            onClick={handleCopyPath}
          >
            Copy Path
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
