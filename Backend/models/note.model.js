import mongoose from "mongoose";

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    tag: { 
      type: String, 
      required: true,
      default: "Code",
      trim: true 
    },
    language: {
      type: String,
      default: "javascript",
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index for user notes sorted by date
noteSchema.index({ user: 1, createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;
