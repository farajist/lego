import { join } from 'path';
import { loadPlugin } from '../src/lib/plugin';

describe('test plugin load', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fail if no manifest is provided', async () => {
    await expect(
      loadPlugin(join(__dirname, './fixtures/repo/plugin-without-manifest'))
    ).rejects.toThrowError(/no such file or directory/);
  });

  it('should fail if manifest is not well formatted', async () => {
    await expect(
      loadPlugin(join(__dirname, './fixtures/repo/plugin-invalid-manifest'))
    ).rejects.toThrowError(/validation failed/);
  });

  it('should fail if `main` does not exist', async () => {
    await expect(
      loadPlugin(join(__dirname, './fixtures/repo/plugin-missing-main'))
    ).rejects.toThrowError(/Cannot find module/);
  });

  it('should fail if `main` does not have a default export', async () => {
    await expect(
      loadPlugin(join(__dirname, './fixtures/repo/plugin-no-default-export'))
    ).rejects.toThrowError(/empty of invalid default export found/);
  });

  it('should load plugin if folder with correct manifest exists', async () => {
    const pluginPromise = loadPlugin(
      join(__dirname, './fixtures/repo/plugin-ok')
    );
    const ss = await pluginPromise;

    await expect(pluginPromise).resolves.toMatchObject({
      version: '0.0.0',
      name: 'example_a.com/slow-preset',
      main: expect.stringMatching(/dist\/main.js/),
      callback: expect.any(Function)
    });
  });
});

describe('test multiple plugins load', () => {});
