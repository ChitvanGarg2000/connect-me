export interface Comment {
  userId: string;
  username: string;
  body: string;
  createdAt: string;
}

export interface Like {
  userId: string;
  username: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  author: Author;
  comments: Comment[];
  commentsCount: number;
  likesCount: number;
  imageUrl: string;
  content: string;
  tags: Tag[];
  likes: Like[];
}

export interface PostFormProps {
  content: string;
  tags: String[];
}

export interface PostData {
  _id: string;
  author: Author;
  comments: any[];
  commentsCount: number;
  likesCount: number;
  imageUrl: string;
  content: string;
  tags: Tag[];
  likes: any[];
}

export interface Author {
  _id: string;
  username: string;
}

export interface Tag {
  username: string;
}
