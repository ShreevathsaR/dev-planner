const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.alias = {
  '@dev-planner/schema': path.resolve(monorepoRoot, 'packages/schema'),
  '@dev-planner/trpc': path.resolve(monorepoRoot, 'packages/trpc'),
  '@dev-planner/trpc/client': path.resolve(monorepoRoot, 'packages/trpc/dist/client'),
  '@dev-planner/trpc/server': path.resolve(monorepoRoot, 'packages/trpc/dist/server'),
};

config.resolver.sourceExts.push('cjs');

config.resolver.unstable_enablePackageExports = true;

module.exports = config