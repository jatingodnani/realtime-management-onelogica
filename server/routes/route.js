const express = require('express');
const router = express.Router();
const Task = require('../Modal/task');
require('dotenv').config();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');


const clerkMiddleware = ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});


router.post('/task', clerkMiddleware, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;