import mongoose from "mongoose";
const MONGO_URI = "mongodb://localhost:27017/{Career}" // FIX LATER

const resetDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(MONGO_URI);
    

    // Wait 
    await new Promise((resolve, reject) => {
      mongoose.connection.on("connected", resolve);
      mongoose.connection.on("error", reject);
    });

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is not ready");
    }

    // Get all collections
    const collections = await db.collections();

    // Drop each collections
    for (const collection of collections) {
      await collection.drop();
    }

    console.log("Database reset successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
};

resetDatabase();