import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.lbbr7vt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

if(!connectionString) {
    throw new Error("please provide the connection string");
}

const connectDB = async () => {
    if(mongoose.connection?.readyState >= 1) {
        return;
    }

    try {
        console.log("Connecting to the database...");
        await mongoose.connect(connectionString);
    } catch (error){
        console.log("Error connecting to the database", error);
    }
}

export default connectDB;