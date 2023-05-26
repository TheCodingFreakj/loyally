import mongoose from "mongoose";
import { logger } from "./logger/logger";
export const connMongodb = () => {
  try {
    mongoose.connect(
      "mongodb+srv://pallavi57:pallavi57@Users.w4vdsoq.mongodb.net/Users?retryWrites=true&w=majority"
    );
    logger.info("Mongoose connected!")
  
  } catch (error) {
    console.log(error);
  }
};
