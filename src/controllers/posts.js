import Post from "../models/post.js";
import { catchAsync } from "../middlewares.js";

// export const getAllPosts = catchAsync(async (req, res) => {
//   const posts = await Post.find()
//     .sort({ createdAt: -1 })
//     .populate({
//       path: "userID",
//       select: "-password",
//     })
//     .exec();

//   console.log(posts);
//   res.status(200).json({ message: "", posts: posts });
// });
export const getAllPosts = catchAsync(async (req, res) => {
  // Fetch posts and populate the 'userID' field
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "userID",
      select: "-password",
    })
    .exec();

  // Fetch and populate the 'comments' field for each post
  for (const post of posts) {
    await Post.populate(post, {
      path: "comments",
      select: "text userID createdAt",
      populate: {
        path: "userID",
        select: "username",
      },
    });
  }
 
  console.log(posts);
  res.status(200).json({ message: "", posts: posts });
});

export const createPost = catchAsync(async (req, res) => {
  const { text, imagePath, userId } = req.body;

  try {
    const newPost = await Post.create({
      text: text,
      photo: imagePath ?? "",
      userID: userId,
    });
    const post = await Post.findOne({ _id: newPost._id })
      .populate({
        path: "userID",
        select: "-password",
      })
      .exec();
    return res.status(201).json({ post: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
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

export const likeUnlikePost = async (req, res) => {
  const { postId, userId } = req.body;
  console.log(req.body);
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
      await post.save();
      console.log(post);

      return res.status(200).json({ message: "Post unliked", post });
    } else {
      post.likes.push(userId);
      await post.save();
      console.log(post);
      return res.status(200).json({ message: "Post liked", post });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
