const express = require("express");
const path = require("path");
const app = express();
const port = 3001;
const cors = require("cors");

const dataFilePath = path.join(__dirname, "tasks.json");

app.use(cors());

app.get("/tasks", (req, res) => {
    res.sendFile(dataFilePath); 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

