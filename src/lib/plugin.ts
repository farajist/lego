import { dirname, join, resolve } from 'path';
import { readFile } from 'fs/promises';
import fg from 'fast-glob';
import * as yaml from 'js-yaml';
import { Plugin } from '../interfaces/plugin.interface';
import { PluginSchema, validatePluginSchema } from './schema';

type PluginEntry = [string, Plugin];

export interface PluginManagerConfig {
  paths: string[];
}

async function importDefault(pluginInfo: PluginSchema) {
  const pluginImport = await import(pluginInfo.main);

  if (
    Object.keys(pluginImport).length === 0 ||
    typeof pluginImport.default !== 'function'
  ) {
    throw new Error('empty of invalid default export found');
  }

  return pluginImport.default;
}

export async function loadPlugin(
  pluginPath: string
): Promise<PluginSchema & Plugin> {
  //   const pluginPath = resolve(path, pluginPath);
  const pluginManifestPath = join(pluginPath, 'lego.yml');

  const manifestContent = await readFile(pluginManifestPath, {
    encoding: 'utf-8'
  });

  let pluginInfo = yaml.load(manifestContent, {
    json: true,
    schema: yaml.JSON_SCHEMA
  }) as PluginSchema;

  validatePluginSchema(pluginInfo);

  pluginInfo = {
    ...pluginInfo,
    main: resolve(pluginPath, pluginInfo.main)
  };

  const callback = await importDefault(pluginInfo);
  return { ...pluginInfo, callback };
}

export async function loadPlugins(config: PluginManagerConfig) {
  const { paths } = config;
  // grab all manifest files in paths
  const manfiests = await fg(
    paths.map((p) => `${p}/**/lego.yml`),
    { dot: true, unique: true }
  );

  // load plugins using default import
  const loadedPlugins = await Promise.all(
    manfiests.map((m) => loadPlugin(dirname(m)))
  );

  const pluginEntries: PluginEntry[] = loadedPlugins.map(
    ({ name, callback }) => [name, { callback }]
  );

  return new Map(pluginEntries);
}
