class PluginValidationError extends Error {
  constructor(key?: string, value?: string) {
    super();
    this.message = `plugin validation failed${
      key ? `: ${key} has invalid format "${value}"` : ''
    }`;
  }
}

export default PluginValidationError;
