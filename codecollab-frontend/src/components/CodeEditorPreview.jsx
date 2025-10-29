import React, { useState, useEffect } from 'react';

const CodeEditorPreview = () => {
  const [activeTab, setActiveTab] = useState('javascript');
  const [typedCode, setTypedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const codeSnippets = {
    javascript: {
      language: 'javascript',
      code: [
        "// Real-time collaborative function",
        "function calculateFibonacci(n) {",
        "  if (n <= 1) return n;",
        "  return calculateFibonacci(n - 1) +",
        "         calculateFibonacci(n - 2);",
        "}",
        "",
        "// Team collaboration in action",
        "const result = calculateFibonacci(10);",
        "console.log('Result:', result);",
        "",
        "// Export for team use",
        "module.exports = { calculateFibonacci };"
      ]
    },
    python: {
      language: 'python',
      code: [
        "# Real-time collaborative function",
        "def calculate_fibonacci(n):",
        "    if n <= 1:",
        "        return n",
        "    return (calculate_fibonacci(n - 1) +",
        "            calculate_fibonacci(n - 2))",
        "",
        "# Team collaboration in action",
        "result = calculate_fibonacci(10)",
        "print(f'Result: {result}')",
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
        "const TeamComponent = () => {",
        "  const [count, setCount] = useState(0);",
        "",
        "  const handleClick = () => {",
        "    setCount(prev => prev + 1);",
        "  };",
        "",
        "  return (",
        "    <div className='team-component'>",
        "      <h3>Collaborative Counter</h3>",
        "      <p>Count: {count}</p>",
        "      <button onClick={handleClick}>",
        "        Increment",
        "      </button>",
        "    </div>",
        "  );",
        "};",
        "",
        "export default TeamComponent;"
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
  }, [activeTab]);

  const renderCodeLine = (line, lineIndex) => {
    const currentSnippet = codeSnippets[activeTab];
    
    if (lineIndex >= currentSnippet.code.length) return null;

    return (
      <div key={lineIndex} className="flex">
        <span className="text-gray-500 w-8 text-right pr-3 select-none">
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
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            💻 Professional Editor
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powered by
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Monaco Editor</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the same editing power as VS Code with real-time collaboration, 
            intelligent code completion, and seamless team integration.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Editor Container */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
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
                      {tab === 'javascript' && 'app.js'}
                      {tab === 'python' && 'main.py'}
                      {tab === 'react' && 'Component.jsx'}
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

          {/* Features Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">IntelliSense</h3>
              <p className="text-gray-300 text-sm">
                Smart code completion, parameter info, and quick suggestions
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Collaboration</h3>
              <p className="text-gray-300 text-sm">
                See teammates' cursors and edits in real-time
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="text-2xl mb-3">🌙</div>
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Themes</h3>
              <p className="text-gray-300 text-sm">
                Dark, light, and custom themes for comfortable coding
              </p>
            </div>
          </div> */}

          {/* Bottom CTA */}
          {/* <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Experience the full power of our code editor with your team
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Coding Together
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CodeEditorPreview;