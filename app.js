// import important library
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
port = process.env.PORT || 5000;

// creating app
app = express();

//  use middleware
app.use(cors());
app.use(express.json());

// listening to port
app.listen(port);

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@ost-cluster.i42fc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const userCollection = client.db("to-do-app").collection("users");

    app.post("/create-task", async (req, res) => {
      const data = req.body.data;
      const result = await userCollection.insertOne(data);
    });

    app.get("/task-list", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = userCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    app.delete("/task-delete", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      userCollection.deleteOne(query);
      res.send({ msg: "Item Delted Successfully" });
    });

    app.put("/task-completed", async (req, res) => {
      let id = req.query.id;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          completed: true,
        },
      };
      const option = { upsert: true };
      userCollection.updateOne(query, updateDoc, option);
      res.send({ msg: "Item Delted Successfully" });
    });

    app.get("/", (req, res) => {
      res.send("Server running");
    });
  } finally {
    // finally
  }
};

run();

// get req
