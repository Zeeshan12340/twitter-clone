import { initDb } from '@/lib/mongoose'
import { getServerSession } from 'next-auth'
import { authOptions } from "./auth/[...nextauth]";
import User from '@/models/User'

export default async function handler(req, res) {
    await initDb()
    const session = await getServerSession(req, res, authOptions)
    const {bio, name, username} = req.body

    await User.findByIdAndUpdate(session.user.id, {
        bio, name, username
    })
    res.json('ok')

}