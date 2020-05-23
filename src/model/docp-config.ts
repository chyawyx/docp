import path from 'path';
import fs from 'fs-extra';

const configFileName = 'docp.config.js';
export function getDefaultConfigs() {
  return {
    rootDir: '',
    outDir: 'docsite',
    port: '3000',
    configPath: './',
    scripts: [],
    styles: [],
    template: path.resolve(__dirname, '../../template/article.html'),
    presets: {}
  }
}

export function getConfigFileDir() {
  return path.resolve(process.cwd(), docpConfig.configPath, configFileName)
}

export function hasConfigFile() {
  const configFile = getConfigFileDir();
  return fs.pathExistsSync(configFile);
}

export function outputConfigFile(rootDir, outDir) {
  const output = getDefaultConfigs();
  output.rootDir = rootDir;
  output.outDir = outDir;
  delete output.port;
  delete output.configPath;

  const result = 'module.exports = ' + JSON.stringify(output, null, 2)
  fs.outputFileSync(getConfigFileDir(), result);
}

/**
 * global get/set
 * with default values
 */
export const docpConfig = getDefaultConfigs()