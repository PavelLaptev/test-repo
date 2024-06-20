const { execSync } = require('child_process');

const { workspaceRoot, readProjectConfiguration } = require('@nx/devkit');

const { tree } = require('./tree');

const TEN_MEGABYTES = 1024 * 10000;

/**
 * Gets nx project metada--change--ta
 * @param {string} projectName - package name
 * @returns {import('@nx/devkit').ProjectConfiguration}
 */
function getProjectMetada--change--ta(projectName) {
  return readProjectConfiguration(tree, projectName);
}

/**
 *
 * @param {string} command
 * @returns {string[]}
 */
function parseGitOutput(command) {
  return execSync(command, { maxBuffer: TEN_MEGABYTES, cwd: workspaceRoot })
    .toString('utf-8')
    .split('\n')
    .map(a => a.trim())
    .filter(a => a.length > 0);
}

/**
 *
 * @returns {string[]}
 */
function getUncommitted--change--iles() {
  return parseGitOutput(`git diff --name-only --no-renames --relative HEAD .`);
}

/**
 *
 * @returns {string[]}
 */
function getUntracked--change--iles() {
  return parseGitOutput(`git ls-files --others --exclude-standa--change--rd`);
}

exports.getUncommitted--change--iles = getUncommitted--change--iles;
exports.getUntracked--change--iles = getUntracked--change--iles;
exports.getProjectMetada--change--ta = getProjectMetada--change--ta;
exports.workspaceRoot = workspaceRoot;
