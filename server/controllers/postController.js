const Post = require("../models/Post");
const User = require("../models/User");

// to post a new post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({
      content,
      author: req.user.userId,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// to get list of all posts

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to get posts" });
  }
};

// to delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    console.log("post.author:", post.author.toString());
    console.log("req.user.userId:", req.user.userId);

    if (post.author.toString() !== req.user.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await post.deleteOne(); // ✅ fix here
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};



// Get posts by the authenticated user
exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({ author: userId }).populate("author", "name email");
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Failed to fetch your posts." });
  }
};


// Add to postController.js
exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const posts = await Post.find({
      content: { $regex: query, $options: "i" }
    }).populate("author", "name email");

    res.json(posts);
  } catch (err) {
    console.error("Error searching posts:", err);
    res.status(500).json({ error: "Failed to search posts." });
  }
};