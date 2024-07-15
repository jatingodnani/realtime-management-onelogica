const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const { Server } = require("socket.io");
const socket = require("socket.io");
const http = require("http");
const authval = require("./routes/route");
const { createServer } = require("http");
const connectDB = require("./mongoconnect");
const { MongoClient, ObjectId } = require("mongodb");
const server = createServer(app);
const client = new MongoClient(process.env.URL);
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }))
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", authval);

let userSocketMap = new Map();
io.on("connection", (socket) => {
  // console.log(socket.id);
  // Manual Connection (For Server mapping)
  socket.on("user-connected", (user) => {
    // console.log(user,"user");
    const userId = user.id;
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });
  //   Handling Disconnections
  socket.on("disconnect", () => {
    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
  //   EVENT : Message
  socket.on("message", async (data) => {
    // console.log(data, "this is data");
     
       let tags;
    try {
      parsedData = typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      console.error("Error parsing data:", error);
      return;
    }
    if(parsedData.addTags.length>0){
        tags=parsedData.addTags.split(",");
    }
    const db = client.db("real");
    const collection = db.collection("chat");
    const newTask = {
      name:parsedData.name,
      email:parsedData.email,
      userId: parsedData.userId,
      title: parsedData.title,
      description: parsedData.description,
      createdDate: new Date(),
      completed: false,
      everyone:
        Array.isArray(parsedData.assignTo) &&
        parsedData.assignTo.length > 0
          ? false
          : true,
      assignedUsers: parsedData.assignTo || [],
      tags:tags|| [],
      roomId: "everyonecanuse",
      completedBy:"none"
    };
    await collection.insertOne(newTask);
    console.log("Task created:", newTask);
  });

  //   EVENT : Task Update
  socket.on("task-update", async (req) => {
    const { id, data } = req;
    // console.log(id, data);
    const db = client.db("real");
    const collection = db.collection("chat");
    try {
     
      const { _id, ...updateData } = data;
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      // console.log(result);
    }  catch (error) {
      console.error("Error updating task:", error);
      socket.emit("update-error", "An error occurred while updating the task");
    }
  });
});
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("real");
    const collection = db.collection("chat");
    const changeStream = collection.watch();

    
    changeStream.on("change", async (change) => {
      
      if (change.operationType === "insert") {
        const fullDocument = change.fullDocument;

       
        if (!fullDocument.everyone) {
          // console.log(userSocketMap,"this is my map")
          // console.log(fullDocument.assignedUsers,userSocketMap,fullDocument)
          
          fullDocument.assignedUsers.forEach((user) => {
            io.to(userSocketMap.get(user.clerkId)).emit(
              "message-recived",
              fullDocument
            );
          });
        } else {
        
          io.emit("message-recived", fullDocument);
        }
      } else if (change.operationType === "update") {
        const fullDocument = await collection.findOne({ _id: change.documentKey._id });

        console.log("Update detected:", fullDocument);
        if (!fullDocument.everyone) {
          fullDocument.assignedUsers.forEach((user) => {
            io.to(userSocketMap.get(user.clerkId)).emit(
              "message-recived",
              fullDocument
            );
          });
        } else {
          io.emit("message-recived", fullDocument);
        }
      }
    });

    server.listen(process.env.PORT, () => {
      console.log("Server is running on 8000");
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
