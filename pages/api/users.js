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
        res.json({id, user});
    }
    if (req.method === 'PUT') {
        const username = req.body.username;
        await User.findByIdAndUpdate(session.user.id, {username})
        res.json('ok')
    }
}