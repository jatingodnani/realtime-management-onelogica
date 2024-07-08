const express = require('express');
const router = express.Router();
require('dotenv').config();
const { createClerkClient } = require('@clerk/backend');
const { MongoClient } = require('mongodb');
// const { ClerkExpressRequireAuth }=require('@clerk/clerk-sdk-node');
// const authorizedParties = ['http://localhost:8000'];


const client = new MongoClient(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
  
  }
  console.log('Connected to MongoDB');
});

router.get("/task",
// ClerkExpressRequireAuth({ authorizedParties }),
 async (req, res) => {
//   const clerkClient = createClerkClient({
//     secretKey: process.env.CLERK_SECRET_KEY,
//   });

  try {
   

    // const authResult = await clerkClient.authenticateRequest(req);
    // console.log("Authentication result:", authResult); 

    // const { isSignedIn } = authResult;

    // if (!isSignedIn) {
    //   return res.status(401).json({ status: 401, message: 'Unauthorized' });
    // }

    const db = client.db("real");
    const collection = db.collection("chat");
    const tasks = await collection.find({}).toArray();
    res.status(200).json(tasks);

  } catch (error) {
    console.error('Error fetching tasks:', error); 
    res.status(500).json({ error: 'An error occurred while fetching tasks' });
  }
});

module.exports = router;
