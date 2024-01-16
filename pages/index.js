import PostForm from "@/components/PostForm";
import UsernameForm from "../components/UsernameForm"
import useUserInfo from "../hooks/UseUserInfo"
import { useState, useEffect } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";
import Layout from "@/components/layout";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const {userInfo, setUserInfo, UserInfoStatus} = useUserInfo();
  const [posts, setPosts] = useState([])
  const [idsLikedByMe, setIdsLikedByMe] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (UserInfoStatus === 'loaded' && userInfo?.email === undefined) {
      router.push('/login')
    }
  }, [UserInfoStatus, userInfo, router])

  useEffect(() => {
    if (userInfo?.username === undefined) {
      <UsernameForm />
    }
    fetchHomePosts()
  })

  if (UserInfoStatus === 'loading') {
    return (
      <div>Loading...</div>
    )
  }

  function fetchHomePosts() {
    axios.get('/api/posts').then(res => {
      setPosts(res.data.posts)
      setIdsLikedByMe(res.data.idsLikedByMe)
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
        <PostForm userInfo={userInfo} onPost={() => {fetchHomePosts()}} />
        <div className="">
          {posts.length > 0 && posts.map(post => (
            <div key={post._id} className="border-t border-socialBorder p-5">
              <PostContent {...post} likedByMe={idsLikedByMe.includes(post._id)} />
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}
