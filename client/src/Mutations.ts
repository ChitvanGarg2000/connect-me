import gql from "graphql-tag";
export const CREATE_NEW_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        _id
        email
        username
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        _id
        email
        username
      }
      token
    }
  }
`;

export const ADD_FOLLOWERS = gql`
  mutation AddFollower($targetUserId: ID!) {
    addFollower(targetUserId: $targetUserId) {
      followings {
        _id
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost(
    $content: String!
    $authorId: ID!
    $imageUrl: String!
    $tags: [ID]
  ) {
    createPost(
      content: $content
      authorId: $authorId
      imageUrl: $imageUrl
      tags: $tags
    ) {
      _id
    }
  }
`;

export const LIKE_POST = gql`
  mutation AddLike($postId: ID!, $userId: String!, $username: String) {
    addLike(postId: $postId, userId: $userId, username: $username) {
      likesCount
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment(
    $postId: ID!
    $body: String!
    $userId: String!
    $username: String
  ) {
    addComment(
      postId: $postId
      body: $body
      userId: $userId
      username: $username
    ) {
      body
      username
    }
  }
`;


export const UNFOLLOW_USER = gql`
  mutation Unfollow($targetUserId: ID!) {
    unfollowUser(targetUserId: $targetUserId) {
      followings {
        _id
      }
    }
  }
`
