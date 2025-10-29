import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, updateProject, getCollaborators, addCollaborator, removeCollaborator, getProjectSettings, updateProjectSettings, searchUsers } from '../api/projects';
import { useAuth } from '../contexts/AuthContext';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [collaborators, setCollaborators] = useState({ owner: null, collaborators: [] });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', visibility: 'private' });
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [addingCollaborator, setAddingCollaborator] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectData, collaboratorsData, settingsData] = await Promise.all([
        getProject(projectId),
        getCollaborators(projectId),
        getProjectSettings(projectId)
      ]);
      setProject(projectData.project);
      setCollaborators(collaboratorsData);
      setSettings(settingsData.settings);
      setEditForm({
        name: projectData.project.name,
        description: projectData.project.description,
        visibility: projectData.project.visibility
      });
    } catch (err) {
      setError('Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = await updateProject(projectId, editForm);
      setProject(data.project);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setUpdating(false);
    }
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setNewCollaboratorEmail(email);

    if (email.length > 2) {
      try {
        const response = await searchUsers(email);
        setUserSuggestions(response.users);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to search users:', err);
        setUserSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setUserSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setNewCollaboratorEmail(user.email);
    setUserSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    setAddingCollaborator(true);
    try {
      await addCollaborator(projectId, newCollaboratorEmail);
      setNewCollaboratorEmail('');
      setUserSuggestions([]);
      setShowSuggestions(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setAddingCollaborator(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      await removeCollaborator(projectId, userId);
      fetchProjectData();
    } catch (err) {
      setError('Failed to remove collaborator');
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      const data = await updateProjectSettings(projectId, newSettings);
      setSettings(data.settings);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center mt-8">Project not found</div>;
  }

  const isOwner = project.owner === user?.id || project.owner?._id === user?.id;
  const isCollaborator = collaborators.collaborators.some(collaborator => collaborator._id === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Projects</Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {editing ? (
          <form onSubmit={handleUpdateProject}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Visibility</label>
              <select
                value={editForm.visibility}
                onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={updating}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  project.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.visibility}
                </span>
              </div>
              {isOwner && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Edit Project
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-4">{project.description || 'No description'}</p>
            <div className="text-sm text-gray-500">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Collaborators</h2>
          <div className="mb-4">
            <strong>Owner:</strong> {collaborators.owner?.name} ({collaborators.owner?.email})
          </div>
          <div className="mb-4">
            <strong>Collaborators:</strong>
            {collaborators.collaborators.length === 0 ? (
              <p className="text-gray-500">No collaborators</p>
            ) : (
              <ul className="list-disc list-inside">
                {collaborators.collaborators.map((collaborator) => (
                  <li key={collaborator._id} className="flex justify-between items-center">
                    <span>
                      {collaborator.name} ({collaborator.email})
                      {collaborator._id === user?.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator._id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {isOwner && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Collaborator</h3>
              <form onSubmit={handleAddCollaborator}>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={newCollaboratorEmail}
                      onChange={handleEmailChange}
                      placeholder="Collaborator email"
                      className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {showSuggestions && userSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-lg max-h-40 overflow-y-auto">
                        {userSuggestions.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => handleSuggestionClick(user)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={addingCollaborator}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {addingCollaborator ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Settings</h2>
          {settings && (
            <div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.permissions.allowCollaboratorsToEdit}
                    onChange={(e) => handleUpdateSettings({
                      visibility: settings.visibility,
                      permissions: {
                        ...settings.permissions,
                        allowCollaboratorsToEdit: e.target.checked
                      }
                    })}
                    disabled={!isOwner}
                    className="mr-2"
                  />
                  Allow collaborators to edit
                </label>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.permissions.allowPublicRead}
                    onChange={(e) => handleUpdateSettings({
                      visibility: settings.visibility,
                      permissions: {
                        ...settings.permissions,
                        allowPublicRead: e.target.checked
                      }
                    })}
                    disabled={!isOwner}
                    className="mr-2"
                  />
                  Allow public read access
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Files</h2>
        <p className="text-gray-600">File management functionality will be implemented here.</p>
        <Link
          to={`/projects/${projectId}/files`}
          className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Manage Files
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
