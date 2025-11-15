import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId:String,
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      userId: String,
      username: String,
      createdAt: String,
    },
  ],
});

const Post = mongoose.model("Post", PostSchema);
export default Post
