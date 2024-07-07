const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  everyone: {
    type: Boolean,
    default: false
  },
  assignedUsers: [{
    clientId: {
      type: String,
      
    },
    clientEmail: {
      type: String,
     
    }
  }],
  roomId:{
    type: String,
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
