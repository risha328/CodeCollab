import React from 'react';
import { Link } from 'react-router-dom';

const Workflow = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Project',
      description: 'Start coding instantly with templates or from scratch.',
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'Invite Team',
      description: 'Bring collaborators onboard with shareable links.',
      icon: '👥',
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '03',
      title: 'Code Together',
      description: 'Real-time editing with live cursors and chat.',
      icon: '💻',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      number: '04',
      title: 'Deploy',
      description: 'One-click deployment to your favorite platforms.',
      icon: '🌐',
      color: 'from-orange-500 to-amber-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
            ⚡ Quick Start
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Coding Together in
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> 4 Simple Steps</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your team collaborating in minutes with our streamlined workflow.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute left-0 right-0 top-12 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-orange-500 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group text-center"
              >
                {/* Step Circle */}
                <div className={`relative mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-900">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                      ↓
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-12">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 max-w-2xl mx-auto">
            <p className="text-gray-300 mb-6">
              Ready to transform how your team codes together?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Free
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
              >
                Learn More
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div> */}

        {/* Mini Stats */}
        {/* <div className="grid grid-cols-3 gap-6 mt-12 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">85%</div>
            <div className="text-xs text-gray-400">Faster Setup</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">60%</div>
            <div className="text-xs text-gray-400">Less Meetings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">3x</div>
            <div className="text-xs text-gray-400">Faster Coding</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Workflow;