import initDb from '../../lib/mongoose';
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth"
import Like from "../../models/Like";
import Post from '@/models/Post';

async function updateLikesCount(postId) {
    const post = await Post.findById(postId)
    post.likesCount = await Like.countDocuments({post:postId})
    await post.save()
}

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (req.method === 'GET') {
        res.json("nice")
    }

    if (req.method === 'POST') {
        const postId = req.body.id
        const userId = session.user.id
        const existingLike = await Like.findOne({author:userId, post:postId})
        if (existingLike) {
            await Like.findOneAndDelete({author:userId, post:postId})
            await updateLikesCount(postId)
            res.json({isLiked:false})
        } else {
            const like = await Like.create({author:userId, post:postId})
            await updateLikesCount(postId)
            res.json({isLiked:true, like})
        }
    }
}