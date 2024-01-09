import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Link from 'next/link'

export default function PostContent({ post }) {
    return (
        <div className="flex">
            <Avatar src={post.author.image} />
            <div className="pl-2">
                <div>
                    <span className="font-bold">{post.author.name}</span>
                    <span className="pl-1 text-socialLightGrey">@{post.author.username}</span>
                    {post.createdAt && (
                        <span className="pl-1 text-socialLightGrey"><ReactTimeAgo date={post.createdAt} timeStyle={"twitter"}/></span>
                    )}
                </div>
                <Link href={`/${post.author.username}/status/${post._id}`}>
                    {post.text}
                </Link>
            </div>
        </div>
    )
}