import mongoose from "mongoose";

const { Schema } = mongoose;
// Define the User Schema 
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Export the User model
export default mongoose.models.User || mongoose.model("User", userSchema);
