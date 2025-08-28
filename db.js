const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/studentmanagementdata");
        console.log("MongoDB connected");
    } catch (err) {
        console.log("DB Connection Error:", err);
    }
};

module.exports = connectDb;