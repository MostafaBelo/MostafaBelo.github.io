const express = require("express");

const app = express();
const port = 3000;

app.get("/home", (req, res) => {
    res.send("Hi");
});

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});
