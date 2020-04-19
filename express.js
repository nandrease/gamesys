const express = require("express");
const path = require("path");
const router = express.Router();
const app = express();
const port = 3000;

router.get("/", (req, res) => res.sendFile(path.join(__dirname + "/public/index.html")));

app.use("/", router);
app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
