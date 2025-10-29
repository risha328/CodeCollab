const jwt = require('jsonwebtoken');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const util = require('util');
const execAsync = util.promisify(exec);
const axios = require('axios');

// Execute code
const executeCode = async (req, res) => {
  try {
    const { projectId, code, language } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    let output = '';
    let error = '';

    try {
      // Use Judge0 API for all languages
      const judge0Response = await executeWithJudge0(code, language);
      output = judge0Response.output || '';
      error = judge0Response.error || '';
    } catch (execError) {
      output = `Execution failed. Error: ${execError.message}\n`;
      error = execError.message;
    }

    res.json({
      output: output.trim(),
      error: error.trim(),
      language: language
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ message: 'Server error during code execution' });
  }
};

// Judge0 language ID mapping - comprehensive support for executable languages
const JUDGE0_LANGUAGES = {
  // C/C++
  'c': 50,
  'cpp': 54,
  'cc': 54,
  'cxx': 54,
  'c++': 54,

  // Java
  'java': 62,

  // Python
  'python': 71,
  'py': 71,
  'pyc': 71,
  'pyw': 71,
  'pyo': 71,

  // JavaScript/TypeScript
  'javascript': 63,
  'js': 63,
  'jsx': 63,
  'mjs': 63,
  'cjs': 63,
  'typescript': 74,
  'ts': 74,
  'tsx': 74,

  // Ruby
  'ruby': 72,
  'rb': 72,

  // Go
  'go': 60,

  // Rust
  'rust': 73,
  'rs': 73,

  // PHP
  'php': 68,

  // Swift
  'swift': 83,

  // Kotlin
  'kotlin': 78,
  'kt': 78,

  // Scala
  'scala': 81,

  // Dart
  'dart': 84,

  // Perl
  'perl': 85,

  // Lua
  'lua': 64,

  // R
  'r': 80,

  // Haskell
  'haskell': 61,

  // Clojure
  'clojure': 86,

  // Erlang
  'erlang': 58,

  // Elixir
  'elixir': 57,

  // CoffeeScript
  'coffeescript': 55,

  // Shell/Bash
  'bash': 46,
  'sh': 46,
  'shell': 46,
  'zsh': 46,

  // SQL
  'sql': 82,

  // Pascal
  'pascal': 67,

  // Fortran
  'fortran': 59,

  // Scheme
  'scheme': 87,

  // Common Lisp
  'commonlisp': 88,

  // Prolog
  'prolog': 89,

  // Octave/MATLAB
  'octave': 66,
  'matlab': 66,

  // Objective-C
  'objective-c': 79,

  // VB.NET
  'vb.net': 51,

  // F#
  'f#': 87,
  'fs': 87,

  // Groovy
  'groovy': 88,

  // TCL
  'tcl': 90,

  // D
  'd': 91,

  // Nim
  'nim': 92,

  // Julia
  'julia': 93,

  // Crystal
  'crystal': 94,

  // Pony
  'pony': 95,

  // V
  'v': 96,

  // Zig
  'zig': 97
};

// Execute code using Judge0 API
const executeWithJudge0 = async (code, language) => {
  const languageId = JUDGE0_LANGUAGES[language.toLowerCase()];

  if (!languageId) {
    throw new Error(`Language '${language}' is not supported by Judge0 API`);
  }

  try {
    let processedCode = code;

    // For Java, ensure the main class is named "Main"
    if (language.toLowerCase() === 'java') {
      // Extract class name from the code
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      if (classMatch && classMatch[1] !== 'Main') {
        const originalClassName = classMatch[1];
        processedCode = code.replace(/public\s+class\s+\w+/, 'public class Main');
        // Also replace any references to the original class name within the code
        processedCode = processedCode.replace(new RegExp(`\\b${originalClassName}\\b`, 'g'), 'Main');
      }
    }

    // Submit code for execution
    const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
      source_code: processedCode,
      language_id: languageId,
      stdin: '',
      expected_output: null,
      redirect_stderr_to_stdout: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'your-rapidapi-key-here',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    const token = submitResponse.data.token;

    // Wait for execution to complete
    let result;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max wait

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const statusResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'your-rapidapi-key-here',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      result = statusResponse.data;

      if (result.status.id > 2) { // Status > 2 means execution completed
        break;
      }

      attempts++;
    }

    if (!result || result.status.id <= 2) {
      throw new Error('Execution timed out');
    }

    let output = '';
    let error = '';

    // Handle different execution results
    switch (result.status.id) {
      case 3: // Accepted
        output = result.stdout || '';
        break;
      case 4: // Wrong Answer (but we don't have expected output)
        output = result.stdout || '';
        break;
      case 5: // Time Limit Exceeded
        error = 'Time limit exceeded';
        break;
      case 6: // Compilation Error
        error = result.compile_output || result.stderr || 'Compilation error';
        break;
      case 7: // Runtime Error (including NZEC)
        error = result.stderr || result.status.description || 'Runtime error';
        if (result.status.description === 'Runtime Error (NZEC)') {
          error = 'Runtime Error (NZEC): Program exited with non-zero status. Check for exceptions or errors in your code.';
        }
        break;
      case 8: // Memory Limit Exceeded
        error = 'Memory limit exceeded';
        break;
      case 9: // Output Limit Exceeded
        error = 'Output limit exceeded';
        break;
      default:
        error = result.status.description || 'Unknown error';
    }

    return { output, error };

  } catch (apiError) {
    console.error('Judge0 API error:', apiError.response?.data || apiError.message);
    throw new Error(`Judge0 API error: ${apiError.response?.data?.message || apiError.message}`);
  }
};

module.exports = {
  executeCode,
  executeWithJudge0
};
