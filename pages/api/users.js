import Follow from "@/models/Follow";
import { initDb } from "../../lib/mongoose";
import User from "../../models/User";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth"

export default async function Users(req, res) {
    await initDb();
    const session = await getServerSession(req, res, authOptions)

    if (req.method === 'GET') {
        const {id, username} = req.query;
        const user = id ?
        await User.findById(id):
        await User.findOne({username});

        const follow = await Follow.findOne({source: session?.user.id, destination: user._id})
        res.json({id, user, follow});
    }
    if (req.method === 'PUT') {
        const username = req.body.username;
        // check if username already exists
        await User.findOne({username})
            .then(user => {
                if (user) {
                    res.status(400).json({error: 'Username already exists'})
                }
            })
        // else update username
        await User.findByIdAndUpdate(session.user.id, {username})
        res.json('ok')
    }
}