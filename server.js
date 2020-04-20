const http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs");
const mimeTypes = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
  ico: "image/x-icon"
};

const server = http.createServer((req, res) => {
  var service = require("./service.js");
  const reqUrl = url.parse(req.url, true);
  var uri = url.parse(req.url).pathname;

  var filename = path.join(process.cwd(), unescape(uri));
  var stats;

  if (req.method === "GET") {
    switch (reqUrl.pathname) {
      case "/":
        service.publicIndex(req, res);
        break;
      case "/api/index":
        service.apiIndex(req, res);
        break;
      case "/api/module/1":
        service.module1(req, res);
        break;
      case "/api/module/2":
        service.module2(req, res);
        break;
      case "/api/module/1/full":
        service.module1Content(req, res);
        break;
      case "/api/module/2/full":
        service.module2Content(req, res);
        break;
      default:
        try {
          stats = fs.lstatSync(filename); // throws if path doesn't exist
        } catch (e) {
          service.invalidRequest(req, res);
          return;
        }

        // Static files
        if (stats.isFile()) {
          // path exists, is a file
          const mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
          res.writeHead(200, { "Content-Type": mimeType });
          const fileStream = fs.createReadStream(filename);
          fileStream.pipe(res);
        } else if (stats.isDirectory()) {
          // path exists, is a directory
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.write("Index of " + uri + "\n");
          res.write("TODO, show index?\n");
          res.end();
        } else {
          // Symbolic link, other?
          // TODO: follow symlinks?  security?
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("500 Internal server error\n");
          res.end();
        }
    }
  }
});

const hostname = "localhost";
const port = 8080;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
