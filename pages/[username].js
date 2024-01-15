import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import Navigation from '@/components/Navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PostContent from '@/components/PostContent'
import Cover from '@/components/Cover'
import Avatar from '@/components/Avatar'

export default function UserPage() {
    const router = useRouter()
    const {username} = router.query
    const [profileInfo, setProfileInfo] = useState(null)
    const [posts, setPosts] = useState([])
    const [postsLikedByMe, setPostsLikedByMe] = useState([])

    useEffect(() => {
        if (!username) return;
        axios.get('/api/users?username=' + username)
        .then(response => {
            setProfileInfo(response.data.user)
        })
    }, [username])

    useEffect(() => {
        if (!profileInfo?._id) return;
        axios.get('/api/posts?author=' + profileInfo._id)
        .then(response => {
            setPosts(response.data.posts)
            setPostsLikedByMe(response.data.idsLikedByMe)
        })
    }, [profileInfo])

    function updateUserImage(type, src) {
        setProfileInfo(prev => ({...prev, [type]: src}))
    }

    return (
        <Layout>
            {!!profileInfo && (
                <div>
                    <div className='px-5 pt-2'>
                        <Navigation title={username} />
                    </div>
                    <Cover src={profileInfo.cover}
                        onChange={src => updateUserImage('cover', src)}
                        editable={true} />
                    <div className='flex justify-between'>
                        <div className='ml-5 max-w-1 relative'>
                            <div className='absolute -top-10 '>
                                <Avatar big src={profileInfo.image} editable={true}
                                onChange={src => updateUserImage('image', src)}
                                classNames={''}
                                />
                            </div>
                        </div>
                        <div className='p-2'>
                            <button className='bg-socialCyan text-white rounded-full px-4 py-2'>Follow</button>
                        </div>
                    </div>
                    <div className='px-5 mt-2'>
                        <h1 className='font-bold text-xl leading-5'>{profileInfo.name}</h1>
                        <h2 className='text-socailLightGrey text-sm'>@{profileInfo.username}</h2>
                        <div className='text-sm my-5'>
                            Hello world
                        </div>
                    </div>
                </div>
            )}
            {posts?.length > 0 && posts.map(post => (
                <div key={post._id} className="p-5 border-t border-socialBorder">
                    <PostContent {...post} likedByMe={postsLikedByMe.includes(post._id)} />
                </div>
            ))}
        </Layout>
    )
}