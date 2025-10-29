import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EditorDemoPage = () => {
  const [activeTab, setActiveTab] = useState('javascript');
  const [typedCode, setTypedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeSnippets = {
    javascript: {
      language: 'javascript',
      code: [
        "// Real-time collaborative Fibonacci function",
        "function calculateFibonacci(n) {",
        "  if (n <= 1) return n;",
        "  return calculateFibonacci(n - 1) +",
        "         calculateFibonacci(n - 2);",
        "}",
        "",
        "// Team collaboration example",
        "const result = calculateFibonacci(10);",
        "console.log('Fibonacci result:', result);",
        "",
        "// Export for team use",
        "module.exports = { calculateFibonacci };"
      ]
    },
    python: {
      language: 'python',
      code: [
        "# Real-time collaborative Fibonacci function",
        "def calculate_fibonacci(n):",
        "    if n <= 1:",
        "        return n",
        "    return (calculate_fibonacci(n - 1) +",
        "            calculate_fibonacci(n - 2))",
        "",
        "# Team collaboration example",
        "result = calculate_fibonacci(10)",
        "print(f'Fibonacci result: {result}')",
        "",
        "# Export for team use",
        "if __name__ == '__main__':",
        "    main()"
      ]
    },
    react: {
      language: 'jsx',
      code: [
        "// Collaborative React component",
        "import React, { useState } from 'react';",
        "",
        "const TeamCounter = () => {",
        "  const [count, setCount] = useState(0);",
        "",
        "  const handleIncrement = () => {",
        "    setCount(prev => prev + 1);",
        "  };",
        "",
        "  return (",
        "    <div className='team-counter'>",
        "      <h3>Collaborative Counter</h3>",
        "      <p>Current count: {count}</p>",
        "      <button onClick={handleIncrement}>",
        "        Increment Together",
        "      </button>",
        "    </div>",
        "  );",
        "};",
        "",
        "export default TeamCounter;"
      ]
    }
  };

  const collaborators = [
    { name: 'Alice', color: 'bg-blue-400', position: { line: 3, char: 10 } },
    { name: 'Bob', color: 'bg-green-400', position: { line: 8, char: 15 } },
    { name: 'Charlie', color: 'bg-purple-400', position: { line: 5, char: 5 } }
  ];

  // Typewriter effect
  useEffect(() => {
    const currentSnippet = codeSnippets[activeTab];
    if (currentLine < currentSnippet.code.length) {
      const timer = setTimeout(() => {
        setTypedCode(prev => 
          prev + (prev ? '\n' : '') + currentSnippet.code[currentLine]
        );
        setCurrentLine(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLine, activeTab]);

  // Cursor blink effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  // Reset typing when tab changes
  useEffect(() => {
    setTypedCode('');
    setCurrentLine(0);
    setOutput('');
  }, [activeTab]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('Fibonacci result: 55\nCode executed successfully!');
      setIsRunning(false);
    }, 2000);
  };

  const renderCodeLine = (line, lineIndex) => {
    const currentSnippet = codeSnippets[activeTab];
    
    if (lineIndex >= currentSnippet.code.length) return null;

    return (
      <div key={lineIndex} className="flex">
        <span className="text-gray-500 w-8 text-right pr-3 select-none text-sm">
          {lineIndex + 1}
        </span>
        <span className="flex-1 font-mono text-sm">
          {renderSyntaxHighlightedLine(line, currentSnippet.language)}
        </span>
      </div>
    );
  };

  const renderSyntaxHighlightedLine = (line, language) => {
    if (language === 'javascript' || language === 'jsx') {
      return renderJavaScriptSyntax(line);
    } else if (language === 'python') {
      return renderPythonSyntax(line);
    }
    return <span className="text-gray-300">{line}</span>;
  };

  const renderJavaScriptSyntax = (line) => {
    if (line.includes('//')) {
      const commentIndex = line.indexOf('//');
      return (
        <>
          <span className="text-gray-300">{line.substring(0, commentIndex)}</span>
          <span className="text-green-600">{line.substring(commentIndex)}</span>
        </>
      );
    }

    if (line.includes('function') || line.includes('const') || line.includes('return')) {
      return <span className="text-purple-400">{line}</span>;
    }

    if (line.includes('if') || line.includes('return')) {
      return <span className="text-pink-400">{line}</span>;
    }

    if (line.match(/\b\d+\b/)) {
      return <span className="text-orange-400">{line}</span>;
    }

    if (line.includes('console') || line.includes('module')) {
      return <span className="text-yellow-400">{line}</span>;
    }

    return <span className="text-gray-300">{line}</span>;
  };

  const renderPythonSyntax = (line) => {
    if (line.includes('#')) {
      const commentIndex = line.indexOf('#');
      return (
        <>
          <span className="text-gray-300">{line.substring(0, commentIndex)}</span>
          <span className="text-green-600">{line.substring(commentIndex)}</span>
        </>
      );
    }

    if (line.includes('def') || line.includes('return')) {
      return <span className="text-purple-400">{line}</span>;
    }

    if (line.includes('if') || line.includes('print')) {
      return <span className="text-pink-400">{line}</span>;
    }

    if (line.match(/\b\d+\b/)) {
      return <span className="text-orange-400">{line}</span>;
    }

    return <span className="text-gray-300">{line}</span>;
  };

  const renderCollaboratorCursors = () => {
    return collaborators.map((collab, index) => (
      <div
        key={index}
        className={`absolute w-0.5 h-5 ${collab.color} animate-pulse`}
        style={{
          top: `${(collab.position.line) * 1.5}rem`,
          left: `${collab.position.char * 0.5 + 2}rem`,
          animationDelay: `${index * 500}ms`
        }}
      >
        <div className="absolute -top-6 -left-1 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {collab.name}
          <div className="absolute bottom-0 left-2 w-2 h-2 bg-gray-800 transform rotate-45 -mb-1"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            💻 Live Demo
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Experience
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Real-Time Coding</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            See how CodeCollab transforms team collaboration with powerful editing, live cursors, and instant code execution.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              {/* Editor Header */}
              <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  
                  {/* File Tabs */}
                  <div className="flex space-x-1">
                    {Object.keys(codeSnippets).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab
                            ? 'bg-gray-800 text-white border-t-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {tab === 'javascript' && 'fibonacci.js'}
                        {tab === 'python' && 'fibonacci.py'}
                        {tab === 'react' && 'Counter.jsx'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collaboration Status */}
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {collaborators.map((collab, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full border-2 border-gray-900 ${collab.color}`}
                        title={collab.name}
                      ></div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>
              </div>

              {/* Editor Body */}
              <div className="relative">
                <div className="p-6 font-mono text-sm leading-relaxed min-h-[400px] bg-gray-800">
                  <div className="relative">
                    {typedCode.split('\n').map((line, index) => 
                      renderCodeLine(line, index)
                    )}
                    
                    {/* Main Cursor */}
                    {showCursor && (
                      <div className="absolute w-0.5 h-5 bg-white animate-pulse" 
                           style={{ top: `${currentLine * 1.5}rem`, left: '2rem' }}>
                      </div>
                    )}

                    {/* Collaborator Cursors */}
                    <div className="group">
                      {renderCollaboratorCursors()}
                    </div>
                  </div>
                </div>

                {/* Editor Footer */}
                <div className="bg-gray-900 px-6 py-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>Ln {currentLine}, Col {typedCode.split('\n')[currentLine - 1]?.length || 0}</span>
                    <span>UTF-8</span>
                    <span>{codeSnippets[activeTab].language.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Spaces: 2</span>
                    <span>All changes saved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Code...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
          </div>

          {/* Output & Features */}
          <div className="space-y-6">
            {/* Output Panel */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Output
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 min-h-[100px]">
                {output || 'Run the code to see output here...'}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">✨ Editor Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: '🎯', feature: 'IntelliSense & Auto-completion', desc: 'Smart code suggestions' },
                  { icon: '👥', feature: 'Live Collaboration', desc: 'See teammates typing in real-time' },
                  { icon: '🚀', feature: 'One-click Execution', desc: 'Run code in 40+ languages' },
                  { icon: '🎨', feature: 'Syntax Highlighting', desc: '50+ programming languages' },
                  { icon: '💬', feature: 'Integrated Chat', desc: 'Discuss code without leaving editor' },
                  { icon: '🔄', feature: 'Version History', desc: 'Track changes and revert easily' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="text-white text-sm font-medium">{item.feature}</div>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Ready to Code Together?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Start collaborating with your team in seconds
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Start Free Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDemoPage;