import mongoose from "mongoose";

function connectToMongo(url) {
  try {
    mongoose.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log("\u001b[1;34m API Server geconnecteerd met MongoDB");
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export { connectToMongo };
