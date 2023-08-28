import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: String,
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
