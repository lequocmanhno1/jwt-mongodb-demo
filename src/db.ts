import mongoose, {ConnectOptions} from "mongoose";
const localDB = 'mongodb://localhost:27017/role_auth';

const connectDB = async () => {
    await mongoose.connect(localDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions) 

    console.log('MongoDB Connected');
};

export default connectDB;