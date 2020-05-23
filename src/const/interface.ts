import Page from '../model/page';

export interface DocpConfig {
  src: string;
  dest: string;
  scripts: Array<string>;
  styles: Array<string>;
}

export interface ICode {
  host: Page,
  containerId: string,
  type: string,
  value: string
}