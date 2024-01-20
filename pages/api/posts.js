import { initDb } from "@/lib/mongoose";
import Post from "../../models/Post";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth"
import Like from "../../models/Like";
import User from "@/models/User";

export default async function handler(req, res) {
    await initDb();
    const session = await getServerSession(req, res, authOptions)

    if (req.method === 'GET') {
        const {id} = req.query || null;
        await User.findById(id);

        if (id) {
            res.status(200).json(await Post.findById(id)
            .populate('author')
            .populate({
                path: 'parent',
                populate: 'author'
            })
            .exec());
        } else {
            const parent = req.query.parent || null;
            const author = req.query.author || null;
            const searchFilter = author ? {author} : {parent};

            const posts = await Post.find(searchFilter)
            .populate('author')
            .sort({createdAt: -1})
            .limit(30)
            .exec();

            const postsLikedByMe = await Like.find({ 
                author: session?.user.id,
                post: posts.map(p => p._id)
            })
            const idsLikedByMe = postsLikedByMe.map(like => like.post)
            return res.status(200).json({
                posts,
                idsLikedByMe
            });
        }
    }

    if (req.method === 'POST') {
        const {text, parent, images} = req.body;
        if (!text) return res.status(400).json({message: 'Missing text'});
        const post = await Post.create({author: session.user.id, text, parent, images});
        if (parent) {
            const parentPost = await Post.findById(parent);
            parentPost.commentsCount = await Post.countDocuments({parent});
            await parentPost.save();
        }
        return res.status(200).json(post);
    }
}