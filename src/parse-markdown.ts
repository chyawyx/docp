/**
 * input markdown files
 * output
 *  1. has exec code, return code files as Vinyl
 *  2. has summary, return summary as DOM
 *  3. return html files as Vinyl which compiled from markdown
 */
import through2 from 'through2';
import Vinyl from 'vinyl';
import { printLog } from './utils';
import Page from './model/page';
import { docpConfig } from './model/docp-config';

export default function () {
  const pages: Array<Page> = []
  return through2.obj(async function (file: Vinyl, enc: string, callback: Function) {
    if (file.extname !== '.md') {
      return callback();
    }
    const page = new Page()
    await page.generate(file)
    pages.push(page);
    // log
    printLog.success(`compile ${file.basename} done `);
    callback();
  }, async function (callback) {
    const codeMap = Page.codeMap
    for (const type of codeMap.keys()) {
      const preset = docpConfig.presets[type];
      if (!preset) {
        printLog.error(`preset of ${type} not defined`)
        process.exit(0)
      }
      if (typeof preset !== 'function') {
        printLog.error(`preset of ${preset} not not a function`)
        process.exit(0);
      }
      await preset(codeMap.get(type))
    }
    for (let i = 0; i < pages.length; i++) {
      const html = await pages[i].outputHTML()
      this.push(html)
    }
    callback()
  });
}