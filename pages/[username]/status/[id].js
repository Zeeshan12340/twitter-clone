import PostContent from '@/components/PostContent'
import PostForm from '@/components/PostForm'
import Layout from '@/components/layout'
import UseUserInfo from '@/hooks/UseUserInfo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PostPage() {
    const router = useRouter()
    const {id} = router.query 
    const [post, setPost] = useState(null)
    const [replies, setReplies] = useState([])
    const [repliesLikedByMe, setRepliesLikedByMe] = useState([])
    const {userInfo} = UseUserInfo()

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

    return (
        <Layout userInfo logout >
            {post && (
                <div className='px-5 py-2'>
                    <Link href={"/"}>
                        <div className='flex mb-5 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                        </svg>
                            Tweet
                        </div>
                    </Link>
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