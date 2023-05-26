import mongoose from "mongoose";
declare const User: mongoose.Model<{
    email: string;
    password: string;
    role: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    role: string;
}> & Omit<{
    email: string;
    password: string;
    role: string;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    password: string;
    role: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    password: string;
    role: string;
}>> & Omit<mongoose.FlatRecord<{
    email: string;
    password: string;
    role: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
declare const IndexedUser: mongoose.Model<{
    email: string;
    password: string;
    role: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    role: string;
}> & Omit<{
    email: string;
    password: string;
    role: string;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    password: string;
    role: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    password: string;
    role: string;
}>> & Omit<mongoose.FlatRecord<{
    email: string;
    password: string;
    role: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export { IndexedUser, User };
