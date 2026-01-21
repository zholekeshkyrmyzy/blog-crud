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
  try {
    const blog = await Blog.findOne({ blogId: Number(req.params.id) });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, body, author } = req.body;
    const blog = await Blog.findOne({ blogId: Number(req.params.id) });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.title = title;
    blog.body = body;
    blog.author = author || "Anonymous";

    await blog.save(); 
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ blogId: Number(req.params.id) });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
