// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getProfile, updateProfile, logout as logoutApi } from '../api/auth';
// import { useAuth } from '../contexts/AuthContext';

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     bio: '',
//     avatar: '',
//     skills: [],
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const data = await getProfile();
//       setUser(data.user);
//       setFormData({
//         bio: data.user.bio || '',
//         avatar: data.user.avatar || '',
//         skills: data.user.skills || [],
//       });
//     } catch (err) {
//       setError('Failed to fetch profile');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'skills') {
//       setFormData({
//         ...formData,
//         skills: value.split(',').map(skill => skill.trim()),
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const data = await updateProfile(formData);
//       setUser(data.user);
//       setEditing(false);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Update failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logoutApi();
//       logout();
//       navigate('/login');
//     } catch (err) {
//       // Even if logout fails, remove local token
//       logout();
//       navigate('/login');
//     }
//   };

//   if (!user) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Profile</h2>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <div className="mb-4">
//         <strong>Name:</strong> {user.name}
//       </div>
//       <div className="mb-4">
//         <strong>Email:</strong> {user.email}
//       </div>
//       {editing ? (
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700">Bio</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               rows="3"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Avatar URL</label>
//             <input
//               type="text"
//               name="avatar"
//               value={formData.avatar}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Skills (comma separated)</label>
//             <input
//               type="text"
//               name="skills"
//               value={formData.skills.join(', ')}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//             <button
//               type="button"
//               onClick={() => setEditing(false)}
//               className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div>
//           <div className="mb-4">
//             <strong>Bio:</strong> {user.bio || 'No bio'}
//           </div>
//           <div className="mb-4">
//             <strong>Avatar:</strong> {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" /> : 'No avatar'}
//           </div>
//           <div className="mb-4">
//             <strong>Skills:</strong> {user.skills.length > 0 ? user.skills.join(', ') : 'No skills'}
//           </div>
//           <button
//             onClick={() => setEditing(true)}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mr-2"
//           >
//             Edit Profile
//           </button>
//           <button
//             onClick={handleLogout}
//             className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, logout as logoutApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setUser(data.user);
      setFormData({
        name: data.user.name || '',
        bio: data.user.bio || '',
        avatar: data.user.avatar || '',
        skills: data.user.skills || [],
      });
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const data = await updateProfile(formData);
      setUser(data.user);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate('/login');
    } catch (err) {
      logout();
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-25 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
          <p className="text-gray-300 text-lg">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              {/* User Card */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-gray-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-700">
                      {getInitials(user?.name || 'U')}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  Active Now
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-white font-bold text-lg">12</div>
                  <div className="text-gray-400 text-xs">Projects</div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-white font-bold text-lg">5</div>
                  <div className="text-gray-400 text-xs">Teams</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              {/* Alert Messages */}
              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Avatar URL */}
                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Avatar URL</label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2">
                      <label className="block text-white font-semibold mb-2">Skills</label>
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="Add a skill..."
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-blue-400 hover:text-blue-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-6 py-3 border-2 border-gray-600 hover:border-gray-500 text-gray-300 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {/* View Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm font-semibold mb-2">Full Name</label>
                      <p className="text-white text-lg">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-semibold mb-2">Email</label>
                      <p className="text-white text-lg">{user?.email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm font-semibold mb-2">Bio</label>
                      <p className="text-white text-lg">{user?.bio || 'No bio provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm font-semibold mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {user?.skills?.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400">No skills added</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;