const mongoose = require("mongoose");
const Blog = require("./models/Blog");
require("dotenv").config();

async function fixBlogIds() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const blogs = await Blog.find().sort({ createdAt: 1 });

    let id = 1;
    for (let blog of blogs) {
      blog.blogId = id;
      await blog.save();
      id++;
    }

    console.log("✅ blogId fixed successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error fixing blogId:", err);
    process.exit(1);
  }
}

fixBlogIds();
