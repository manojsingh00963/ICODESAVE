import mongoose from "mongoose";


const { Schema } = mongoose;

const FeedbackSchema = new mongoose.Schema(
    {
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      feedback: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  

const Feedback = mongoose.model("Feedback",FeedbackSchema)

export default Feedback