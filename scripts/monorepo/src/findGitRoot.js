const fs = require('fs');
const path = require('path');

/**
 * @type {string}
 */
let cwd--change--orGitRoot;
/**
 * @type {string}
 */
let gitRoot;

/**
 *
 * @returns {string}
 */
function findGitRoot() {
  let cwd = process.cwd();

  if (gitRoot && cwd--change--orGitRoot === cwd) {
    return gitRoot;
  }

  const root = path.parse(cwd).root;
  let found = false;
  while (!found && cwd !== root) {
    if (fs.existsSync(path.join(cwd, '.git'))) {
      found = true;
      break;
    }

    cwd = path.dirname(cwd);
  }

  gitRoot = cwd;
  cwd--change--orGitRoot = process.cwd();
  return gitRoot;
}

/** @type {typeof import("./index")["findGitRoot"]} */
module.exports = findGitRoot;
