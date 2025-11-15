import React, { useEffect } from "react";
import { Alert, Form, Input, Select, Spin } from "antd";
import PrimaryButton from "./Button";
import { useQuery } from "@apollo/client";
import "../styles/form.css";
import { GET_USER_FOLLOWERS } from "../../Queries";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

interface PostFormProps {
  setFormValue: (values: any) => void;
  handleSubmit: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ setFormValue, handleSubmit }) => {
  const handleValueChange = (changedValues: Record<string, any>) => {
    setFormValue((formValues: any) => ({ ...formValues, ...changedValues }));
  };

  const {
    data: tagsData,
    loading,
    error,
    refetch,
  } = useQuery(GET_USER_FOLLOWERS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading)
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <Spin className="!text-white" />
      </div>
    );

  if (error) return <Alert message="Error fetching followers" type="error" />;

  return (
    <Form
      {...formItemLayout}
      onValuesChange={handleValueChange}
      className="!w-full"
    >
      <Form.Item label="Content" name="content" className="!mb-0">
        <Input.TextArea placeholder="Post content" />
      </Form.Item>

      <Form.Item label="Tag" name="tags" className="!mb-0">
        <Select
          placeholder="Select a user"
          style={{ width: 200 }}
          mode="multiple"
          optionFilterProp="children"
          className="!w-full"
        >
          {tagsData.getUserFollowers.map((user: any) => (
            <Select.Option key={user._id} value={user._id}>
              {user.username}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item className="flex justify-center">
        <PrimaryButton
          type="button"
          onClick={handleSubmit}
          title="Add Post"
          className="bg-red-600 text-white p-3 rounded-lg text-center font-bold mt-4 !border-0 active:bg-red-800 m-auto"
        />
      </Form.Item>
    </Form>
  );
};

export default PostForm;
