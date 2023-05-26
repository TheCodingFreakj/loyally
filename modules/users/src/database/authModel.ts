import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "User",
    required: true,
  },
});

const User = mongoose.model("Users", UserSchema);

const IndexedUserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
  },
  role: {
    type: String,
    default: "User",
    required: true,
  },
});
IndexedUserSchema.index({ email: 1 });
const IndexedUser = mongoose.model("IndexedUsers", IndexedUserSchema);

export { IndexedUser, User };
