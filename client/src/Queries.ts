import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers($name: String, $page: Int, $limit: Int) {
    getAllUsers(name: $name, page: $page, limit: $limit) {
      username
      _id
      followers {
        _id
      }
    }
  }
`;

export const GET_USER_INFO = gql`
  query GetUser {
    getUser {
      _id
      email
      followings {
        _id
      }
      username
    }
  }
`;

export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers {
    getUserFollowers {
      username
      _id
    }
  }
`;

export const GET_FOLLOWER_POSTS = gql`
  query GetFollowerPosts($page: Int, $limit: Int) {
    getFollowerPosts(page: $page, limit: $limit) {
      _id
      author {
        _id
        username
      }
      comments {
        username
        body
        createdAt
      }
      commentsCount
      likesCount
      imageUrl
      content
      tags {
        username
      }
      likes {
        userId
        username
        createdAt
      }
    }
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($page: Int, $limit: Int) {
    getUserPosts(page: $page, limit: $limit) {
      _id
      author {
        _id
        username
      }
      comments {
        userId
        username
        body
        createdAt
      }
      commentsCount
      likesCount
      imageUrl
      content
      tags {
        username
      }
      likes {
        userId
        username
        createdAt
      }
    }
  }
`;
