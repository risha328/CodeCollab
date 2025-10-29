import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Use Cases', href: '/use-cases' },
        { name: 'Demo', href: '/demo' },
        { name: 'API', href: '/api' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Community', href: '/community' },
        { name: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'GitHub', href: 'https://github.com/codecollab' },
        { name: 'Twitter', href: 'https://twitter.com/codecollab' },
        { name: 'LinkedIn', href: 'https://linkedin.com/company/codecollab' },
        { name: 'Discord', href: 'https://discord.gg/codecollab' },
        { name: 'YouTube', href: 'https://youtube.com/codecollab' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="text-xl font-bold text-white">CodeCollab</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                The modern platform for real-time collaborative coding. Build, debug, and deploy together with your team from anywhere in the world.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'GitHub', icon: '🐙', href: 'https://github.com/codecollab' },
                  { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/codecollab' },
                  { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/company/codecollab' },
                  { name: 'Discord', icon: '💬', href: 'https://discord.gg/codecollab' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} CodeCollab. All rights reserved.
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/security" className="text-gray-400 hover:text-white transition-colors">
                Security
              </Link>
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        {/* <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              Trusted by 10,000+ developers worldwide
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              {/* Security Badges */}
              {/* <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">GDPR Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-xs">Enterprise Grade</span>
              </div>
            </div>
          </div>
        </div> */} 

        {/* CTA Banner */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 mb-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-left">
              <h3 className="text-white font-bold text-lg mb-1">
                Ready to transform your team's workflow?
              </h3>
              <p className="text-blue-100 text-sm">
                Start collaborating with your team today. No credit card required.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/demo"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;