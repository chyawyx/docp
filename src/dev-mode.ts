import path from 'path';
import fs from 'fs-extra';
import { copyFolderRecursiveSync, printLog } from './utils';
import { vol } from 'memfs';
import { ufs } from 'unionfs';
import through2 from 'through2';
import { docpConfig } from './model/docp-config';

const newFS = ufs.use(fs).use(vol as any);

export default function () {
  return through2.obj(function (file, enc, callback) {
    // todo 输出到dist目录
    const htmlPath = '/dist/' + file?.stem + '.html';
    vol.fromJSON({
      [htmlPath]: file!.contents!.toString()
    });
    printLog.info('page at http://127.0.0.1:' + docpConfig.port + '/' + file.stem + '.html');
    callback();
  }, function (callback) {
    copyFolderRecursiveSync(path.resolve(__dirname, '../template/assets'), '/dist/assets', newFS);
    callback();
  });
};
