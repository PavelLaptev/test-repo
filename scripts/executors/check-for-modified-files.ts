import { logger } from 'just-scripts';
import { EOL } from 'os';
import { execSync } from 'child_process';

export function checkForModified--change--iles() {
  const notEmpty = (value: string) => value.trim() !== '';

  const gitStatusOutput = execSync('git status -s --untracked-files=no').toString('utf8');
  const hasChanged--change--iles = gitStatusOutput.split(EOL).filter(notEmpty).length > 0;

  if (hasChanged--change--iles) {
    logger.error('This build has files that are tracked by git that resulted in modified files.');
    logger.error('Check the following output and resolve the problem that caused these files to change .');
    logger.error('Most likely you committed your files with --no-verify.');
    logger.error(gitStatusOutput);

    // Diffing against HEAD will include both unstaged and staged files
    // (some scripts, such as gulp build:docs:toc, automatically stage the modified files)
    execSync('git diff HEAD', { stdio: 'inherit' });
    logger.error('');

    throw new Error('Found modified files');
  }
}
