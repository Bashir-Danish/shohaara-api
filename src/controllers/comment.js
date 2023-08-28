import Comment from "../models/comment.js";
import { catchAsync } from "../middlewares.js";

export const getAllComments = catchAsync(async (req, res) => {
  const comments = await Comment.find();
  res.status(200).json({ message: "", comments: comments });
});

export const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    if (comment) {
      await comment.deleteOne();
      return res.status(200).json({ message: "Comment Deleted", comment: comment });
    }
    return res.status(404).json({ message: "Comment not Found" });
  } catch (err) {
    res.status(500).json({ message: "Invalid Operation" });
  }
});

export const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedComment } = req.body;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment doesn't exist" });
    }

    comment.text = updatedComment.text;
    comment.publishDate = updatedComment.publishDate;
    comment.userID = updatedComment.userID;
    comment.postID = updatedComment.postID;
    await comment.save();

    res.status(200).json({ message: "Comment updated", comment: comment });
  } catch (err) {
    res.status(500).json({ message: "Invalid Comment Info", error: err.message });
  }
});

export const createComment = catchAsync(async (req, res) => {
  const { text, publishDate, userID, postID } = req.body;

  const newComment = await Comment.create({
    text: text,
    publishDate: publishDate,
    userID: userID,
    postID: postID,
  });

  return res.status(201).json({ comment: newComment });
});
