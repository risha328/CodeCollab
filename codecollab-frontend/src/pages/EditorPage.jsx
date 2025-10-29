import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { useAuth } from '../contexts/AuthContext';

const EditorPage = () => {
  const { projectId, fileId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:6700/api/editor/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      alert('File saved successfully!');
    } catch (err) {
      alert('Error saving file: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading editor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <a href={`/projects/${projectId}/files`} className="text-white hover:text-gray-300">&larr; Back to Files</a>
        </div>
        <CodeEditor
          fileId={fileId}
          initialContent=""
          language="javascript"
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default EditorPage;
