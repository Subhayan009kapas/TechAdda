const express = require("express");
const router = express.Router();
const { createPost, getAllPosts ,deletePost ,getMyPosts , searchPosts} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Post = require("../models/Post");
router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, deletePost);

router.get("/myposts", authMiddleware, getMyPosts); // GET /api/posts/myposts

router.get("/search", authMiddleware, searchPosts);


// GET /api/posts/search-by-author?q=query
router.get('/search-by-author', async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    });

    const userIds = users.map((u) => u._id);

    const posts = await Post.find({ author: { $in: userIds } })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
