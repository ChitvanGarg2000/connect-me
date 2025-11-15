import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../Queries";
import SearchBar from "../components/Shared/SearchBar";
import { GetProps, Input, Spin } from "antd";
import AppLayout from "../Layout/AppLayout";
import UserTab from "../components/UserTab";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

interface UserInfoProps {
  _id: string;
  username: string;
  followers: [string];
}

type SearchProps = GetProps<typeof Input.Search>;

const limit = 10;

const Follow = () => {
  const [users, setUsers] = useState<UserInfoProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [getAllUsers, { loading, error }] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getAllUsers) {
        if (data.getAllUsers.length < limit) {
          setHasMore(false);
        }
        setUsers((currUsers) => {
          const newUsers = data.getAllUsers.filter(
            (newUser: UserInfoProps) => !currUsers.some(currUser => currUser._id === newUser._id)
          );
          return [...currUsers, ...newUsers];
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching users:", error);
    },
  });

  const searchUser: SearchProps["onSearch"] = async (value: string) => {
    setSearchTerm(value); // Store search term
    setPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore for new search
    setUsers([]); // Clear previous users

    try {
      await getAllUsers({
        variables: { name: value, page: 1, limit },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFetchUsers = async () => {
    if (hasMore && page > 1) {
      await getAllUsers({
        variables: {
          name: searchTerm,
          page,
          limit,
        },
      });
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      getAllUsers({
        variables: {
          page,
          limit,
        },
      });
    }
  }, [getAllUsers]);

  const usersRef = useInfiniteScroll(handleFetchUsers);

  return (
    <AppLayout isLoading={loading && page === 1} isHome={true}>
      <section className="flex flex-col gap-2 w-full px-4">
        <div className="w-full mx-auto my-3">
          <SearchBar
            placeholder="Search for User"
            onSearch={searchUser}
            styles="!border-0 outline-0"
          />
        </div>
        <div className="flex flex-col w-full gap-1 overflow-y-auto flex-1 justify-center items-center">
          {users.map((user: UserInfoProps, index: number) => (
            <div className="w-full" ref={index === users.length - 1 && hasMore ? usersRef : null} key={user._id}>
              <UserTab
                username={user.username}
                _id={user._id}
                followers={user.followers}
              />
            </div>
          ))}
        </div>
        {page > 1 && loading && <Spin className="!text-white" />}
      </section>
    </AppLayout>
  );
};

export default Follow;