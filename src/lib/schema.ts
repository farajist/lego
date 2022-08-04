import {
  assert,
  object,
  pattern,
  string,
  Infer,
  StructError
} from 'superstruct';
import { PluginValidationError } from '../error';
import semverRegex from '../utils/semver-regex';

const pluginSchema = object({
  version: pattern(string(), semverRegex()),
  name: string(),
  main: pattern(string(), /^(\.\/)*([\w]+)(\/[\w-]+)*.(js|ts)/)
});

export function validatePluginSchema(data: unknown) {
  try {
    assert(data, pluginSchema);
  } catch (error) {
    if (error instanceof StructError) {
      const { key, value } = error;
      throw new PluginValidationError(key, value);
    }
  }
}

export type PluginSchema = Infer<typeof pluginSchema>;
