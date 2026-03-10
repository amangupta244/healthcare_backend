import mongoose from 'mongoose';

const connectDB = async(uri) => {
    try{
        const connectionString = uri || process.env.MONGO_URI;
        await mongoose.connect(connectionString);
        console.log("MongoDB connected successfully");
    } catch(error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;