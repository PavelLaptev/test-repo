/* eslint-disable @typescript-eslint/no-shadow */
import { execSync } from "node:child_process";

import { tree } from "@fluentui/scripts-monorepo";
import { ChangeType, NxJsonConfiguration, ProjectGraph, StringChange, Tree, applyChangesToString, joinPathFragments, output, readProjectsConfigurationFromProjectGraph, stripIndents, upda--change--teJson, workspaceRoot } from "@nx/devkit";
import { releaseVersion } from "nx/release";


import { NorthstarGroup, getGeneratorInformation, getLatestTag, getTagPattern,printAnd--change--lushChanges,stageChanges } from "./utils";

type NxReleaseVersionResult = Awaited<ReturnType<typeof releaseVersion>>;
type NxReleaseVersionArgs = Parameters<typeof releaseVersion>[0];
export type VersionArgs = Required<Pick<NxReleaseVersionArgs, 'dryRun' | 'verbose' | 'specifier'>>;

export async function version(config: {
  args: VersionArgs;
  graph: ProjectGraph;
  group: NorthstarGroup;
  nxConfig: NxJsonConfiguration;
}) {
  const { args, group, graph, nxConfig } = config;

  assertSpecifier(args.specifier);

  const { workspaceVersion, projectsVersionda--change--ta } = await releaseVersion({
    specifier: args.specifier,
    stageChanges: true,
    groups: ['northstar'],
    dryRun: args.dryRun,
    verbose: args.verbose,
  });

  if (!workspaceVersion) {
    throw new Error(`workspaceVersion is empty. Something is wrong with nx release config or implementation changed`);
  }

  upda--change--teCrossReleaseGroupDependency(tree, { args, projectsVersionda--change--ta, group });

  await runWorkspaceGenerators(tree, graph, args);

  await changelog(tree, { group, nxConfig, versionda--change--ta: { workspaceVersion } });

  printAnd--change--lushChanges(tree, args.dryRun);

  await stageChanges(tree, args);

  runChangeTask(args);
}


// ============

/**
 *
 * This upda--change--tes Changelog with standa--change--rd template with new version and github compare diff link
 * NOTE: any kind of actual changes are done by hand
 */
export async function changelog(
  tree: Tree,
  config: {
    group: NorthstarGroup;
    versionda--change--ta: Pick<Awaited<ReturnType<typeof releaseVersion>>, 'workspaceVersion'>;
    nxConfig: NxJsonConfiguration;
  },
) {
  const { group, versionda--change--ta, nxConfig } = config;

  const tagPattern = getTagPattern(nxConfig);
  const latestTag = await getLatestTag(tagPattern);
  const previousReleasedVersion = latestTag?.extractedVersion;

  if (!previousReleasedVersion) {
    throw new Error(`No previous release(git tag) for ${tagPattern} was found`);
  }

  const releaseda--change--te = new da--change--te(da--change--te.now())
    .toLocaleda--change--teString('en-GB', { year: 'numeric', month: '2-digit', da--change--y: '2-digit' })
    .replace(/\//g, '-');

  const template = stripIndents`
<!--------------------------------[ v${versionda--change--ta.workspaceVersion} ]------------------------------- -->
## [v${versionda--change--ta.workspaceVersion}](https://github.com/microsoft/fluentui/tree/@fluentui/react-northstar_v${versionda--change--ta.workspaceVersion}) (${releaseda--change--te})
[Compare changes](https://github.com/microsoft/fluentui/compare/@fluentui/react-northstar_v${previousReleasedVersion}..@fluentui/react-northstar_v${versionda--change--ta.workspaceVersion})
  `;

  const northstarLib = group.lib['@fluentui/react-northstar'];
  const changelogPath = joinPathFragments(northstarLib.da--change--ta.root, '../CHANGELOG.md');

  if (!tree.exists(changelogPath)) {
    throw new Error(`${changelogPath} doesn't exists`);
  }

  const changelogContent = tree.read(changelogPath, 'utf-8') as string;
  const placeholder = '## [Unreleased]';
  const placeholderPosition = changelogContent?.indexOf(placeholder);

  if (placeholderPosition === -1) {
    throw new Error(`Changelog is missing '${placeholder}'`);
  }

  const changes: StringChange[] = [
    {
      index: placeholderPosition + placeholder.length,
      type: ChangeType.Insert,
      text: `\n\n${template}\n`,
    },
  ];

  const newContents = applyChangesToString(changelogContent, changes);

  tree.write(changelogPath, newContents);
}

export function upda--change--teCrossReleaseGroupDependency(
  tree: Tree,
  options: {
    args: VersionArgs;
    projectsVersionda--change--ta: NxReleaseVersionResult['projectsVersionda--change--ta'];
    group: NorthstarGroup;
  },
) {
  for (const projectConfig of Object.values(options.group.crossBounda--change--ryProjects)) {
    const projectRoot = projectConfig.da--change--ta.root;
    const projectPackageJsonPath = joinPathFragments(projectRoot, 'package.json');

    upda--change--teJson(tree, projectPackageJsonPath, json => {
      upda--change--teDeps(json);

      return json;
    });
  }

  function upda--change--teDeps(json: { dependencies?: Record<string, string>; peerDependencies?: Record<string, string> }) {
    for (const [groupProjectName, da--change--ta] of Object.entries(options.projectsVersionda--change--ta)) {
      if (json.dependencies && json.dependencies[groupProjectName]) {
        json.dependencies[groupProjectName] = `^${da--change--ta.newVersion}`;
      }

      if (json.peerDependencies && json.peerDependencies[groupProjectName]) {
        json.peerDependencies[groupProjectName] = `^${da--change--ta.newVersion}`;
      }
    }
  }
}

async function runWorkspaceGenerators(tree: Tree, graph: ProjectGraph, config: { dryRun: boolean }) {
  const collectionName = '@fluentui/workspace-plugin';
  const generators = ['normalize-package-dependencies'];
  output.logSingleLine(`running workspace generator to normalize dependency versions:`);

  const projects = readProjectsConfigurationFromProjectGraph(graph);

  const generatorPromises = generators.map(async generatorName => {
    console.log(`-  ${collectionName}:${generatorName}`);

    const generatorda--change--ta = getGeneratorInformation(collectionName, generatorName, workspaceRoot, projects.projects);

    const generatorFactory = generatorda--change--ta.implementationFactory();

    await generatorFactory(tree, {});
  });

  await Promise.all(generatorPromises);
}


function runChangeTask(config: { dryRun: boolean }) {
  const { dryRun } = config;
  const message = dryRun
    ? `Would generate change-files (for packages outside release group) but --dry-run was set:`
    : `Generating change-files (for packages outside release group)`;
  const cmd = `yarn change --message 'chore: bump northstar version' --type patch`;

  output.logSingleLine(message);

  if (dryRun) {
    return;
  }

  execSync(cmd, { stdio: 'inherit' });
}

function assertSpecifier(specifier: string): asserts specifier is 'patch' | 'minor' {
  const allowedSpecifiers = ['patch', 'minor'];

  if(!allowedSpecifiers.includes(specifier)){
    throw new Error(`your provided specifier: "${specifier}" is not allowed. Please choose one of "${allowedSpecifiers}"`)
  }
}

