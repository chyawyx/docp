import path from 'path';
import fs from 'fs-extra';
import { VINYL_TYPE } from './const/enums';
import through2 from 'through2';
import { printLog } from './utils';

export default function (destPath: string) {
  const outputPath = path.resolve(destPath);
  return through2.obj(function (obj, enc, callback) {
    if (obj.type !== VINYL_TYPE.COMPILED_HTML) {
      return callback();
    }
    const htmlPath = outputPath + '/' + obj.file?.stem + '.html';
    fs.outputFileSync(htmlPath, obj.file!.contents!.toString());
    callback();
  }, function (callback) {
    fs.copySync(path.resolve(__dirname, '../template/assets'), outputPath + '/assets');
    printLog.success('website generated at: ' + outputPath);
    callback();
  });
};
