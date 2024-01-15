import PostContent from '@/components/PostContent'
import PostForm from '@/components/PostForm'
import Layout from '@/components/layout'
import UseUserInfo from '@/hooks/UseUserInfo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navigation from '@/components/Navigation'
import { signOut } from 'next-auth/react'

export default function PostPage() {
    const router = useRouter()
    const {id} = router.query
    const [post, setPost] = useState(null)
    const [replies, setReplies] = useState([])
    const [repliesLikedByMe, setRepliesLikedByMe] = useState([])
    const {userInfo, setUserInfo} = UseUserInfo()

    const fetchData = async () => {
        const response = await fetch(`/api/posts?id=${id}`);            
        const data = await response.json();
        setPost(data);

        axios.get('/api/posts?parent=' + id)
        .then(response => {
            setReplies(response.data.posts)
            setRepliesLikedByMe(response.data.idsLikedByMe)
        })
    };

    useEffect(() => {
        if (!id) return;

        fetchData();
    }, [id])

    async function logout() {
        setUserInfo(null)
        await signOut()
    }

    return (
        <Layout userInfo logout={logout} >
            {post && (
                <div className='px-5 py-2'>
                    <Navigation />
                    <PostContent {...post} big />
                </div>
            )}
            {!!userInfo && (
                <div className='border-t border-socialBorder py-5'>
                    <PostForm userInfo={userInfo} onPost={fetchData} compact 
                              parent={id} />
                </div>
            )}
            <div className=''>
                {replies.length > 0 && replies.map(reply => (
                    <div key={reply._id} className='p-5 border-t border-socialBorder'>
                        <PostContent {...reply} likedByMe={repliesLikedByMe.includes(reply._id)} />
                    </div>
                ))}
            </div>
        </Layout>
    )
}