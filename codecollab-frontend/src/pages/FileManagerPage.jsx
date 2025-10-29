import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFiles, createFile, deleteFile, renameFile, getFileContent, updateFileContent } from '../api/files';
import { useAuth } from '../contexts/AuthContext';

const FileManagerPage = () => {
  const { projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('file');
  const [parentId, setParentId] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      const data = await getFiles(projectId);
      setFiles(data.files);
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async (e) => {
    e.preventDefault();
    try {
      await createFile(projectId, {
        name: newFileName,
        type: newFileType,
        content: newFileType === 'file' ? '' : undefined,
        parentId
      });
      setNewFileName('');
      setCreating(false);
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file/folder?')) return;
    try {
      await deleteFile(projectId, fileId);
      fetchFiles();
      if (selectedFile && selectedFile._id === fileId) {
        setSelectedFile(null);
        setFileContent('');
      }
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const handleRenameFile = async (fileId) => {
    try {
      await renameFile(projectId, fileId, newName);
      setEditingName(null);
      setNewName('');
      fetchFiles();
    } catch (err) {
      setError('Failed to rename file');
    }
  };

  const handleSelectFile = async (file) => {
    if (file.type === 'folder') {
      setParentId(file._id);
      return;
    }
    setSelectedFile(file);
    try {
      const data = await getFileContent(projectId, file._id);
      setFileContent(data.content);
    } catch (err) {
      setError('Failed to load file content');
    }
  };

  const handleSaveContent = async () => {
    if (!selectedFile) return;
    try {
      await updateFileContent(projectId, selectedFile._id, fileContent);
      setError('');
    } catch (err) {
      setError('Failed to save file content');
    }
  };

  const buildFileTree = (files, parentId = null) => {
    return files
      .filter(file => file.parentId === parentId)
      .map(file => ({
        ...file,
        children: buildFileTree(files, file._id)
      }));
  };

  const renderFileTree = (fileTree, level = 0) => {
    return fileTree.map(file => (
      <div key={file._id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded">
          <div className="flex items-center cursor-pointer" onClick={() => handleSelectFile(file)}>
            <span className={`mr-2 ${file.type === 'folder' ? 'text-blue-500' : 'text-gray-500'}`}>
              {file.type === 'folder' ? '📁' : '📄'}
            </span>
            {editingName === file._id ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleRenameFile(file._id)}
                onKeyPress={(e) => e.key === 'Enter' && handleRenameFile(file._id)}
                className="border rounded px-1 py-0 text-sm"
                autoFocus
              />
            ) : (
              <span className="text-sm">{file.name}</span>
            )}
          </div>
          <div className="flex space-x-1">
            <Link
              to={`/projects/${projectId}/editor/${file._id}`}
              className="text-xs text-green-600 hover:text-green-800"
            >
              Edit Live
            </Link>
            <button
              onClick={() => {
                setEditingName(file._id);
                setNewName(file.name);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Rename
            </button>
            <button
              onClick={() => handleDeleteFile(file._id)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
        {file.children && file.children.length > 0 && renderFileTree(file.children, level + 1)}
      </div>
    ));
  };

  const fileTree = buildFileTree(files);

  if (loading) {
    return <div className="text-center mt-8">Loading files...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/projects/${projectId}`} className="text-indigo-600 hover:text-indigo-800">&larr; Back to Project</Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Files</h2>
            <button
              onClick={() => setCreating(true)}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
            >
              New File/Folder
            </button>
          </div>

          {creating && (
            <form onSubmit={handleCreateFile} className="mb-4 p-4 bg-gray-50 rounded">
              <div className="mb-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="File/Folder name"
                  className="w-full border rounded px-2 py-1 text-sm"
                  required
                />
              </div>
              <div className="mb-2">
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="border rounded p-2 max-h-96 overflow-y-auto">
            {fileTree.length === 0 ? (
              <p className="text-gray-500 text-sm">No files yet</p>
            ) : (
              renderFileTree(fileTree)
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedFile ? `Editing: ${selectedFile.name}` : 'Select a file to edit'}
          </h2>
          {selectedFile ? (
            <div>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-64 border rounded p-2 text-sm font-mono"
                placeholder="File content..."
              />
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleSaveContent}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setFileContent('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Click on a file to view and edit its content.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManagerPage;
