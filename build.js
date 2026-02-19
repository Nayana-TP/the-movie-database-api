#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure react-scripts is executable
const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
if (fs.existsSync(reactScriptsPath)) {
  fs.chmodSync(reactScriptsPath, '755');
}

// Run the build
try {
  execSync('react-scripts build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
