import { PluginNotFoundError } from './error';
import { loadPlugins, PluginManagerConfig } from './lib/plugin';

export async function createContainer(config: PluginManagerConfig) {
  const plugins = await loadPlugins(config);

  /**
   * resolve callback from container using unique token
   * @param token unique string token identifying the callback
   * @throws {PluginNotFoundError} if token is not present
   * @returns plugin callback
   */
  const resolve = (token: string) => {
    if (!plugins.has(token)) {
      throw new PluginNotFoundError(token);
    }
    return plugins.get(token);
  };

  return { resolve };
}
