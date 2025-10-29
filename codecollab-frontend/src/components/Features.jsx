import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: '👥',
      title: 'Real-Time Collaboration',
      description: 'Code together in real-time with multiple developers. See changes instantly with live cursor tracking and synchronized editing.',
      highlights: ['Live multi-user editing', 'Cursor presence indicators', 'Instant synchronization'],
      color: 'blue'
    },
    {
      icon: '⚡',
      title: 'Powerful Code Editor',
      description: 'Monaco Editor powered with syntax highlighting, IntelliSense, and support for 50+ programming languages.',
      highlights: ['Monaco Editor', '50+ languages', 'IntelliSense'],
      color: 'green'
    },
    {
      icon: '🚀',
      title: 'Run Code Instantly',
      description: 'Execute code in 40+ languages with our integrated compiler. Get real-time output and debugging information.',
      highlights: ['40+ languages', 'Real-time output', 'Debugging tools'],
      color: 'purple'
    },
    {
      icon: '💬',
      title: 'Integrated Chat',
      description: 'Communicate with your team without leaving the editor. Share code snippets and discuss changes in real-time.',
      highlights: ['Project chat rooms', 'Code snippet sharing', '@mentions'],
      color: 'pink'
    },
    {
      icon: '🕰️',
      title: 'Version History',
      description: 'Never lose work with automatic version snapshots. Restore previous states and compare changes easily.',
      highlights: ['Auto-save versions', 'One-click restore', 'Diff comparison'],
      color: 'orange'
    },
    {
      icon: '🔐',
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted connections and flexible permission controls for your projects.',
      highlights: ['Encrypted connections', 'Role-based access', 'Private projects'],
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-indigo-500',
      pink: 'from-pink-500 to-rose-500',
      orange: 'from-orange-500 to-amber-500',
      red: 'from-red-500 to-pink-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            ✨ Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Code Together</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            CodeCollab provides all the tools your team needs to collaborate effectively, 
            from real-time editing to integrated communication.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/50 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getColorClasses(feature.color)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${getColorClasses(feature.color)} mb-4 text-2xl`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <svg className={`w-4 h-4 mr-2 text-${feature.color}-400 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center">
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Collaborating?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing projects together on CodeCollab.
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
                to="/features"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
              >
                View All Features
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div> */}

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-gray-400 text-sm">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">10k+</div>
            <div className="text-gray-400 text-sm">Active Developers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Real-time Sync</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Features;