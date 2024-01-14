import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Link from 'next/link'
import PostButtons from "./PostButtons";

export default function PostContent({ 
    author, text, createdAt,
    _id, likesCount, likedByMe, commentsCount,
    big=false }) {
    return (
        <div>
            <div className="flex w-full">
                <Avatar src={author.image} />
                <div className="pl-2 grow mt-3">
                    <div className="">
                        <span className="font-bold pr-1">{author.name}</span>
                        {big && (<br />)}
                        <span className="text-socialLightGrey">@{author.username}</span>
                        {createdAt && !big && (
                            <span className="pl-1 text-socialLightGrey"><ReactTimeAgo date={createdAt} timeStyle={"twitter"}/></span>
                        )}
                    </div>
                </div>
                <br />
            </div>
            {!big && (
                <div className="pl-2">
                    <Link href={`/${author.username}/status/${_id}`}>
                        <div className="mb-4">
                            {text}
                        </div>
                    </Link>
                    <PostButtons id={_id} likesCount={likesCount} likedByMe={likedByMe} commentsCount={commentsCount} />
                </div>
            )}
            {big && (
                <div className="mt-2">
                    <Link href={`/${author.username}/status/${_id}`}>
                        <div className="w-full">
                            {text}
                        </div>
                    </Link>
                    {createdAt && (
                        <div className="my-4 text-socialLightGrey text-sm">
                            {(new Date(createdAt).toISOString().replace(/T/, ' ').slice(0,16)
                            .split(' ').reverse().join(' '))}
                        </div>
                    )}
                    <PostButtons id={_id} likesCount={likesCount} likedByMe={likedByMe} commentsCount={commentsCount} />
                </div>
            )}
        </div>
    )
}