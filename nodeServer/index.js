const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const app = express();
const fs = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey: "",
});

const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(`./uploads/${fileName}.pdf`);

  const params = {
    Bucket: "",
    Key: `${fileName}.pdf`,
    Body: fileContent,
  };
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    axios
      .post(`http://127.0.0.1:8000/items/${fileName}`, { name: fileName })
      .then((res) => {
        console.log("AwwwwWWW YASSSSS 👁️ 👄👁️ ");
      })
      .catch((err) => {
        console.log("yeet");
      });
  });
};

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // Accessing the file by the <input> File name="target_file"
  let targetFile = req.files.target_file;
  let leUUID = uuidv4();

  //mv(path, CB function(err))
  targetFile.mv(path.join(__dirname, "uploads", `${leUUID}.pdf`), (err) => {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
    uploadFile(leUUID);
  });
});

app.listen(3000, () => console.log("Your app listening on port 3000"));
