import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Dropdown, MenuProps, Skeleton, Space } from "antd";
import { FaUserCircle } from "react-icons/fa";
import { BsPostcardHeartFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaHome } from "react-icons/fa";

interface LayoutProps {
  isLoading: Boolean;
  children: ReactNode;
  isHome?: Boolean;
  button?: ReactNode;
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <div
        className="flex justify-between p-2 items-center gap-2 z-[200]"
        onClick={() => {
          document.cookie =
            "user_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          window.location.reload();
        }}
      >
        <p className="text-sm text-black">Log Out</p>
        <MdLogout color="#000" />
      </div>
    ),
  },
];

const AppLayout: React.FC<LayoutProps> = ({
  isLoading = false,
  children,
  isHome = true,
  button,
}) => {
  const { user } = useSelector((state: RootState) => state);
  const navigate = useNavigate();

  return (
    <section>
      <header className="w-full flex justify-between px-5 py-3 bg-red-600 sticky top-0 left-0 box-border z-[20]">
        <div className="font-bold text-white flex justify-center items-center ">
          Connect Me!
        </div>
        {isHome ? (
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                menu={{ items }}
                placement="bottomLeft"
                overlayClassName="dropdown_container"
              >
                <div className="flex gap-2 justify-center items-center">
                  <FaUserCircle size={24} color="#fff" />{" "}
                  <span className="text-white font-bold">{user.username} </span>
                </div>
              </Dropdown>
            </Space>
          </Space>
        ) : (
          button
        )}
      </header>
      <main className="w-full flex flex-col flex-1 justify-center items-center min-h-fit overflow-auto">
        {isLoading ? <Skeleton active={isLoading as boolean} /> : children}
      </main>
      {isHome && (
        <footer className="w-full flex justify-between px-5 py-3 bg-red-600 fixed bottom-0 left-0 box-border z-[20]">
          <div
            className="flex flex-1 justify-center items-center gap-1 text-white flex-col"
            onClick={() => navigate("/")}
          >
            <FaHome size={16} color="#fff" />
            <p className="text-xs font-semibold">Home</p>
          </div>
          <div
            className="flex flex-1 justify-center items-center gap-1 text-white flex-col"
            onClick={() => navigate("/posts")}
          >
            <BsPostcardHeartFill size={16} color="#fff" />
            <p className="text-xs font-semibold">My Posts</p>
          </div>
          <div
            className="flex flex-1 justify-center items-center gap-1 text-white flex-col"
            onClick={() => navigate("/addPost")}
          >
            <IoMdAddCircle size={16} color="#fff" />
            <p className="text-xs font-semibold">Add Posts</p>
          </div>
          <div
            className="flex flex-1 justify-center items-center gap-1 text-white flex-col"
            onClick={() => navigate("/followers")}
          >
            <FaUserFriends size={16} color="#fff" />
            <p className="text-xs font-semibold">Add Friends</p>
          </div>
        </footer>
      )}
    </section>
  );
};

export default AppLayout;
