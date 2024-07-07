
const mongoose = require('mongoose');
const env=require("dotenv");
env.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
