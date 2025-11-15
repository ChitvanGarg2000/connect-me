import { useEffect, useState } from "react";
import AppLayout from "./Layout/AppLayout";
import { GET_FOLLOWER_POSTS, GET_USER_INFO } from "./Queries";
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import PostCard from "./components/Shared/PostCard";
import { PostData } from "./interfaces/Post";
import { notification, Spin } from "antd";
import useInfiniteScroll from "./hooks/useInfiniteScroll";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const limit = 10;
  const {
    data,
    error: postsError,
    loading: postsLoading,
    refetch,
  } = useQuery(GET_FOLLOWER_POSTS, {
    variables: { page, limit },
    onCompleted: (fetchedData) => {
      setHasMore(fetchedData.getFollowerPosts.length === limit);
      setPosts((prevPosts) => [...prevPosts, ...fetchedData.getFollowerPosts]);
    },
    onError: (error) => {
      notification.error({
        message: error.message,
        placement: "topRight",
      });
    },
  });

  const handleDataLoading = async () => {
    try {
      if (hasMore && !postsLoading && page > 1) {
        setPage((page) => page + 1);
        refetch({
          variables: { page, limit },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollRef = useInfiniteScroll(handleDataLoading);

  const {
    data: userData,
    error,
    loading: userLoading,
  } = useQuery(GET_USER_INFO, {
    onCompleted: (data) => {
      const followers = data?.getUser?.followings?.map((value: any) =>
        typeof value === "string" ? value : value?._id
      );
      const userWithFollowers = { ...data.getUser, followings: followers };
      dispatch(setUser(userWithFollowers));
    },
    onError: (error) => {
      console.error("User Info Error:", error.message);
      notification.error({
        message: error.message,
        placement: "topRight",
      });
    },
  });

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (userLoading || postsLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <Spin className="!text-white" />
      </div>
    );
  }

  if (error) {
    console.error("Error fetching posts:", error);
    return <div>Error loading posts.</div>;
  }

  return (
    <AppLayout isLoading={userLoading || postsLoading} isHome={true}>
      <section className="flex flex-col md:flex-row md:justify-start w-full md:w-auto gap-3 mt-4 mb-[70px]">
        {posts.length > 0 ? (
          posts.map((post: PostData, index: number) => (
            <div
              ref={index === posts.length - 1 ? scrollRef : null}
              className="w-full"
            >
              <PostCard
                key={post._id}
                id={post._id}
                postImage={post.imageUrl}
                author={post.author}
                likesCount={post.likesCount}
                content={post.content}
                tags={post.tags}
                likes={post.likes}
                comments={post?.comments}
              />
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </AppLayout>
  );
}

export default App;
