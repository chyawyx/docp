import http from 'http';
import url from 'url';
import path from 'path';
import { vol } from 'memfs';
import mime from 'mime';
import { docpConfig } from './model/docp-config';
import { printLog } from './utils';

export default function () {
  const server = http.createServer(function (req: any, res) {
    const urlObj: any = url.parse(req.url);
    const urlPathname = decodeURI(urlObj.pathname);
    const filePathname = path.join("/dist", urlPathname);
    // 读取静态文件
    const ext = path.parse(filePathname).ext;
    const mimeType = mime.getType(ext);
    // 判断路径是否有后缀, 有的话则说明客户端要请求的是一个文件
    if (ext) {
      // 根据传入的目标文件路径来读取对应文件
      vol.readFile(filePathname, (err, data) => {
        // 错误处理
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write("404 - NOT FOUND");
          res.end();
        } else {
          res.writeHead(200, { "Content-Type": mimeType });
          res.write(data);
          res.end();
        }
      });
      // 返回 false 表示, 客户端想要的 是 静态文件
    } else {
      // 返回 false 表示, 客户端想要的 不是 静态文件
      res.end();
    }
  });

  server.listen(Number(docpConfig.port), '127.0.0.1', function () {
    printLog.info('server start');
  });
}