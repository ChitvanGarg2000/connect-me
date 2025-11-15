import AppLayout from "../Layout/AppLayout";
import { GET_USER_POSTS } from "../Queries";
import { useQuery } from "@apollo/client";
import PostCard from "../components/Shared/PostCard";
import { PostData } from "../interfaces/Post";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useState } from "react";
import { Spin } from "antd";

const MyPosts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const limit = 10;
  const { data, error, loading, refetch } = useQuery(GET_USER_POSTS, {
    variables: { page, limit },
    onCompleted: (fetchedData) => {
      setHasMore(fetchedData.getUserPosts.length === limit);
      setPosts((prevPosts) => [...prevPosts, ...fetchedData.getUserPosts]);
    },
  });

  const handleDataLoading = async () => {
    try {
      if (hasMore && !loading && page > 1) {
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

  if (error) {
    console.error("Error fetching posts:", error);
    return <div>Error loading posts.</div>;
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <Spin className="!text-white" />
      </div>
    );
  }
  return (
    <AppLayout isLoading={loading} isHome={true}>
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
};

export default MyPosts;
