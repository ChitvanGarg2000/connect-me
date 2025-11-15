import Post from "../models/Posts.js";
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/authToken.js";
import checkAuth from "../utils/chekckAuth.js";

const resolvers = {
  Post: {
    likesCount: (parent) => parent.likes.length,
    commentsCount: (parent) => parent.comments.length,
  },

  Query: {
    getUser: async (_, __, { req }) => {
      const user = checkAuth(req);

      if (!user) {
        throw new Error("User not authenticated");
      }
      return await User.findOne({ email: user?.email }).populate("followings");
    },
    getAllUsers: async (_, { name, page = 1, limit = 10 }, { req }) => {
      const user = checkAuth(req);

      if (!user) {
        throw new Error("User not authenticated");
      }
      const query = {
        email: { $ne: user.email },
      };

      if (name) {
        query.username = { $regex: name, $options: "i" };
      }

      try {
        let users;
        if (name) {
          users = await User.find(query);
        } else {
          users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        }

        return users;
      } catch (err) {
        throw new Error("Users not found", err.message);
      }
    },
    getPost: async (_, { id }) => {
      return await Post.findById(id).populate("author").populate("tags");
    },
    getUserPosts: async (_, { page = 1, limit = 10 }, { req }) => {
      try {
        const user = checkAuth(req);
        if (!user) throw new Error("Authentication failed");

        const email = user.email;
        const userData = await User.findOne({ email });
        if (!userData) throw new Error("User not found");

        const userPosts = await Post.find({ author: userData._id })
          .populate("author tags")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        return userPosts;
      } catch (error) {
        console.error(error);
        return new Error("Something went wrong", error.message);
      }
    },
    getFollowerPosts: async (_, { page = 1, limit = 10 }, { req }) => {
      try {
        const user = checkAuth(req);
        if (!user) throw new Error("Authentication failed");

        const email = user.email;
        const userData = await User.findOne({ email });
        if (!userData) throw new Error("User not found");

        const followerIds = userData.followings.map((follower) => follower._id);

        const followerPosts = await Post.find({ author: { $in: followerIds } })
          .populate("author tags")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        return followerPosts;
      } catch (error) {
        console.error(error);
        return new Error("Something went wrong", error.message);
      }
    },
    getUserFollowers: async (_, __, { req }) => {
      const user = checkAuth(req);

      if (!user) {
        throw new Error("User not authenticated");
      }
      const data = await User.findOne(
        { email: user?.email },
        { followings: 1 }
      ).populate("followings");

      return data?.followings;
    },
  },

  Mutation: {
    createUser: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = await generateToken({ email, username });
      let user = new User({ username, email, password: hashedPassword });
      user = await user.save();
      return {
        user,
        token,
      };
    },
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (user) {
        const isVerified = await bcrypt.compare(password, user.password);

        if (isVerified) {
          const token = await generateToken({ userId: user._id, email });

          return { user, token };
        }
        throw new Error("Invalid Password");
      } else {
        throw new Error("User not found.");
      }
    },
    createPost: async (_, { content, imageUrl, authorId, tags }, { req }) => {
      try {
        const user = checkAuth(req);
        if (!user) {
          throw new Error("Authentication required.");
        }
        const post = new Post({ content, imageUrl, author: authorId, tags });
        return await post.save();
      } catch (err) {
        console.log(err);
        return new Error("Unable to create Post");
      }
    },
    addComment: async (_, { postId, body, userId, username }) => {
      const post = await Post.findById(postId);
      const newComment = {
        body,
        username,
        userId,
        createdAt: new Date().toISOString(),
      };
      post.comments.push(newComment);
      await post.save();
      return post.comments;
    },
    addLike: async (_, { postId, userId, username }) => {
      const post = await Post.findById(postId);

      if (post.likes.filter((like) => like.userId === userId).length > 0) {
        throw new Error("Already Liked");
      }

      const newLike = {
        username,
        userId,
        createdAt: new Date().toISOString(),
      };
      post.likes.push(newLike);
      await post.save();
      return post;
    },
    addFollower: async (_, { targetUserId }, { req }) => {
      const user = checkAuth(req);
      if (!user) {
        throw new Error("Authentication required.");
      }

      const currentUser = await User.findOne(
        { email: user?.email },
        { _id: 1, followings: 1 }
      );

      if (!currentUser) {
        throw new Error("Current user not found.");
      }

      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new Error("Target user not found.");
      }

      if (currentUser.id.toString() === targetUser.id.toString()) {
        throw new Error("You cannot follow yourself.");
      }

      if (currentUser.followings.includes(targetUserId)) {
        throw new Error("You are already following this user.");
      }

      currentUser.followings.push(targetUserId);
      targetUser.followers.push(currentUser?._id);

      await currentUser.save();

      await targetUser.save();

      return currentUser;
    },
    unfollowUser: async (_, { targetUserId }, { req }) => {
      const user = checkAuth(req);
      if (!user) {
        throw new Error("Authentication required.");
      }

      const currentUser = await User.findOne(
        { email: user?.email },
        { _id: 1, followings: 1 }
      );

      if (!currentUser) {
        throw new Error("Current user not found.");
      }

      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new Error("Target user not found.");
      }

      if (currentUser.id.toString() === targetUser.id.toString()) {
        throw new Error("You cannot unfollow yourself.");
      }

      if (!currentUser.followings.includes(targetUserId)) {
        throw new Error("You are not following this user.");
      }

      currentUser.followings = currentUser.followings.filter(
        (id) => id.toString() !== targetUserId.toString()
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUser?._id?.toString()
      );

      await currentUser.save();

      await targetUser.save();

      return currentUser;
    },
  },
};

export default resolvers;
