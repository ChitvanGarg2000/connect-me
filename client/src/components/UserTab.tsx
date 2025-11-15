import React, { useMemo, useState, useEffect } from "react";
import PrimaryButton from "./Shared/Button";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
import { useMutation } from "@apollo/client";
import { notification } from "antd";
import { ADD_FOLLOWERS, UNFOLLOW_USER } from "../Mutations";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addUserFollowers } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

interface UserTabProps {
  _id: string;
  username: string;
  followers: {_id: string}[]; 
}

const UserTab: React.FC<UserTabProps> = ({ _id, username, followers }) => {
  const { user: userData } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  const [isFollower, setFollower] = useState<boolean>(false);

  const checkUser = useMemo(() => {
    return followers.filter((follower) => follower?._id === userData?._id).length > 0;
  }, [followers, userData]);

  useEffect(() => {
    setFollower(checkUser);
  }, []);

  const [addUser] = useMutation(ADD_FOLLOWERS, {
    variables: {
      targetUserId: _id,
    },
    onCompleted: (data) => {
      setFollower(true);
      notification.success({
        message: "Successfully Followed",
        placement: "topRight",
      });
      dispatch(
        addUserFollowers(
          data?.addFollower?.followings.map((user: any) => user?._id)
        )
      );
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
        placement: "topRight",
      });
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: {
      targetUserId: _id,
    },
    onCompleted: (data) => {
      setFollower(false);
      notification.success({
        message: "Successfully Unfollowed",
        placement: "topRight",
      });
      dispatch(
        addUserFollowers(
          data?.unfollowUser?.followings.map((user: any) => user?._id)
        )
      );
    },
    onError: (error) => {
      console.error("Error unfollowing user:", error);
    },
  });

  const addFollower = async () => {
    try {
      await addUser();
    } catch (error) {
      console.log(error);
    }
  };

  const removeFollower = async () => {
    try {
      await unfollowUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between p-2 rounded-lg shadow-md bg-white items-center">
      <p className="font-semibold">{username}</p>
      <PrimaryButton
        type="button"
        title={isFollower ? (
          <RiUserUnfollowFill color="#fff" size={16} />
        ) : (
          <RiUserFollowFill color="#fff" size={16} />
        )}
        className="bg-red-600 text-white p-3 rounded-lg text-center font-bold !border-0 active:bg-red-800"
        onClick={isFollower ? removeFollower : addFollower}
      />
    </div>
  );
};

export default UserTab;