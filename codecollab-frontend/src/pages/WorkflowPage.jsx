import React from 'react';
import { Link } from 'react-router-dom';

const WorkflowPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Project',
      description: 'Start a new project from scratch or choose from our templates. Set up your workspace in seconds.',
      icon: '🚀',
      features: ['New project wizard', 'Template gallery', 'Quick setup'],
      image: (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-400">New Project</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-xs">📁</span>
              </div>
              <span className="text-sm text-gray-300">my-project/</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-xs">📄</span>
              </div>
              <span className="text-sm text-gray-300">package.json</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-xs">📄</span>
              </div>
              <span className="text-sm text-gray-300">src/</span>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Invite Collaborators',
      description: 'Bring your team onboard with email invitations or shareable links. Set permissions and roles.',
      icon: '👥',
      features: ['Email invitations', 'Shareable links', 'Role-based permissions'],
      image: (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Invite Team Members</h4>
            <div className="flex space-x-2 mb-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-white">A</div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-white">B</div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-white">C</div>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-gray-300">+</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm text-gray-300">alice@company.com</span>
                <span className="text-xs bg-blue-500 px-2 py-1 rounded">Editor</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm text-gray-300">bob@company.com</span>
                <span className="text-xs bg-green-500 px-2 py-1 rounded">Viewer</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Edit & Debug Together',
      description: 'Collaborate in real-time with live editing, shared terminals, and integrated debugging tools.',
      icon: '💻',
      features: ['Real-time editing', 'Live cursors', 'Shared debugging'],
      image: (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">app.js • 3 collaborators</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>
          <div className="font-mono text-sm space-y-1">
            <div className="flex">
              <span className="text-gray-500 w-8">1</span>
              <span className="text-blue-400">function</span>
              <span className="text-yellow-200"> Welcome</span>
              <span className="text-white">() {`{`}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-8">2</span>
              <span className="text-gray-400 ml-4">  return (</span>
            </div>
            <div className="flex relative">
              <span className="text-gray-500 w-8">3</span>
              <span className="text-gray-400 ml-8">    &lt;div&gt;</span>
              <div className="absolute left-20 top-0 w-0.5 h-4 bg-blue-400 animate-pulse"></div>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-8">4</span>
              <span className="text-gray-400 ml-12">      &lt;h1&gt;Welcome!&lt;/h1&gt;</span>
            </div>
            <div className="flex relative">
              <span className="text-gray-500 w-8">5</span>
              <span className="text-gray-400 ml-12">      &lt;p&gt;Collaborating...&lt;/p&gt;</span>
              <div className="absolute left-24 top-0 w-0.5 h-4 bg-green-400 animate-pulse delay-1000"></div>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-8">6</span>
              <span className="text-gray-400 ml-8">    &lt;/div&gt;</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-8">7</span>
              <span className="text-gray-400 ml-4">  );</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-8">8</span>
              <span className="text-white">{`}`}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '04',
      title: 'Deploy & Export',
      description: 'Deploy directly to your favorite platforms or export your project with all dependencies.',
      icon: '🌐',
      features: ['One-click deploy', 'Multiple platforms', 'Export options'],
      image: (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-3">Deploy Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-700 p-3 rounded-lg text-center hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="text-lg mb-1">▲</div>
                <span className="text-xs text-gray-300">Vercel</span>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="text-lg mb-1">☁️</div>
                <span className="text-xs text-gray-300">Netlify</span>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="text-lg mb-1">📦</div>
                <span className="text-xs text-gray-300">Export ZIP</span>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="text-lg mb-1">🐙</div>
                <span className="text-xs text-gray-300">GitHub</span>
              </div>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Deployment successful</span>
            </div>
            <span className="text-xs text-gray-300 block mt-1">https://my-project.codecollab.app</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="pt-20 pb-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            🛠️ Workflow
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple & Powerful
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Collaboration Flow</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From project creation to deployment, CodeCollab streamlines your team's workflow with intuitive tools and real-time collaboration.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 transform -translate-x-1/2"></div>
          
          {/* Steps */}
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 lg:w-1/2">
                  <div className="max-w-lg mx-auto lg:mx-0">
                    {/* Step Number & Icon */}
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                        {step.number}
                      </div>
                      <div className="text-2xl">{step.icon}</div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Step Indicator for Mobile */}
                    <div className="lg:hidden flex items-center justify-center my-8">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        ↓
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Demo */}
                <div className="flex-1 lg:w-1/2">
                  <div className="max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
                    {step.image}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Streamline Your Team's Workflow?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of teams that are already collaborating more effectively with CodeCollab.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Start Your First Project
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
              >
                Watch Demo Video
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">85%</div>
            <div className="text-gray-400 text-sm">Faster Onboarding</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">60%</div>
            <div className="text-gray-400 text-sm">Less Meeting Time</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">3x</div>
            <div className="text-gray-400 text-sm">Faster Debugging</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Team Collaboration</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WorkflowPage;