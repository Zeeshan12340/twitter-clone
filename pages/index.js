import PostForm from "@/components/PostForm";
import UsernameForm from "../components/UsernameForm"
import useUserInfo from "../hooks/UseUserInfo"
import { useState, useEffect } from "react";
import PostContent from "@/components/PostContent";
import Layout from "@/components/layout";
import { signOut } from "next-auth/react";

export default function Home() {
  const {userInfo, setUserInfo, status} = useUserInfo();
  const [posts, setPosts] = useState([])
  const [idsLikedByMe, setIdsLikedByMe] = useState([])

  useEffect(() => {
    if (status === 'loading') return;
    fetchHomePosts()
  }, [status])

  if (status === "authenticated" && !!userInfo && userInfo?.username === undefined) {
    return (
      <UsernameForm />
    )
  }

  if (status === 'loading') {
    return (
      <div>Loading...</div>
    )
  }

  function fetchHomePosts() {
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data.posts);
        setIdsLikedByMe(data.idsLikedByMe);
      })
  }

  async function logout() {
    setUserInfo(null)
    await signOut()
  }

  return (
    <>
      <Layout userInfo={userInfo} logout={logout} >
        <h1 className="text-lg font-bold p-4">Home</h1>
        {userInfo && (
          <PostForm userInfo={userInfo} onPost={() => {fetchHomePosts()}} />
        )}
        <div className="">
          {posts.length > 0 && posts.map(post => (
            <div key={post._id} className="border-t border-socialBorder p-5">
              {post.parent && (
                <div>
                  <PostContent {...post.parent} />
                  <div className="h-12 border-l-2 border-socialBorder ml-6"></div>
                </div>
              )}
              <PostContent {...post} likedByMe={idsLikedByMe.includes(post._id)} />
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}
