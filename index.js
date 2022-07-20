const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const List = require("./modules/Lists");
require("dotenv").config();

console.log(process.env.ATLAS_CONNECTION_URL);
console.log(process.env.PORT);

mongoose
  .connect(process.env.ATLAS_CONNECTION_URL, { useNewUrlParser: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

const app = express();
app.use(cors());
app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Content-Type", "application/json");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log("Application is started on PORT = " + process.env.PORT);
});

app.post("/list", (req, res, next) => {
  const reqBody = req.body;
  console.log(JSON.stringify(req.body));
  let newList = new List({
    _id: new mongoose.Types.ObjectId(),
    todo: req.body.todo,
  });
  newList
    .save()
    .then((data) => {
      res.status(201).json({
        message: "Handling POST requests to /Category",
        createdProduct: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(201).json({
        message: "Handling POST requests to /products",
      });
    });
});

app.get("/list", (req, res) => {
  List.find({}, function (err, data) {
    if (err) {
      throw err;
    } else {
      return res.json({
        data: data,
      });
    }
  });
});
app.delete("/list/:id", (req, res) => {
  List.findByIdAndRemove({
    _id: req.params.id,
  })
    .then((data) => {
      console.log("deleting object: " + data);
      return res.json({
        data: data,
      });
    })
    .catch(() => {
      console.log(err);
    });
});
app.put("/list/:id", (req, res) => {
  List.findByIdAndUpdate(
    req.params.id,
    {
      todo: req.body.todo,
      _id: req.body._id,
    },
    {
      new: true,
    },
    (err, data) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        });
      } else if (!data) {
        res.json({
          success: false,
          message: "Not Found",
        });
      } else {
        res.json({
          success: true,
          data: data,
        });
      }
    }
  );
});
//log msj
