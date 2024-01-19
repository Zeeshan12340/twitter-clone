import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Link from 'next/link'
import PostButtons from "./PostButtons";
import Image from "next/image";

export default function PostContent({ 
    author, text, createdAt,
    _id, likesCount, likedByMe, commentsCount, images,
    big=false }) {

    function showImages() {
        if (!images.length) {
            return ''
        }
        return (
            <div className="flex -mx-1">
                {images && images.length > 0 && images.map(image => (
                    <div key={image} className="m-1">
                        <Image width={300} height={300} src={image} alt='' />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            <div className="flex w-full">
                <Link href={'/' + author.username}>
                    <div className="cursor-pointer">
                        <Avatar src={author.image} />
                    </div>
                </Link>
                <div className="pl-2 grow mt-3">
                    <div className="">
                        <Link href={'/' + author.username}>
                            <span className="font-bold pr-1">{author.name}</span>
                            {big && (<br />)}
                            <span className="text-socialLightGrey">@{author.username}</span>
                            {createdAt && !big && (
                                <span className="pl-1 text-socialLightGrey">
                                    <ReactTimeAgo date={new Date(createdAt)} timeStyle={"twitter"} />
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
                <br />
            </div>
            {!big && (
                <div className="pl-2">
                    <Link href={`/${author.username}/status/${_id}`}>
                        <div className="mb-4">
                            {text}
                            {showImages()}
                        </div>
                    </Link>
                    <PostButtons username={author.username} id={_id} likesCount={likesCount} likedByMe={likedByMe} commentsCount={commentsCount} />
                </div>
            )}
            {big && (
                <div className="mt-2">
                    <Link href={`/${author.username}/status/${_id}`}>
                        <div className="w-full">
                            {text}
                            {showImages()}
                        </div>
                    </Link>
                    {createdAt && (
                        <div className="my-4 text-socialLightGrey text-sm">
                            {(new Date(createdAt).toISOString().replace(/T/, ' ').slice(0,16)
                            .split(' ').reverse().join(' '))}
                        </div>
                    )}
                    <PostButtons username={author.username} id={_id} likesCount={likesCount} likedByMe={likedByMe} commentsCount={commentsCount} />
                </div>
            )}
        </div>
    )
}