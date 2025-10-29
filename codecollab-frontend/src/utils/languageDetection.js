// Language detection utility based on file extensions
export const detectLanguage = (filename) => {
  if (!filename) return 'plaintext';

  const extension = filename.split('.').pop().toLowerCase();

  const languageMap = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'mjs': 'javascript',
    'cjs': 'javascript',

    // Python
    'py': 'python',
    'pyc': 'python',
    'pyw': 'python',
    'pyo': 'python',

    // C/C++
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'hxx': 'cpp',

    // Java
    'java': 'java',

    // Web Technologies
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',

    // Other Languages
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'dart': 'dart',

    // Data/Config
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'ini': 'ini',

    // Shell/Scripts
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'ps1': 'powershell',
    'bat': 'batch',
    'cmd': 'batch',

    // Markup
    'md': 'markdown',
    'markdown': 'markdown',
    'tex': 'latex',

    // Databases
    'sql': 'sql',

    // Other
    'dockerfile': 'dockerfile',
    'makefile': 'makefile',
    'cmake': 'cmake'
  };

  return languageMap[extension] || 'plaintext';
};

// Get file extension
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

// Get language display name
export const getLanguageDisplayName = (language) => {
  const displayNames = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    cpp: 'C++',
    c: 'C',
    java: 'Java',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    less: 'Less',
    php: 'PHP',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    scala: 'Scala',
    dart: 'Dart',
    json: 'JSON',
    xml: 'XML',
    yaml: 'YAML',
    toml: 'TOML',
    ini: 'INI',
    shell: 'Shell',
    powershell: 'PowerShell',
    batch: 'Batch',
    markdown: 'Markdown',
    latex: 'LaTeX',
    sql: 'SQL',
    dockerfile: 'Dockerfile',
    makefile: 'Makefile',
    cmake: 'CMake',
    plaintext: 'Plain Text'
  };

  return displayNames[language] || language;
};
