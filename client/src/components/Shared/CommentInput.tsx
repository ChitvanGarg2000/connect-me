import { Button, Input, Space } from "antd";
import React from "react";
import { IoMdSend } from "react-icons/io";
import { Comment } from "../../interfaces/Post";

interface CommentInputProps {
  onClick: () => void;
  onChange: (value: string) => void;
  comments: Comment[];
}

const CommentInput: React.FC<CommentInputProps> = ({
  onClick,
  onChange,
  comments,
}) => {
  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="w-full max-h-24 overflow-auto">
        {comments &&
          Array.isArray(comments) &&
          comments.map((comment: Comment) => {
            return (
              <div
                className="flex justify-between p-2"
                key={comment?.createdAt}
              >
                <p className="text-xs">{comment?.body}</p>
                <p className="text-xs font-semibold text-black">
                  {comment?.username}
                </p>
              </div>
            );
          })}
      </div>
      <Space.Compact className="w-full mt-3">
        <Input
          placeholder="Add your comment"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
        />
        <Button
          type="primary"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onClick();
          }}
          className="bg-rose-600"
        >
          <IoMdSend color="#fff" />
        </Button>
      </Space.Compact>
    </div>
  );
};

export default CommentInput;
