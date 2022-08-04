class PluginNotFoundError extends Error {
  private token: string;
  constructor(token: string) {
    super();
    this.token = token;
    this.message = `plugin not found for token: ${token}`;
  }
}

export default PluginNotFoundError;
