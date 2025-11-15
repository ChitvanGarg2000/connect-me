import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import UploadAvatar from "../components/Shared/UploadAvatar";
import PostForm from "../components/Shared/PostForm";
import { PostFormProps } from "../interfaces/Post";
import AppLayout from "../Layout/AppLayout";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../Mutations";
import { notification } from "antd";

const AddPost = () => {
  const { user } = useSelector((state: RootState) => state);
  const [image, setImage] = useState<string>("");
  const [form, setFormData] = useState<PostFormProps>({
    content: "",
    tags: [],
  });

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      notification.success({
        message:"Post Successfully created",
        placement:"topRight"
      })
      return
    },

    onError: (error) => {
      notification.success({
        message:error.message,
        placement:"topRight"
      })
      return
    }
  })

  const handleSubmit = async () => {
    try {
      const {content, tags} = form;

      await createPost({
        variables:{
          content,
          imageUrl: image,
          tags,
          authorId: user?._id
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AppLayout isLoading={false} isHome={true}>
      <div className="container flex min-h-[85vh] justify-center items-center">
        <section className="flex flex-col gap-2 justify-center items-center p-3 bg-white rounded-2xl shadow-xl m-auto">
          <h2 className="font-bold text-3xl">Add Post</h2>
          <UploadAvatar onFileUpload={setImage} />
          <PostForm
            handleSubmit={handleSubmit}
            setFormValue={setFormData}
          />
        </section>
      </div>
    </AppLayout>
  );
};

export default AddPost;
