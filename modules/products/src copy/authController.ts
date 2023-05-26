import { executeRabbitMQ } from "./datashare";
import User from "./authModel";
import bcrypt from "bcrypt";

export const registerUser = async (req: any, res: any) => {
  console.log(req.body);
  // {username, password, role} = req.body;
  if (!req.body.email || !req.body.password) {
    return res.json({
      message: "Please Provide all details",
    });
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const user = await new User({
    //  ...req.body
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  await user.save();
  executeRabbitMQ(req.body);

  return res.status(201).json({
    message: "user created successfully",
    user,
  });
};

export const getUsers = async (req: any, res: any) => {
  const users = await User.find();

  return res.status(200).json({
    message: "sending users",
    users,
  });
};

export const authUser = async (req: any, res: any) => {

};


export const updateRole = (req: any, res: any) => {};

export const delUser = (req: any, res: any) => {};
