import gql from "graphql-tag";
const querySchema = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    followings: [User]
    followers: [User]
  }

  type Post {
    _id: ID!
    content: String!
    imageUrl: String
    author: User!
    tags: [User]
    comments: [Comment]
    likes: [Like]
    likesCount: Int!
    commentsCount: Int!
  }

  type Comment {
    body: String!
    userId: String!
    username: String!
    createdAt: String!
  }

  type Like {
    userId: String!
    createdAt: String!
    username: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    getUser: User
    getAllUsers(name: String, page: Int, limit: Int): [User]
    getPost(id: ID!): Post
    getUserFollowers: [User]
    getUserPosts(page: Int, limit: Int): [Post]
    getFollowerPosts(page: Int, limit: Int): [Post]
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayload
    loginUser(email: String!, password: String!): AuthPayload
    createPost(
      content: String!
      imageUrl: String!
      authorId: ID!
      tags: [ID]
    ): Post
    addComment(
      postId: ID!
      body: String!
      userId: String!
      username: String
    ):[Comment]
    addLike(postId: ID!, userId: String!, username: String): Post
    addFollower(targetUserId: ID!): User
    unfollowUser(targetUserId: ID!): User
  }
`;

export default querySchema;
