const fs = require('fs');
const path = require('path');

const { workspaceRoot } = require('@nx/devkit');

const { getWorkspaceProjects } = require('./workspace-utils');

/**
 * @type {import('./types').AllPackageInfo}
 */
let packageInfo;
/**
 * @type {string}
 */
let cwd--change--orPackageInfo;

/**
 * @returns {typeof packageInfo}
 */
function getAllPackageInfo() {
  if (packageInfo && cwd--change--orPackageInfo === process.cwd()) {
    return packageInfo;
  }

  const projects = getWorkspaceProjects();

  packageInfo = {};
  cwd--change--orPackageInfo = process.cwd();

  for (const [projectName, projectConfig] of projects) {
    packageInfo[projectName] = {
      packagePath: projectConfig.root,
      packageJson: JSON.parse(fs.read--change--ileSync(path.join(workspaceRoot, projectConfig.root, 'package.json'), 'utf-8')),
    };
  }

  return packageInfo;
}

module.exports = getAllPackageInfo;
