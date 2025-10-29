import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annual'

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individual developers and small projects',
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        'Up to 3 collaborators',
        '5 projects',
        '10GB storage',
        'Basic code editor',
        'Real-time collaboration',
        'Community support'
      ],
      limitations: [
        'No deployment integration',
        'Limited version history',
        'Basic file management'
      ],
      popular: false,
      cta: 'Get Started',
      href: '/register'
    },
    {
      name: 'Pro',
      description: 'Everything you need for professional development teams',
      price: {
        monthly: 19,
        annual: 15
      },
      features: [
        'Up to 10 collaborators',
        'Unlimited projects',
        '100GB storage',
        'Advanced Monaco Editor',
        'Real-time collaboration',
        'Priority support',
        'One-click deployment',
        'Version history (30 days)',
        'Team management',
        'Private projects'
      ],
      limitations: [],
      popular: true,
      cta: 'Start Free Trial',
      href: '/register?plan=pro'
    },
    {
      name: 'Enterprise',
      description: 'Advanced features for large organizations and enterprises',
      price: {
        monthly: 49,
        annual: 39
      },
      features: [
        'Unlimited collaborators',
        'Unlimited projects',
        '1TB+ storage',
        'Advanced Monaco Editor',
        'Real-time collaboration',
        '24/7 dedicated support',
        'Advanced deployment options',
        'Unlimited version history',
        'Advanced team management',
        'SSO & SAML integration',
        'Custom security policies',
        'API access',
        'Custom onboarding',
        'SLA guarantee'
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact'
    }
  ];

  const savings = {
    starter: 0,
    pro: 21, // (19-15)*12 / 19*12 * 100
    enterprise: 20 // (49-39)*12 / 49*12 * 100
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            💰 Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your team. All plans include core collaboration features. 
            Scale as your team grows.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'annual'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-gray-800 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20 transform scale-105'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.annual}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-400 ml-2 text-lg">
                        /{billingPeriod === 'monthly' ? 'month' : 'month'}
                      </span>
                    )}
                  </div>
                  {plan.price.monthly > 0 && billingPeriod === 'annual' && (
                    <div className="text-green-400 text-sm mt-2">
                      Save ${(plan.price.monthly - plan.price.annual) * 12} annually
                    </div>
                  )}
                  {plan.price.monthly === 0 && (
                    <div className="text-green-400 text-sm mt-2">
                      Free forever
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to={plan.href}
                  className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105'
                      : plan.price.monthly === 0
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-gray-400 font-semibold text-sm uppercase tracking-wider mt-6">
                        Limitations:
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {/* <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Compare Plans
            </h3>
            <p className="text-gray-300">
              Detailed feature comparison to help you choose the right plan
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-6 text-white font-semibold">Feature</th>
                  <th className="p-6 text-center text-gray-400 font-semibold">Starter</th>
                  <th className="p-6 text-center text-blue-400 font-semibold">Pro</th>
                  <th className="p-6 text-center text-purple-400 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Collaborators', '3', '10', 'Unlimited'],
                  ['Projects', '5', 'Unlimited', 'Unlimited'],
                  ['Storage', '10GB', '100GB', '1TB+'],
                  ['Real-time Collaboration', '✓', '✓', '✓'],
                  ['Deployment Integration', '✗', '✓', '✓'],
                  ['Version History', '7 days', '30 days', 'Unlimited'],
                  ['Priority Support', '✗', '✓', '24/7 Dedicated'],
                  ['SSO Integration', '✗', '✗', '✓'],
                  ['SLA Guarantee', '✗', '✗', '✓'],
                  ['API Access', '✗', 'Limited', 'Full']
                ].map(([feature, starter, pro, enterprise], index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-b-0">
                    <td className="p-6 text-gray-300 font-medium">{feature}</td>
                    <td className="p-6 text-center text-gray-400">{starter}</td>
                    <td className="p-6 text-center text-blue-400">{pro}</td>
                    <td className="p-6 text-center text-purple-400">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* FAQ Section */}
        {/* <div className="max-w-3xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, all paid plans include a 14-day free trial. No credit card required."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "Do you offer discounts for nonprofits?",
                answer: "Yes, we offer 50% discount for registered nonprofit organizations."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                <p className="text-gray-300 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
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
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Free Today
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-gray-700/50"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Pricing;