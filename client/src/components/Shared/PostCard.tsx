import React, { useMemo, useState } from "react";
import { Card, notification, Skeleton, Spin } from "antd";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { Author, Comment, Like, Tag } from "../../interfaces/Post";
import "../styles/PostCard.css";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT, LIKE_POST } from "../../Mutations";
import CommentInput from "./CommentInput";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaUserTag } from "react-icons/fa6";

const { Meta } = Card;

interface PostCardInterface {
  id: string;
  postImage: string;
  author: Author;
  likesCount: Number;
  content: string;
  comments: Comment[];
  tags: Tag[];
  likes: Like[];
}

const PostCard: React.FC<PostCardInterface> = ({
  id,
  postImage,
  author,
  likesCount,
  comments,
  content,
  tags,
  likes,
}) => {
  const { user } = useSelector((state: RootState) => state);

  const [isLiked, setLiked] = useState<boolean>(false);
  const [commentInput, showCommentInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [allComments, setComments] = useState<Comment[]>(comments);
  const [likeCount, setLikeCount] = useState(likesCount);

  const [addLike, { data, loading, error }] = useMutation(LIKE_POST, {
    variables: {
      username: user?.username,
      userId: user?._id,
      postId: id,
    },
    onCompleted: (data) => {
      setLikeCount(data?.addLike?.likesCount);
      setLiked(true);
    },
    onError: (error) => {
      notification.error({
        message: error.message,
        placement: "topRight",
      });
    },
  });

  const [
    addComment,
    { data: commentData, loading: loadingComment, error: commentError },
  ] = useMutation(ADD_COMMENT, {
    variables: {
      body: comment,
      username: user?.username,
      userId: user?._id,
      postId: id,
    },
    onCompleted: (data) => {
      setComments(data?.addComment);
      notification.success({
        message: "Comment Added",
        placement: "topRight",
      });
    },
    onError: (error) => {
      notification.error({
        message: error.message,
        placement: "topRight",
      });
    },
  });

  const alreadyLiked = useMemo(() => {
    return likes.filter((like) => like.userId === user?._id).length > 0;
  }, [likes, user]);

  const handleLikeClick = async () => {
    try {
      await addLike();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentAdd = async () => {
    try {
      await addComment();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || loadingComment)
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <Spin className="!text-white" />
      </div>
    );

  return (
    <Card
      hoverable
      cover={
        <img
          alt="post"
          src={postImage}
          className="max-h-[150px] object-cover"
        />
      }
      className="w-[95%] md:min-w-max m-auto"
    >
      <div className="flex justify-between items-center w-full gap-3">
        <Meta
          title={author?.username}
          description={
            <p>
              {content} <br />{" "}
              {tags && tags.length > 0 && (
                <span className="font-semibold flex gap-1 items-center">
                  <FaUserTag color="#333" size={12} />{tags.map((tag) => tag?.username).join(",")}
                </span>
              )}
            </p>
          }
        />
        <div className="user_interaction flex justify-center align-center gap-2">
          <div className="flex flex-col justify-center items-center gap-2">
            {alreadyLiked || isLiked ? (
              <BiSolidLike color="#dc2626" />
            ) : (
              <BiLike onClick={handleLikeClick} />
            )}
            <p>{likeCount.toString()}</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <FaRegComment onClick={() => showCommentInput((prev) => !prev)} />
            <p>{allComments.length.toString()}</p>
          </div>
        </div>
      </div>
      {commentInput && (
        <CommentInput
          onChange={(val: string) => setComment(val)}
          onClick={handleCommentAdd}
          comments={allComments}
        />
      )}
    </Card>
  );
};

export default PostCard;
