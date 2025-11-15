import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, notification } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_USER } from "../Mutations";
import AppLayout from "../Layout/AppLayout";
import PrimaryButton from "../components/Shared/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";

type FieldType = {
  username?: string;
  password?: string;
  email?: string;
};

const SignUpForm: React.FC = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createUser, { data, loading, error }] = useMutation(CREATE_NEW_USER);

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Something went wrong",
      placement: "topRight",
    });
  };

  const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const { data } = await createUser({ variables: values });
      
      if (data?.createUser) {
        const { token } = data.createUser;
        setCookie("user_token", token, 1);
        dispatch(setUser(data.createUser.user));
        navigate("/");
      } else {
        throw new Error("Sign up failed")
      }
    } catch (error: any) {
      console.error("Error:", error);
      notification.error({
        message: error.message,
        placement:"topRight"
      });
    }
  };

  const headButton = () => {
    return (
      <PrimaryButton
        onClick={() => navigate("/login")}
        className="border-2 border-white rounded-md text-white p-3 bg-transparent"
        title="Login"
      />
    );
  };

  return (
    <AppLayout isHome={false} button={headButton()} isLoading={loading}>
      <div className="w-3/4 md:w-1/2 m-auto bg-white shadow-md rounded-lg p-3 mt-[150px] flex justify-center items-center">
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="w-full md:w-3/4"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 3, message: "Username must be at least 3 characters." },
              { max: 15, message: "Username cannot exceed 15 characters." },
            ]}
            className="!mb-3"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
            className="!mb-3"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters." },
              { max: 20, message: "Password cannot exceed 20 characters." },
              {
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
              },
            ]}
            className="!mb-3"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="w-full flex justify-center items-center md:mb-0">
            <Button
              className="bg-red-600 text-white p-3 md:p-4 rounded-lg md:text-lg text-center font-bold mt-4 !border-0 active:bg-red-800"
              htmlType="submit"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AppLayout>
  );
};

export default SignUpForm;
