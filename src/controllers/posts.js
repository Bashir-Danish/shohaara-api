import Post from "../models/post.js";
import { catchAsync } from "../middlewares.js";

export const getAllPosts = catchAsync(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({ message: "", posts: posts });
});

export const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (post) {
      await post.deleteOne();
      return res.status(200).json({ message: "Post Deleted", post: post });
    }
    return res.status(404).json({ message: "Post not Found" });
  } catch (err) {
    res.status(500).json({ message: "Invalid Operation" });
  }
});

export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedPost } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post doesn't exist" });
    }

    post.text = updatedPost.text;
    post.photo = updatedPost.photo;
    post.likes = updatedPost.likes;
    post.publishDate = updatedPost.publishDate;
    post.userID = updatedPost.userID;
    await post.save();

    res.status(200).json({ message: "Post updated", post: post });
  } catch (err) {
    res.status(500).json({ message: "Invalid Post Info", error: err.message });
  }
});

export const createPost = catchAsync(async (req, res) => {
  const { text, photo, likes, publishDate, userID } = req.body;

  const newPost = await Post.create({
    text: text,
    photo: photo,
    likes: likes,
    publishDate: publishDate,
    userID: userID,
  });

  return res.status(201).json({ post: newPost });
});
