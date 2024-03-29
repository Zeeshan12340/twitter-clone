import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import Navigation from '@/components/Navigation'
import { useEffect, useState } from 'react'
import PostContent from '@/components/PostContent'
import Cover from '@/components/Cover'
import Avatar from '@/components/Avatar'
import useUserInfo from '@/hooks/UseUserInfo'

export default function UserPage() {
    const router = useRouter()
    const {username} = router.query
    const {userInfo, UserInfoStatus} = useUserInfo()
    const [profileInfo, setProfileInfo] = useState(null)
    const [originalUserInfo, setOriginalUserInfo] = useState(null)
    const [posts, setPosts] = useState([])
    const [postsLikedByMe, setPostsLikedByMe] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        if (!username) return;
        fetch('/api/users?username=' + username)
        .then(response => response.json())
        .then(data => {
            setProfileInfo(data.user)
            setOriginalUserInfo(data.user)
            setIsFollowing(data.follow)
        })
    }, [username])

    useEffect(() => {
        if (!profileInfo?._id) return;
        fetch('/api/posts?author=' + profileInfo._id)
        .then(response => response.json())
        .then(data => {
            setPosts(data.posts)
            setPostsLikedByMe(data.idsLikedByMe)
        })
    }, [profileInfo])

    function updateUserImage(type, src) {
        setProfileInfo(prev => ({...prev, [type]: src}))
    }

    async function updateProfile() {
        const {bio, name, username} = profileInfo
        setEditMode(false)
        await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio, name, username })
        })
    }

    function cancel() {
        setEditMode(false)
        setProfileInfo(originalUserInfo)
    }

    const isMyProfile = profileInfo?._id === userInfo?._id

    async function toggleFollow() {
        setIsFollowing(prev => !prev)
        await fetch('/api/followers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: userInfo._id,
                destination: profileInfo._id
            }),
        });
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
                        editable={isMyProfile} />
                    <div className='flex justify-between'>
                        <div className='ml-5 max-w-1 relative'>
                            <div className='absolute -top-10 '>
                                <Avatar big src={profileInfo.image} type={'image'} editable={isMyProfile}
                                onChange={src => updateUserImage('image', src)}
                                classNames={''}
                                />
                            </div>
                        </div>
                        <div className='p-2'>
                            {!isMyProfile && (
                                <button onClick={toggleFollow}
                                    className={(isFollowing?'bg-socialWhite text-black hover:bg-red-300':'bg-socialCyan text-white') + ' rounded-full px-4 py-2'} >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                            {isMyProfile && !editMode && (
                                <button onClick={() => {setEditMode(true)}} className='bg-socialLightGrey text-socialCyan rounded-full px-4 py-2 ml-2'>Edit Profile</button>
                            )}
                        </div>
                    </div>
                    <div className='px-5 mt-4'>
                        {!editMode && (
                            <h1 className='font-bold text-xl leading-5'>{profileInfo.name}</h1>
                        )}
                        {editMode && (
                            <div className='flex -ml-1'>
                                <input type='text' value={profileInfo?.name} 
                                onChange={ev => setProfileInfo(prev => ({...prev, name: ev.target.value}))}
                                className='bg-socialBorder p-2 mb-1 rounded-full'></input>
                                <button onClick={cancel}
                                    className='bg-socialWhite text-black rounded-full px-4 py-2 ml-2'>
                                        Cancel
                                </button>
                                <button onClick={updateProfile}
                                    className='bg-socialCyan text-white rounded-full px-4 py-2 ml-2'>
                                        Save Profile
                                </button>
                            </div>
                        )}
                        {!editMode && (
                            <h2 className='text-socailLightGrey mt-1 text-sm'>@{profileInfo.username}</h2>
                        )}
                        {editMode && (
                            <div className='flex -ml-1'>
                                <input type='text' value={profileInfo?.username} 
                                onChange={ev => setProfileInfo(prev => ({...prev, username: ev.target.value}))}
                                className='bg-socialBorder mt-1 p-2 mb-1 rounded-full'></input>
                            </div>
                        )}
                        {!editMode && (
                            <div className='text-sm my-5'>
                                {profileInfo?.bio}
                            </div>
                        )}
                        {editMode && (
                            <div className='flex -ml-1'>
                                <textarea className='bg-socialBorder mt-1 p-2 rounded-2xl w-full block mb-2'
                                    onChange={ev => setProfileInfo(prev => ({...prev, bio: ev.target.value}))}
                                    type='text' value={profileInfo?.bio}></textarea>
                            </div>
                        )}
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