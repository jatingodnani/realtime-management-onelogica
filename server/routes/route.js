const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');



// // Log the CLERK_SECRET_KEY to verify it's loaded correctly

// const { clerkClient } = require('@clerk/clerk-sdk-node');



// Middleware to verify the token

const client = new MongoClient(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

router.get("/task",async (req, res) => {

    
  
  try {
    const db = client.db("real");
    const collection = db.collection("chat");
    const tasks = await collection.find({}).toArray();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'An error occurred while fetching tasks' });
  }
});


router.post('/api/signin', async (req, res) => {
  const { userId, email } = req.body;
  console.log(userId, email);
  try {
    const db = client.db("real");
    const collection = db.collection("realtime-user");
    let user = await collection.findOne({ email: email });
    if (!user) {
      user = {
        clerkId: userId,
        email,
      };
      await collection.insertOne(user);
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'An error occurred while signing in user' });
  }
});


router.get('/api/users', async (req, res) => {
  try {
    const db = client.db("real");
    const collection = db.collection("realtime-user");
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});


router.get("/api/userCreatedtask/:id", async (req, res) => {
  const params = req.params;
  console.log(params,"hiii")
try{
  const db = client.db("real");
  const collection = db.collection("realtime-user");
  const user =await collection.find({ userId:params.id}).toArray();
  console.log(user)
  res.status(200).json(user);
}catch(error){
  console.error('Error fetching tasks:', error);
  res.status(500).json({ error: 'An error occurred while fetching tasks' });
}
})

module.exports = router;