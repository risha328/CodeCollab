import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const features = {
    core: [
      {
        id: 1,
        title: "User Authentication & Profiles",
        description: "Secure sign up/login with email or Google. Complete profiles with skills, bio, and online status.",
        icon: "🔐",
        status: "live",
        category: "core",
        details: [
          "Firebase & JWT authentication",
          "Profile management with avatar",
          "Skills tagging system",
          "Online/offline status indicator",
          "Last active tracking"
        ]
      },
      {
        id: 2,
        title: "Project & File Management",
        description: "Create, organize, and manage multiple projects with advanced file operations.",
        icon: "📁",
        status: "live",
        category: "core",
        details: [
          "Multi-project workspace",
          "File and folder organization",
          "Clone project functionality",
          "Project templates",
          "Drag & drop file management"
        ]
      },
      {
        id: 3,
        title: "Real-Time Code Editor",
        description: "Powerful Monaco-based editor with live collaboration and instant synchronization.",
        icon: "⚡",
        status: "live",
        category: "core",
        details: [
          "Monaco Editor integration",
          "WebSocket real-time sync",
          "Live keystroke broadcasting",
          "Multi-cursor support",
          "Conflict resolution"
        ]
      },
      {
        id: 4,
        title: "Syntax Highlighting & Languages",
        description: "Full support for 50+ programming languages with intelligent auto-detection.",
        icon: "🎨",
        status: "live",
        category: "core",
        details: [
          "50+ language support",
          "Automatic language detection",
          "Custom syntax themes",
          "Language-specific snippets",
          "IntelliSense auto-completion"
        ]
      },
      {
        id: 5,
        title: "Version History & Snapshots",
        description: "Comprehensive version control with diff viewing and restoration capabilities.",
        icon: "🕰️",
        status: "live",
        category: "core",
        details: [
          "Auto-save versions",
          "Timeline-based history",
          "Git-like diff viewer",
          "One-click restoration",
          "Version comparisons"
        ]
      },
      {
        id: 6,
        title: "File Explorer Sidebar",
        description: "Intuitive file navigation with advanced context menus and quick actions.",
        icon: "📊",
        status: "live",
        category: "core",
        details: [
          "Collapsible sidebar",
          "Right-click context menu",
          "File search & filter",
          "Drag & drop reorganization",
          "Quick file creation"
        ]
      },
      {
        id: 7,
        title: "Dark/Light Theme Toggle",
        description: "VS Code-inspired themes with persistent user preferences across devices.",
        icon: "🌙",
        status: "live",
        category: "core",
        details: [
          "Multiple theme options",
          "System preference detection",
          "Persistent settings",
          "Custom theme support",
          "Accessibility focused"
        ]
      },
      {
        id: 8,
        title: "Run Code & Compiler Integration",
        description: "Execute code in 40+ languages with Judge0 API integration and real-time output.",
        icon: "🚀",
        status: "live",
        category: "core",
        details: [
          "40+ language execution",
          "Judge0 API integration",
          "Real-time console output",
          "Execution time tracking",
          "Input/output handling"
        ]
      }
    ],
    collaboration: [
      {
        id: 9,
        title: "Real-Time Chat",
        description: "Dedicated chat rooms per project with advanced messaging features.",
        icon: "💬",
        status: "live",
        category: "collaboration",
        details: [
          "Project-specific chat rooms",
          "@mention system",
          "Markdown formatting",
          "File sharing in chat",
          "Message history"
        ]
      },
      {
        id: 10,
        title: "Live Cursor Presence",
        description: "See collaborators' cursors in real-time with unique colors and identification.",
        icon: "👆",
        status: "live",
        category: "collaboration",
        details: [
          "Multi-color cursor tracking",
          "User identification labels",
          "Live selection highlighting",
          "Cursor position sync",
          "Presence indicators"
        ]
      },
      {
        id: 11,
        title: "Commenting System",
        description: "GitHub-like inline comments with threaded discussions and resolution tracking.",
        icon: "💭",
        status: "live",
        category: "collaboration",
        details: [
          "Inline code comments",
          "Threaded discussions",
          "Comment resolution",
          "@mention in comments",
          "Email notifications"
        ]
      },
      {
        id: 12,
        title: "Collaboration Invitations & Access Control",
        description: "Advanced permission system with flexible access levels and public sharing.",
        icon: "👥",
        status: "live",
        category: "collaboration",
        details: [
          "Email invitation system",
          "Role-based permissions",
          "Public project links",
          "View/Edit/Comment roles",
          "Invitation management"
        ]
      },
      {
        id: 13,
        title: "Activity Feed & Timeline",
        description: "Comprehensive activity logging with real-time updates and filtering.",
        icon: "📝",
        status: "live",
        category: "collaboration",
        details: [
          "Real-time activity stream",
          "User action tracking",
          "Project timeline",
          "Filterable activities",
          "Export activity reports"
        ]
      },
      {
        id: 14,
        title: "Notifications System",
        description: "Smart notification system with real-time alerts and preference management.",
        icon: "🔔",
        status: "live",
        category: "collaboration",
        details: [
          "Real-time push notifications",
          "In-app alert system",
          "Customizable preferences",
          "Email digests",
          "Mute/Unmute controls"
        ]
      }
    ]
  };

  const allFeatures = [...features.core, ...features.collaboration];

  const filteredFeatures = activeCategory === 'all' 
    ? allFeatures 
    : allFeatures.filter(feature => feature.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Features', count: allFeatures.length },
    { id: 'core', name: 'Core Features', count: features.core.length },
    { id: 'collaboration', name: 'Collaboration', count: features.collaboration.length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-20">
      {/* Header */}
      <header className="relative pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            🚀 Powerful Features
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Code Together</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            CodeCollab provides a comprehensive suite of tools designed for modern development teams. 
            From real-time editing to advanced collaboration features, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Start Coding Free
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-800/50"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.name}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-700 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    {feature.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Coding Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already collaborating smarter with CodeCollab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Coding Free
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Sales
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            No credit card required • Free forever for individual developers
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-400">Programming Languages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">10k+</div>
              <div className="text-gray-400">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime Reliability</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-gray-400">Real-time Sync</div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default FeaturesPage;