const child_process = require('child_process');

const npmVersion = require('../package.json').version;

let gitVersion = null;

child_process.exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
  gitVersion = stdout.trim();
  console.log(npmVersion + ' (' + gitVersion + ')');
  process.exit();
});
