import mongoose from "mongoose";

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
