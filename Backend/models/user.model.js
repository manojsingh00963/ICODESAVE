import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      default: "Developer",
      trim: true 
    },
    bio: { 
      type: String, 
      default: "Passionate about coding!",
      trim: true 
    },
    avatar: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
