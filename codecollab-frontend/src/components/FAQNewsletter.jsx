import React, { useState } from 'react';

const FAQNewsletter = () => {
  const [openItems, setOpenItems] = useState({});
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const faqs = [
    {
      question: "How does real-time collaboration work?",
      answer: "CodeCollab uses WebSocket technology to synchronize code changes instantly across all connected users. Every keystroke, cursor movement, and edit is broadcast in real-time, ensuring all team members see the same code simultaneously."
    },
    {
      question: "Is my code secure and private?",
      answer: "Yes, all code is encrypted in transit and at rest. You have full control over project visibility - keep projects private, share with specific collaborators, or make them public. We never access or store your code without permission."
    },
    {
      question: "How many collaborators can join a project?",
      answer: "The free plan supports up to 5 collaborators per project. Pro plans support up to 25 collaborators, and Enterprise plans offer unlimited collaborators with advanced permission controls."
    },
    {
      question: "What programming languages are supported?",
      answer: "We support 50+ languages including JavaScript, Python, Java, C++, PHP, Ruby, Go, Rust, and more. Our Monaco-based editor provides full syntax highlighting, IntelliSense, and language-specific features."
    },
    {
      question: "Can I deploy directly from CodeCollab?",
      answer: "Yes! We offer one-click deployment to platforms like Vercel, Netlify, and GitHub Pages. You can also export your project as a ZIP file or push directly to your Git repository."
    },
    {
      question: "Do you offer team management features?",
      answer: "Absolutely. Create teams, manage permissions, set role-based access controls, track activity logs, and use our integrated chat and commenting system for seamless team collaboration."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription API call
      console.log('Subscribing:', email);
      setIsSubscribed(true);
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
              ❓ FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Questions</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get answers to common questions about CodeCollab features, security, and collaboration.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-gray-600"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <span className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-blue-400 transform transition-transform duration-300 ${
                      openItems[index] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`px-6 transition-all duration-300 overflow-hidden ${
                    openItems[index] ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 md:p-12 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium mb-6">
              📧 Stay Updated
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Never Miss an Update
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Get notified about new features, beta releases, and platform improvements. 
              Join thousands of developers staying ahead with CodeCollab.
            </p>

            {isSubscribed ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-semibold">Successfully Subscribed!</span>
                </div>
                <p className="text-green-300 mt-2">
                  Thank you for subscribing. We'll keep you updated with the latest news.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  No spam ever. Unsubscribe at any time.
                </p>
              </form>
            )}

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-4">
                Join 10,000+ developers already using CodeCollab
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Weekly updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Beta access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Feature previews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </a>
            <a
              href="/docs"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-600 hover:border-green-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQNewsletter;