import { initDb } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import Follow from "@/models/Follow";

export default async function handle(req, res) {
    await initDb()
    const { source, destination } = req.body

    if (req.method === 'POST') {
        const follow = await Follow.findOne({ source, destination })
        if (follow) {
            await Follow.findOneAndDelete({ source, destination })
        } else {
            await Follow.create({ source, destination })
        }
        res.json({ isFollowing: !!follow })
    }
}