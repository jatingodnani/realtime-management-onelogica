const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const { Server } = require("socket.io");
const socket = require("socket.io");
const http = require("http");
const authval = require('./routes/route');
const { createServer } = require("http");
const connectDB = require("./mongoconnect");
const { MongoClient } = require("mongodb");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const client = new MongoClient(process.env.URL);



app.use("/", authval)

let userSocketMap = new Map();
io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("user-connected", (user) =>{
        console.log()
        const userId = userData.id;
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ${socket.id}`);
    })
    socket.on("disconnect", () => {
       
        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
    socket.on("message", async (data) => {
        console.log(data, "this is data")
      
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      console.error("Error parsing data:", error);
      return;
    }

    console.log("Received data:", parsedData);
    console.log("Title:", parsedData.title);
    console.log("Description:", parsedData.description);
    console.log("Assigned Users:", parsedData.assignedUsers);
        const db = client.db("real");
        const collection = db.collection("chat");
        const newTask = {
            userId:person.userid,
            title: parsedData.title,
            description: parsedData.description,
            createdDate: new Date(),
            completed: false,
            everyone: Array.isArray(parsedData.assignedUsers) && parsedData.assignedUsers.length > 0 ? false : true,
            assignedUsers: parsedData.assignedUsers || [],
            roomId:"everyonecanuse"
          };
        await collection.insertOne(newTask);
        console.log('Task created:', newTask);
    })
})
async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("real");
        const collection = db.collection("chat");

        const changeStream = collection.watch();

        changeStream.on("change", (change) => {
            console.log("Change detected:", change);
            if (change.operationType === "insert") {
                const fullDocument = change.fullDocument;

                console.log("Insert detected:", fullDocument);
                if(!fullDocument.everyone) {
                    fullDocument.assignedUsers.forEach((user) => {
                        if(user.userId==userSocketMap[userId]){
                            io.to(userSocketMap[userId]).emit("message-recived", fullDocument);
                        }
                       
                    });
                }else{
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