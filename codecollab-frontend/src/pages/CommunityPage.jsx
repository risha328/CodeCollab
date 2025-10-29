import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  const discussions = [
    {
      id: 1,
      title: 'Best practices for real-time collaboration?',
      author: 'Sarah Chen',
      avatar: 'SC',
      replies: 24,
      views: 156,
      timestamp: '2 hours ago',
      category: 'Collaboration',
      pinned: true
    },
    {
      id: 2,
      title: 'How to integrate CodeCollab with existing CI/CD pipeline?',
      author: 'Mike Rodriguez',
      avatar: 'MR',
      replies: 18,
      views: 203,
      timestamp: '5 hours ago',
      category: 'Integration',
      pinned: false
    },
    {
      id: 3,
      title: 'Feature request: Dark theme improvements',
      author: 'Alex Thompson',
      avatar: 'AT',
      replies: 42,
      views: 312,
      timestamp: '1 day ago',
      category: 'Feedback',
      pinned: true
    },
    {
      id: 4,
      title: 'Troubleshooting: Connection issues in large teams',
      author: 'Priya Patel',
      avatar: 'PP',
      replies: 15,
      views: 189,
      timestamp: '1 day ago',
      category: 'Support',
      pinned: false
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Live Q&A: Advanced Collaboration Features',
      date: 'Dec 15, 2024',
      time: '2:00 PM EST',
      type: 'webinar',
      attendees: 45,
      speaker: 'Emma Davis, Product Lead'
    },
    {
      id: 2,
      title: 'CodeCollab Hackathon 2024',
      date: 'Jan 20-21, 2025',
      time: 'All Day',
      type: 'hackathon',
      attendees: 120,
      speaker: 'Community Team'
    },
    {
      id: 3,
      title: 'Workshop: Mastering Real-time Debugging',
      date: 'Dec 22, 2024',
      time: '11:00 AM EST',
      type: 'workshop',
      attendees: 78,
      speaker: 'David Kim, Senior Engineer'
    }
  ];

  const contributors = [
    { name: 'Sarah Chen', role: 'Top Contributor', contributions: 142, avatar: 'SC' },
    { name: 'Mike Rodriguez', role: 'Bug Hunter', contributions: 89, avatar: 'MR' },
    { name: 'Alex Thompson', role: 'Feature Advocate', contributions: 67, avatar: 'AT' },
    { name: 'Priya Patel', role: 'Community Helper', contributions: 54, avatar: 'PP' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20">
      {/* Header */}
      <div className="relative pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            👥 Community
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Join the
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> CodeCollab Community</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Connect with developers worldwide, share knowledge, and collaborate on amazing projects together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
              Join Discussion
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50">
              Share Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-400 text-sm">Developers</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">5K+</div>
            <div className="text-gray-400 text-sm">Projects</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">2K+</div>
            <div className="text-gray-400 text-sm">Discussions</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1 border border-gray-700">
              {['discussions', 'events', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Discussions */}
            {activeTab === 'discussions' && (
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {discussion.avatar}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{discussion.title}</h3>
                          <p className="text-gray-400 text-sm">
                            By {discussion.author} • {discussion.timestamp}
                          </p>
                        </div>
                      </div>
                      {discussion.pinned && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                        {discussion.category}
                      </span>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <span>💬 {discussion.replies} replies</span>
                        <span>👁️ {discussion.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Events */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <span>📅 {event.date}</span>
                          <span>⏰ {event.time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.type === 'webinar' ? 'bg-purple-500/20 text-purple-300' :
                            event.type === 'hackathon' ? 'bg-green-500/20 text-green-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">👤 {event.speaker}</span>
                      <span className="text-gray-400 text-sm">👥 {event.attendees} attending</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {activeTab === 'projects' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-2">Community Projects</h3>
                <p className="text-gray-400 mb-6">Discover amazing projects built by the CodeCollab community</p>
                <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200">
                  Explore Projects
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">🏆 Top Contributors</h3>
              <div className="space-y-4">
                {contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {contributor.avatar}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{contributor.name}</div>
                        <div className="text-gray-400 text-xs">{contributor.role}</div>
                      </div>
                    </div>
                    <div className="text-blue-400 text-sm">{contributor.contributions}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-white text-sm">Start New Discussion</span>
                  <span className="text-blue-400">+</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-white text-sm">Join Event</span>
                  <span className="text-green-400">📅</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="text-white text-sm">Share Project</span>
                  <span className="text-purple-400">🚀</span>
                </button>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold text-lg mb-3">📜 Community Guidelines</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Be respectful and inclusive</li>
                <li>• Share knowledge generously</li>
                <li>• Keep discussions constructive</li>
                <li>• Give credit where it's due</li>
                <li>• Help others learn and grow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;