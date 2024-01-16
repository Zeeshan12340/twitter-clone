import multiparty from 'multiparty'
import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'
import { initDb } from '../../lib/mongoose'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import User from '@/models/User'

export default async function handle(req, res) {
    await initDb()
    const session = await getServerSession(req, res, authOptions)

    const s3Client = new S3({
        region: 'eu-west-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    })

    const form = new multiparty.Form({
        autoFiles: true,
        uploadDir: './public',
    })
    form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        const type = Object.keys(files)[0]
        const fileInfo = files[type][0]
        s3Client.upload({
            Bucket: 'social-clone',
            Body: fs.readFileSync(fileInfo.path),
            ACL: 'public-read',
            Key: fileInfo.path.split("/")[1],
            ContentType: fileInfo.headers['content-type'],
        }, async (err, data) => {
            if ( type === 'cover' || type === 'image' ) {
                await User.findByIdAndUpdate(
                    session.user.id,
                    {[type]: data.Location})
            }
            fs.unlinkSync(fileInfo.path, err => {
                if (err) throw err;
            })
            res.json({err, data, fileInfo, src: data.Location})
        })
    })
}

export const config = {
    api: {
        bodyParser: false,
    },
}