import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, updateProject, getCollaborators, addCollaborator, removeCollaborator, getProjectSettings, updateProjectSettings, searchUsers } from '../api/projects';
import { getActivity } from '../api/activity';
import { getFiles } from '../api/files';
import { useAuth } from '../contexts/AuthContext';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [collaborators, setCollaborators] = useState({ owner: null, collaborators: [] });
  const [settings, setSettings] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', visibility: 'private' });
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [addingCollaborator, setAddingCollaborator] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setFilesLoading(true);
      const [projectData, collaboratorsData, settingsData, activityData, filesData] = await Promise.all([
        getProject(projectId),
        getCollaborators(projectId),
        getProjectSettings(projectId),
        getActivity(projectId),
        getFiles(projectId)
      ]);
      setProject(projectData.project);
      setCollaborators(collaboratorsData);
      setSettings(settingsData.settings);
      setActivity(activityData.activities);
      setFiles(filesData.files || []);
      setEditForm({
        name: projectData.project.name,
        description: projectData.project.description,
        about: projectData.project.about || '',
        visibility: projectData.project.visibility
      });
    } catch (err) {
      setError('Failed to fetch project data');
    } finally {
      setLoading(false);
      setFilesLoading(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = await updateProject(projectId, editForm);
      setProject(data.project);
      setEditing(false);
      setSuccess('Project updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
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
      setSuccess('Collaborator added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setAddingCollaborator(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (window.confirm('Are you sure you want to remove this collaborator?')) {
      try {
        await removeCollaborator(projectId, userId);
        setSuccess('Collaborator removed successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchProjectData();
      } catch (err) {
        setError('Failed to remove collaborator');
      }
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      const data = await updateProjectSettings(projectId, newSettings);
      setSettings(data.settings);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getActivityDescription = (item) => {
    switch (item.type) {
      case 'project_created':
        return 'Created the project';
      case 'collaborator_added':
        return 'Added a collaborator';
      case 'file_uploaded':
        return 'Uploaded a file';
      case 'file_edited':
        return 'Edited a file';
      case 'comment_added':
        return 'Added a comment';
      default:
        return item.action || 'Performed an action';
    }
  };

  const buildProjectTree = (files) => {
    const fileMap = {};
    const rootFiles = [];

    files.forEach(file => {
      fileMap[file._id] = {
        ...file,
        children: []
      };
    });

    files.forEach(file => {
      if (file.parentId && fileMap[file.parentId]) {
        fileMap[file.parentId].children.push(fileMap[file._id]);
      } else {
        rootFiles.push(fileMap[file._id]);
      }
    });

    const convertToTreeFormat = (file) => {
      return {
        type: file.type,
        children: file.children.reduce((acc, child) => {
          acc[child.name] = convertToTreeFormat(child);
          return acc;
        }, {}),
        file: file.type === 'file' ? file : null
      };
    };

    const tree = {};
    rootFiles.forEach(file => {
      tree[file.name] = convertToTreeFormat(file);
    });

    return tree;
  };

  const renderTreeNode = (name, node, level = 0) => {
    const isFile = node.type === 'file';
    const hasChildren = !isFile && Object.keys(node.children).length > 0;

    return (
      <div key={name} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center py-2 hover:bg-gray-700 rounded-lg px-3 transition-colors duration-200">
          {isFile ? (
            <svg className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          )}
          <span className={`text-sm flex-1 ${isFile ? 'text-gray-300' : 'text-white font-semibold'}`}>
            {name}
          </span>
          {isFile && node.file && (
            <span className="ml-4 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {(node.file.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        {hasChildren && (
          <div className="border-l border-gray-600 ml-3">
            {Object.entries(node.children).map(([childName, childNode]) =>
              renderTreeNode(childName, childNode, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or you don't have access.</p>
          <Link to="/projects" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = project.owner === user?.id || project.owner?._id === user?.id;
  const isCollaborator = collaborators.collaborators.some(collaborator => collaborator._id === user?.id);

  const repoData = {
    branches: 1,
    tags: 0,
    about: project.about || "A collaborative development project.",
    stats: {
      stars: 0,
      watching: collaborators.collaborators.length + 1,
      forks: 0
    }
  };

  // Tab configuration with icons and descriptions
  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: '📊',
      description: 'Project summary and structure',
      color: 'blue'
    },
    {
      id: 'files',
      name: 'Files',
      icon: '📁',
      description: 'Manage project files',
      color: 'green'
    },
    {
      id: 'activity',
      name: 'Activity',
      icon: '🔄',
      description: 'Recent project activity',
      color: 'purple'
    },
    {
      id: 'collaborators',
      name: 'Collaborators',
      icon: '👥',
      description: 'Team members and permissions',
      color: 'orange'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      description: 'Project configuration',
      color: 'gray'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const baseClasses = {
      blue: isActive 
        ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-300',
      green: isActive 
        ? 'bg-green-500/20 border-green-400 text-green-300' 
        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-300',
      purple: isActive 
        ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300',
      orange: isActive 
        ? 'bg-orange-500/20 border-orange-400 text-orange-300' 
        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-300',
      gray: isActive 
        ? 'bg-gray-700 border-gray-600 text-gray-300' 
        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300'
    };
    return baseClasses[color] || baseClasses.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Main container with padding top to account for fixed navbar */}
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/projects" 
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Projects
                </Link>
                <div className="h-6 w-px bg-gray-600"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                    <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  project.visibility === 'public' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {project.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                </span>
                {isOwner && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Project
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-700 rounded-xl p-4 flex items-center shadow-sm">
              <div className="w-5 h-5 bg-red-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-900/50 border border-green-700 rounded-xl p-4 flex items-center shadow-sm">
              <div className="w-5 h-5 bg-green-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-green-300 text-sm">{success}</div>
            </div>
          )}

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${getColorClasses(tab.color, activeTab === tab.id)}`}
              >
                <div className="text-2xl mb-2">{tab.icon}</div>
                <div className="text-sm font-semibold mb-1">{tab.name}</div>
                <div className="text-xs text-gray-400 text-center">{tab.description}</div>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Header Card */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {project.description || 'No description provided for this project.'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Created {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {isOwner && !editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="ml-4 p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Structure */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Project Structure</h3>
                    <Link 
                      to={`/projects/${projectId}/editor`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Open Editor
                    </Link>
                  </div>
                  
                  {filesLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-400 text-sm">Loading project structure...</p>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">No Files Yet</h4>
                      <p className="text-gray-400 mb-6">Start by creating your first file in the code editor.</p>
                      <Link
                        to={`/projects/${projectId}/editor`}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Create First File
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(buildProjectTree(files)).map(([name, node]) =>
                        renderTreeNode(name, node)
                      )}
                    </div>
                  )}
                </div>

                {/* Edit Form */}
                {editing && (
                  <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Edit Project</h3>
                    <form onSubmit={handleUpdateProject}>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter project name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Describe your project..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">About</label>
                          <textarea
                            value={editForm.about}
                            onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Provide detailed information about your project..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                          <select
                            value={editForm.visibility}
                            onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="private">🔒 Private - Only you and collaborators</option>
                            <option value="public">🌐 Public - Anyone can view</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-700">
                        <button
                          type="submit"
                          disabled={updating}
                          className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving Changes...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="px-6 py-3 border-2 border-gray-600 hover:border-gray-500 text-gray-300 font-medium rounded-lg transition-all duration-200 hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to={`/projects/${projectId}/editor`}
                      className="flex items-center p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium">Open Editor</div>
                        <div className="text-gray-400 text-sm">Start coding</div>
                      </div>
                    </Link>
                    <Link
                      to={`/projects/${projectId}/files`}
                      className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium">Manage Files</div>
                        <div className="text-gray-400 text-sm">Organize project</div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Project Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-700 rounded-xl">
                      <div className="text-2xl font-bold text-white mb-1">{files.length}</div>
                      <div className="text-gray-400 text-sm">Files</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-xl">
                      <div className="text-2xl font-bold text-white mb-1">{collaborators.collaborators.length + 1}</div>
                      <div className="text-gray-400 text-sm">Members</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-xl">
                      <div className="text-2xl font-bold text-white mb-1">{activity.length}</div>
                      <div className="text-gray-400 text-sm">Activities</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-xl">
                      <div className="text-2xl font-bold text-white mb-1">{repoData.branches}</div>
                      <div className="text-gray-400 text-sm">Branches</div>
                    </div>
                  </div>
                </div>

                {/* Team Members Preview */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Team</h3>
                    <span className="text-gray-400 text-sm">{collaborators.collaborators.length + 1} members</span>
                  </div>
                  <div className="space-y-3">
                    {/* Owner */}
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                        {getInitials(collaborators.owner?.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{collaborators.owner?.name}</div>
                        <div className="text-gray-500 text-xs truncate">Owner</div>
                      </div>
                    </div>
                    {/* Collaborators Preview */}
                    {collaborators.collaborators.slice(0, 3).map((collaborator) => (
                      <div key={collaborator._id} className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                          {getInitials(collaborator.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm truncate">
                            {collaborator.name}
                            {collaborator._id === user?.id && (
                              <span className="ml-1 text-xs text-blue-400">(You)</span>
                            )}
                          </div>
                          <div className="text-gray-500 text-xs truncate">Collaborator</div>
                        </div>
                      </div>
                    ))}
                    {collaborators.collaborators.length > 3 && (
                      <div className="text-center pt-2">
                        <button 
                          onClick={() => setActiveTab('collaborators')}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          + {collaborators.collaborators.length - 3} more
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Project Files</h2>
                    <p className="text-gray-400 mt-1">Manage and organize your project files</p>
                  </div>
                  <Link
                    to={`/projects/${projectId}/editor`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New File
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {filesLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading files...</p>
                  </div>
                ) : files.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Files Yet</h3>
                    <p className="text-gray-400 mb-6">Start by creating your first file in the code editor.</p>
                    <Link
                      to={`/projects/${projectId}/editor`}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create First File
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {files.map((file) => (
                      <div key={file._id} className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white font-medium">{file.name}</div>
                            <div className="text-gray-400 text-sm">
                              {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Size unknown'} • 
                              Modified {new Date(file.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/projects/${projectId}/editor?file=${file._id}`}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 border border-gray-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Project Activity</h2>
                <p className="text-gray-400 mt-1">Recent actions and events in this project</p>
              </div>
              
              <div className="p-6">
                {activity.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
                    <p className="text-gray-400">Activity will appear here as you work on the project.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activity.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {getInitials(item.userId?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white font-medium">{item.userId?.name || 'Unknown User'}</span>
                            <span className="text-gray-400 text-sm">
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-gray-300">
                            {getActivityDescription(item)}
                          </div>
                          {item.details && Object.keys(item.details).length > 0 && (
                            <div className="mt-2 text-sm text-gray-400 bg-gray-800 rounded-lg p-3 border border-gray-600">
                              {Object.entries(item.details).map(([key, value]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium text-gray-300 w-20 flex-shrink-0">{key}:</span>
                                  <span className="text-gray-400 flex-1">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collaborators Tab */}
          {activeTab === 'collaborators' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Team Members</h2>
                
                {/* Owner */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Project Owner</h3>
                  <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(collaborators.owner?.name)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{collaborators.owner?.name}</div>
                      <div className="text-gray-400 text-sm">{collaborators.owner?.email}</div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                      Owner
                    </span>
                  </div>
                </div>

                {/* Collaborators */}
                <div>
                  <h3 className="text-white font-semibold mb-4">
                    Collaborators ({collaborators.collaborators.length})
                  </h3>
                  {collaborators.collaborators.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400">No collaborators yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {collaborators.collaborators.map((collaborator) => (
                        <div key={collaborator._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials(collaborator.name)}
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {collaborator.name}
                                {collaborator._id === user?.id && (
                                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-400 text-sm">{collaborator.email}</div>
                            </div>
                          </div>
                          {isOwner && collaborator._id !== user?.id && (
                            <button
                              onClick={() => handleRemoveCollaborator(collaborator._id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                              title="Remove collaborator"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Collaborator */}
              {isOwner && (
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-white mb-6">Add Collaborator</h2>
                  <form onSubmit={handleAddCollaborator}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={newCollaboratorEmail}
                            onChange={handleEmailChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter collaborator's email"
                            required
                          />
                          {showSuggestions && userSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {userSuggestions.map((user) => (
                                <div
                                  key={user._id}
                                  onClick={() => handleSuggestionClick(user)}
                                  className="px-4 py-3 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors"
                                >
                                  <div className="text-white font-medium">{user.name}</div>
                                  <div className="text-gray-400 text-sm">{user.email}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={addingCollaborator}
                        className="w-full flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingCollaborator ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding Collaborator...
                          </>
                        ) : (
                          'Add Collaborator'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && settings && (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Project Settings</h2>
                <p className="text-gray-400 mt-1">Manage project preferences and permissions</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Permissions */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-600 transition-colors">
                        <div>
                          <div className="text-white font-medium">Allow collaborators to edit</div>
                          <div className="text-gray-400 text-sm">Let collaborators modify project files</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.permissions.allowCollaboratorsToEdit}
                          onChange={(e) => handleUpdateSettings({
                            ...settings,
                            permissions: {
                              ...settings.permissions,
                              allowCollaboratorsToEdit: e.target.checked
                            }
                          })}
                          disabled={!isOwner}
                          className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-600 transition-colors">
                        <div>
                          <div className="text-white font-medium">Allow public read access</div>
                          <div className="text-gray-400 text-sm">Make project readable by anyone</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.permissions.allowPublicRead}
                          onChange={(e) => handleUpdateSettings({
                            ...settings,
                            permissions: {
                              ...settings.permissions,
                              allowPublicRead: e.target.checked
                            }
                          })}
                          disabled={!isOwner}
                          className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  {isOwner && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 text-red-400">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-red-900/20 border border-red-700 rounded-xl">
                          <div className="text-white font-medium mb-2">Delete Project</div>
                          <div className="text-gray-400 text-sm mb-3">
                            Once you delete a project, there is no going back. Please be certain.
                          </div>
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                            Delete Project
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;