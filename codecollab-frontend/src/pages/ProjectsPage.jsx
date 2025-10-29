// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getProjects, createProject, deleteProject } from '../api/projects';
// import { useAuth } from '../contexts/AuthContext';

// const ProjectsPage = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newProject, setNewProject] = useState({
//     name: '',
//     description: '',
//     visibility: 'private'
//   });
//   const [creating, setCreating] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const data = await getProjects();
//       setProjects(data.projects);
//     } catch (err) {
//       setError('Failed to fetch projects');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProject = async (e) => {
//     e.preventDefault();
//     setCreating(true);
//     try {
//       await createProject(newProject);
//       setNewProject({ name: '', description: '', visibility: 'private' });
//       setShowCreateForm(false);
//       fetchProjects();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create project');
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
//       try {
//         await deleteProject(projectId);
//         fetchProjects();
//       } catch (err) {
//         setError('Failed to delete project');
//       }
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-8">Loading projects...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-white">My Projects</h1>
//         <button
//           onClick={() => setShowCreateForm(true)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
//         >
//           Create New Project
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {showCreateForm && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
//               <form onSubmit={handleCreateProject}>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
//                   <input
//                     type="text"
//                     value={newProject.name}
//                     onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
//                   <textarea
//                     value={newProject.description}
//                     onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     rows="3"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2">Visibility</label>
//                   <select
//                     value={newProject.visibility}
//                     onChange={(e) => setNewProject({ ...newProject, visibility: e.target.value })}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     <option value="private">Private</option>
//                     <option value="public">Public</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowCreateForm(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={creating}
//                     className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                   >
//                     {creating ? 'Creating...' : 'Create'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {projects.length === 0 ? (
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-semibold text-gray-600 mb-4">No projects yet</h2>
//           <p className="text-gray-500 mb-6">Create your first project to get started with collaboration.</p>
//           <button
//             onClick={() => setShowCreateForm(true)}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
//           >
//             Create Your First Project
//           </button>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <div key={project._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
//               <div className="flex justify-between items-start mb-4">
//                 <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   project.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {project.visibility}
//                 </span>
//               </div>
//               <p className="text-gray-600 mb-4">{project.description || 'No description'}</p>
//               <div className="text-sm text-gray-500 mb-4">
//                 Created {new Date(project.createdAt).toLocaleDateString()}
//               </div>
//               <div className="flex space-x-2">
//                 <Link
//                   to={`/projects/${project._id}`}
//                   className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
//                 >
//                   Open Project
//                 </Link>
//                 {project.owner === user?.id || project.owner?._id === user?.id ? (
//                   <button
//                     onClick={() => handleDeleteProject(project._id)}
//                     className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
//                   >
//                     Delete
//                   </button>
//                 ) : (
//                   <div className="bg-blue-100 text-blue-800 py-2 px-4 rounded text-sm font-medium">
//                     Collaborator
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       </div>
//     </div>
//   );
// };

// export default ProjectsPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../api/projects';
import { useAuth } from '../contexts/AuthContext';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    visibility: 'private'
  });
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(newProject);
      setNewProject({ name: '', description: '', visibility: 'private' });
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  // Filter projects based on search and visibility
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = filterVisibility === 'all' || project.visibility === filterVisibility;
    return matchesSearch && matchesVisibility;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Projects</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage and collaborate on your coding projects with your team in real-time
            </p>
          </div>

          {/* Stats and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="flex items-center space-x-6">
              <div className="bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
                <div className="text-gray-400 text-sm">Total Projects</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700">
                <div className="text-2xl font-bold text-green-400">
                  {projects.filter(p => p.visibility === 'public').length}
                </div>
                <div className="text-gray-400 text-sm">Public</div>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">All Projects</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {searchTerm || filterVisibility !== 'all' ? 'No matching projects' : 'No projects yet'}
              </h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || filterVisibility !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first project to start collaborating with your team'
                }
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 group"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.visibility === 'public' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {project.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                        </span>
                        {project.owner === user?.id || project.owner?._id === user?.id ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30">
                            Owner
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs border border-gray-500/30">
                            Collaborator
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>

                  {/* Project Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <div className="flex items-center space-x-4">
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span>{project.collaborators?.length || 1}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Open
                    </Link>
                    {(project.owner === user?.id || project.owner?._id === user?.id) && (
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Project Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Create New Project</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateProject}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Project Name</label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        rows="3"
                        placeholder="Describe your project..."
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Visibility</label>
                      <select
                        value={newProject.visibility}
                        onChange={(e) => setNewProject({ ...newProject, visibility: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="private">🔒 Private - Only you and collaborators</option>
                        <option value="public">🌐 Public - Anyone can view</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-600 hover:border-gray-500 text-gray-300 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Project'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;