import PostForm from "@/components/PostForm";
import UsernameForm from "../components/UsernameForm"
import useUserInfo from "../hooks/useUserInfo"
import { useState, useEffect } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";

export default function Home() {
  const {userInfo, UserInfoStatus} = useUserInfo();
  const [posts, setPosts] = useState([])

  if (UserInfoStatus === 'loading') {
    return (
      <div>Loading...</div>
    )
  }

  function fetchHomePosts() {
    axios.get('/api/posts').then(res => {
      setPosts(res.data)
    })
  }

  useEffect(() => {
    fetchHomePosts()
  }, [])
  
  if (UserInfoStatus === 'loaded' && userInfo?.username === undefined) {
    return <UsernameForm />;
  }

  return (
    <div className="max-w-lg mx-auto border-l border-r border-socialBorder min-h-screen">
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm userInfo={userInfo} onPost={() => {fetchHomePosts()}} />
      <div className="">
        {posts.length > 0 && posts.map(post => (
          <div className="border-t border-socialBorder p-5">
            <PostContent post={post}/>
          </div>
        ))}
      </div>
    </div>
  )
}
