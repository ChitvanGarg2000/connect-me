import type { FormProps } from "antd";
import { Button, Form, Input, notification } from "antd";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../Mutations";
import AppLayout from "../Layout/AppLayout";
import PrimaryButton from "../components/Shared/Button";
import { useNavigate } from "react-router-dom";

type FieldType = {
  password?: string;
  email?: string;
};

const Login = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER, {
    fetchPolicy: "network-only",
  });

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
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

  const onFinish: FormProps<FieldType>["onFinish"] = async () => {
    form.validateFields().then(async (values) => {
      try {
        const data = await loginUser({ variables: values });

        if (data?.data?.loginUser) {
          const { token } = data?.data?.loginUser;
          setCookie("user_token", token, 1);
          navigate("/");
        }else{
          throw new Error('Unable to login')
        }
      } catch (error: any) {
        console.error("Error:", error);
        notification.error({
          message: error.message,
          placement: "topRight",
        });
      }
    });
  };

  const headButton = () => {
    return (
      <PrimaryButton
        onClick={() => navigate("/signup")}
        className="border-2 border-white rounded-md text-white p-3 bg-transparent"
        title="Sign Up"
      />
    );
  };

  return (
    <AppLayout isHome={false} button={headButton()} isLoading={loading}>
      <div className="w-3/4 md:w-1/2 m-auto bg-white shadow-md rounded-lg p-3 md:pt-5 mt-[150px] flex justify-center items-center">
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
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AppLayout>
  );
};

export default Login;
