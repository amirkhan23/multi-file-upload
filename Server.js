const express = require("express");
const multer = require('multer');
const fileModel = require("./fileModel");
const mongoDbConnect = require("./mongoInit");
const app = express();
const fs = require('fs');

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + "-" + file.originalname);
  }
});

const createDirectory = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, (err) => {
          if (err) {
            console.error(error);
            reject(err);
            return;
          }
          console.log(`file ${filePath} create successfully`);
        })
      } else {
        console.log(`File exits ${filePath}`);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    } finally {
      resolve();
    }
  });
}


const upload = multer({ storage: storage }).array('userPhoto', 15);

app.use(express.static("uploads"));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/api/uploadFile', function (req, res) {

  upload(req, res, function (err) {
    console.log(req.body);

    if (err) {
      return res.end("Error uploading file.");
    } else {
      //mongodb
      try {
        const p = [];
        for (let f of req.files) {
          console.log(f);
          const { originalname, mimetype, path, filename } = f;
          p.push(fileModel.create({ originalname, mimetype, path, filename }))
        }
        Promise.all(p).then((newDocs) => {
          console.log(newDocs);
          res.end("File is uploaded");
        }, (error) => {
          console.error(error);
          return res.end("Error uploading file.");
        })
      } catch (error) {
        console.error(error);
        return res.end("Error uploading file.");
      }
    }
  });
});

app.get("/api/getFilesDetails", (req, res) => {
  try {
    fileModel.find({}).lean(true).then((files) => {
      res.json(files);
    }, (error) => {
      console.error(error);
      return res.end("Error geting file.");
    })
  } catch (error) {
    console.error(error);
    return res.end("Error geting file.");
  }
})


async function init() {
  await mongoDbConnect();
  await createDirectory("uploads");

}

init().then(async () => {
  app.listen(3000, function () {
    console.log("Working on port 3000");
  });
})


