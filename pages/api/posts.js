import { initDb } from "@/lib/mongoose";
import Post from "../../models/Post";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth"

export default async function handler(req, res) {
    await initDb();
    const session = await getServerSession(req, res, authOptions)

    if (req.method === 'GET') {
        const posts = await Post.find()
        .populate('author')
        .sort({createdAt: -1})
        .exec();
        return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
        const {text} = req.body;
        if (!text) return res.status(400).json({message: 'Missing text'});
        const post = await Post.create({author: session.user.id, text});
        return res.status(200).json(post);
    }
}