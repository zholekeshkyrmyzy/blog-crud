const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogId: { type: Number, unique: true },
    title: { type: String, required: [true, "Title is required"] },
    body: { type: String, required: [true, "Body is required"] },
    author: { type: String, default: "Anonymous" }
  },
  { timestamps: true }
);

blogSchema.pre("save", async function () {
  if (this.isNew) {
    const lastBlog = await this.constructor.findOne().sort({ blogId: -1 });
    this.blogId = lastBlog ? lastBlog.blogId + 1 : 1;
  }
});


module.exports = mongoose.model("Blog", blogSchema);
