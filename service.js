const url = require("url");
const fs = require("fs");

const loadTemplate = filePath => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    return dataBuffer.toString();
  } catch (e) {
    return "";
  }
};

let indexTemplate = loadTemplate("./public/index.html");
let mainPage = loadTemplate("./templates/main.html");
let popupTemplate = loadTemplate("./templates/popup.html");
let content1 = loadTemplate("./templates/content-module-1.html");
let content2 = loadTemplate("./templates/content-module-2.html");

exports.publicIndex = function(req, res) {
  const reqUrl = url.parse(req.url, true);
  var name = "World";
  if (reqUrl.query.name) {
    name = reqUrl.query.name;
  }

  var response = {
    title: "Welcome to the app",
    content: mainPage + popupTemplate
  };

  res.writeHeader(200, { "Content-Type": "text/html" });
  res.write(indexTemplate);
  res.end();
};

exports.apiIndex = function(req, res) {
  const reqUrl = url.parse(req.url, true);

  var response = {
    title: "Welcome to the app",
    content: mainPage + popupTemplate
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));
};

exports.module1 = function(req, res) {
  var response = {
    id: 1,
    title: "Hello From Module 1",
    excerpt:
      "<p class='module-excerpt'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad delectus perferendis doloremque reprehenderit maiores sequi recusandae, suscipit quisquam itaque quam ab accusantium quasi excepturi dicta voluptates illo.</p>"
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));
};

exports.module1Content = function(req, res) {
  var response = {
    content: content1
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));
};

exports.module2 = function(req, res) {
  var response = {
    id: 2,
    title: "Hello From Module 2",
    excerpt: `<p class='module-excerpt'>Small excerpt</p>`
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));
};

exports.module2Content = function(req, res) {
  var response = {
    content: content2
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));
};

exports.invalidRequest = function(req, res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain");
  res.end("Invalid Request");
};
