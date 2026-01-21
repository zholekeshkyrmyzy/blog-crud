const Blog = require("../models/Blog");
exports.createBlog = async (req, res) => {
  try {
    const { title, body, author } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const lastBlog = await Blog.findOne().sort({ blogId: -1 });
    const blogId = lastBlog ? lastBlog.blogId + 1 : 1;

    const blog = await Blog.create({ blogId, title, body, author });
    res.status(201).json(blog);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate blogId, try again" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ blogId: -1 }); // newest first
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });
  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
