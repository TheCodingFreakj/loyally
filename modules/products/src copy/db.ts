import mongoose from "mongoose";

export const connMongodb = () => {
  try {
    mongoose.connect(
      "mongodb+srv://pallavi57:pallavi57@Users.w4vdsoq.mongodb.net/Users?retryWrites=true&w=majority"
    );

    console.log("Mongoose connected!");
  } catch (error) {
    console.log(error);
  }
};
