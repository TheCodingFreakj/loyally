import mongoose from "mongoose";
declare const User: mongoose.Model<{
    user_id: string;
    email: string;
    password: string;
    role: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    user_id: string;
    email: string;
    password: string;
    role: string;
}> & Omit<{
    user_id: string;
    email: string;
    password: string;
    role: string;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user_id: string;
    email: string;
    password: string;
    role: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    user_id: string;
    email: string;
    password: string;
    role: string;
}>> & Omit<mongoose.FlatRecord<{
    user_id: string;
    email: string;
    password: string;
    role: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
declare const IndexedUser: mongoose.Model<{
    user_id: string;
    email: string;
    password: string;
    role: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    user_id: string;
    email: string;
    password: string;
    role: string;
}> & Omit<{
    user_id: string;
    email: string;
    password: string;
    role: string;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user_id: string;
    email: string;
    password: string;
    role: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    user_id: string;
    email: string;
    password: string;
    role: string;
}>> & Omit<mongoose.FlatRecord<{
    user_id: string;
    email: string;
    password: string;
    role: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export { IndexedUser, User };
