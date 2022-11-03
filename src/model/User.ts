import mongoose, {Model} from "mongoose";

interface UserDefine {
    username: string;
    password: string;
    role: string;
}

const userSchema = new mongoose.Schema<UserDefine, Model<UserDefine>>({
    username: {
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
    default: 'Basic',
    required:true,
    }
})

export const User = mongoose.model('User', userSchema);
// export export class User = mongoose.model('User',userSchema);
