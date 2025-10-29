import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);

  const codeSnippet = [
    "function collaborativeCode() {",
    "  // Real-time collaboration",
    "  const socket = new WebSocket('ws://codecollab');",
    "  ",
    "  socket.on('code-update', (data) => {",
    "    editor.setValue(data.code);",
    "    highlightUserCursor(data.user);",
    "  });",
    "  ",
    "  return {",
    "    liveEditing: true,",
    "    multiUser: true,",
    "    versionControl: 'integrated'",
    "  };",
    "}"
  ];

  const toggleDemo = () => {
    setShowDemo(!showDemo);
  };

  useEffect(() => {
    if (currentLine < codeSnippet.length) {
      const timer = setTimeout(() => {
        setTypedText(prev => prev + (prev ? '\n' : '') + codeSnippet[currentLine]);
        setCurrentLine(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 animate-pulse">
            <code className="text-sm">&lt;CodeCollab /&gt;</code>
          </div>
          <div className="absolute top-40 right-20 animate-bounce delay-300">
            <code className="text-sm">npm start</code>
          </div>
          <div className="absolute bottom-40 left-20 animate-pulse delay-700">
            <code className="text-sm">git commit -m "collab"</code>
          </div>
          <div className="absolute bottom-20 right-10 animate-bounce delay-1000">
            <code className="text-sm">const team = developers;</code>
          </div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-4">
                  🚀 Real-time Collaborative Coding
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Build Better Code,{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Together
                  </span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                CodeCollab brings developers together with real-time collaboration, 
                seamless code sharing, and powerful team features. Code, review, 
                and deploy together from anywhere in the world.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/projects"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Coding Free
                  </Link>
                  <button
                    onClick={toggleDemo}
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-800/50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Live Demo
                  </button>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Real-time Sync</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Multi-language</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Team Workspaces</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Code Editor */}
            <div className="relative">
              <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                {/* Editor Header */}
                <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">collaboration.js</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-900"></div>
                      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <span className="text-xs text-gray-400">3 collaborators</span>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm">
                  <pre className="text-gray-300 leading-relaxed">
                    <code>
                      {typedText}
                      <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
                    </code>
                  </pre>
                </div>

                {/* Live Collaboration Indicator */}
                <div className="bg-gray-900 px-4 py-2 border-t border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Live • All changes saved</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Powered by CodeCollab
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-6xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Live Collaboration Demo</h2>
              <button
                onClick={toggleDemo}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User 1 Editor */}
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-300">Alice - Frontend</span>
                </div>
                <div className="p-4 font-mono text-sm">
                  <pre className="text-green-400">
{`function Welcome() {
  return (
    <div className="p-6">
      <h1>Welcome to CodeCollab!</h1>
      <p>Real-time collaboration</p>
    </div>
  );
}`}
                  </pre>
                  <div className="mt-2 text-blue-400 animate-pulse">
                    <span>│</span>
                  </div>
                </div>
              </div>

              {/* User 2 Editor */}
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-300">Bob - Backend</span>
                </div>
                <div className="p-4 font-mono text-sm">
                  <pre className="text-green-400">
{`function Welcome() {
  return (
    <div className="p-6">
      <h1>Welcome to CodeCollab!</h1>
      <p>Real-time collaboration</p>
      <button>Get Started</button>
    </div>
  );
}`}
                  </pre>
                  <div className="mt-2 text-blue-400 animate-pulse delay-1000">
                    <span>│</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live changes syncing between users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Multiple cursors visible in real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;