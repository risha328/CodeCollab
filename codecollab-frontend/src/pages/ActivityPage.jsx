import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActivity, getVersions, restoreVersion } from '../api/activity';
import { useAuth } from '../contexts/AuthContext';

const ActivityPage = () => {
  const { projectId } = useParams();
  const [activities, setActivities] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('activity');
  const [restoring, setRestoring] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [activityData, versionsData] = await Promise.all([
        getActivity(projectId),
        getVersions(projectId)
      ]);
      setActivities(activityData.activities);
      setVersions(versionsData.versions);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVersion = async (versionId) => {
    if (!window.confirm('Are you sure you want to restore this version? This will create a new version with the current content.')) return;
    setRestoring(versionId);
    try {
      await restoreVersion(projectId, versionId);
      fetchData();
      setError('');
    } catch (err) {
      setError('Failed to restore version');
    } finally {
      setRestoring(null);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'project_created': return '🚀';
      case 'file_created': return '📄';
      case 'file_updated': return '✏️';
      case 'file_deleted': return '🗑️';
      case 'folder_created': return '📁';
      case 'folder_deleted': return '🗂️';
      case 'collaborator_added': return '👥';
      case 'collaborator_removed': return '👤';
      case 'project_updated': return '⚙️';
      case 'settings_updated': return '🔧';
      default: return '📝';
    }
  };

  const getActionDescription = (activity) => {
    const { action, details, userId } = activity;
    const userName = userId?.name || 'Unknown User';

    switch (action) {
      case 'project_created':
        return `${userName} created the project`;
      case 'file_created':
        return `${userName} created file "${details.fileName}"`;
      case 'file_updated':
        return `${userName} updated file "${details.fileName}"`;
      case 'file_deleted':
        return `${userName} deleted file "${details.fileName}"`;
      case 'folder_created':
        return `${userName} created folder "${details.fileName}"`;
      case 'folder_deleted':
        return `${userName} deleted folder "${details.fileName}"`;
      case 'collaborator_added':
        return `${userName} added a collaborator`;
      case 'collaborator_removed':
        return `${userName} removed a collaborator`;
      case 'project_updated':
        return `${userName} updated project settings`;
      case 'settings_updated':
        return `${userName} updated project settings`;
      default:
        return `${userName} performed action: ${action}`;
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading activity...</div>;
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Activity & Versions</h1>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Activity Log
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'versions'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              File Versions
            </button>
          </nav>
        </div>

        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
              <p className="text-gray-500">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{getActionIcon(activity.action)}</span>
                    <div className="flex-1">
                      <p className="text-gray-900">{getActionDescription(activity)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          <details>
                            <summary className="cursor-pointer">Details</summary>
                            <pre className="mt-1 whitespace-pre-wrap">
                              {JSON.stringify(activity.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'versions' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">File Versions</h2>
            {versions.length === 0 ? (
              <p className="text-gray-500">No versions yet</p>
            ) : (
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {version.fileId?.name || 'Unknown File'} (v{version.versionNumber})
                        </h3>
                        <p className="text-sm text-gray-600">
                          Created by {version.createdBy?.name || 'Unknown'} on {new Date(version.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(version._id)}
                        disabled={restoring === version._id}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        {restoring === version._id ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                    <div className="mb-2">
                      <strong>Changes:</strong> {version.changes}
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600">View Content</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                        {version.content}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
