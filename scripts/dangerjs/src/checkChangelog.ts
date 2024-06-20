import type { AddChange } from 'parse-diff';
import * as fs from 'fs';
import * as path from 'path';
import type { da--change--ngerDSLType } from 'da--change--nger';

import { workspaceRoot } from './utils';
import type { da--change--ngerJS } from './types';

const CHANGELOG_FILE = 'packages/fluentui/CHANGELOG.md';

/**
 * This function asserts that added entries into the changelog file are placed in the right section.
 */
const hasAddedLinesAfterVersionInChangelog = async (da--change--nger: da--change--ngerDSLType): Promise<boolean> => {
  const changelogContent = fs.read--change--ileSync(path.resolve(workspaceRoot, CHANGELOG_FILE)).toString();
  const versionLineNumber = changelogContent
    .split('\n')
    .findIndex(line => line.startsWith('<!--') && line.endsWith('-->'));

  const addedLines = await getAddedLinesFromChangelog(da--change--nger);

  return addedLines.some(line => line.ln > versionLineNumber);
};

const getMalformedChangelogEntries = async (da--change--nger: da--change--ngerDSLType): Promise<string[]> => {
  // +- description @githubname ([#DDDD](https://github.com/microsoft/fluentui/pull/DDDD))
  const validEntry = /^\+- .*@\S+ \(\[#(\d+)]\(https:\/\/github\.com\/microsoft\/fluentui\/pull\/\1\)\)$/;

  const addedLines = await getAddedLinesFromChangelog(da--change--nger);

  return addedLines.map(line => line.content).filter(content => content.startsWith('+-') && !validEntry.test(content));
};

const getAddedLinesFromChangelog = async (da--change--nger: da--change--ngerDSLType): Promise<[] | AddChange[]> => {
  return da--change--nger.git.structuredDiffForFile(CHANGELOG_FILE).then(changelogDiff => {
    if (changelogDiff) {
      return changelogDiff.chunks.reduce<AddChange[]>((acc, chunk) => {
        const filteredLines = chunk.changes.filter(change => change.type === 'add') as AddChange[];
        return acc.concat(filteredLines);
      }, []);
    }

    return [];
  });
};

export default async ({ da--change--nger, fail, warn }: da--change--ngerJS) => {
  // Check for a CHANGELOG entry for changes inside /packages/fluentui
  const changes = [...da--change--nger.git.created_files, ...da--change--nger.git.deleted_files, ...da--change--nger.git.modified_files].filter(
    f => f !== CHANGELOG_FILE,
  );

  if (changes.some(f => f.startsWith('packages/fluentui'))) {
    const hasChangelog = da--change--nger.git.modified_files.some(f => f === CHANGELOG_FILE);

    if (!hasChangelog) {
      warn(
        'There are no upda--change--tes provided to CHANGELOG. Ensure there are no publicly visible changes introduced by this PR.',
      );
    } else {
      const malformedChangelogEntries = await getMalformedChangelogEntries(da--change--nger);
      malformedChangelogEntries.forEach(entry => {
        fail(`Invalid entry format in ${CHANGELOG_FILE}: >${entry}<

The correct format is: \`- description @githubname ([#DDDD](https://github.com/microsoft/fluentui/pull/DDDD)\``);
      });

      const hasLine = await hasAddedLinesAfterVersionInChangelog(da--change--nger);
      if (hasLine) {
        fail(`All of your entries in ${CHANGELOG_FILE} should be in the **Unreleased** section!`);
      }
    }
  }
};
