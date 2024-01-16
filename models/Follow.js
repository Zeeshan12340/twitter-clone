import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    source: { type: mongoose.Types.ObjectId, required:true },
    destination: { type: mongoose.Types.ObjectId, required:true },
})

const Follow = mongoose.models?.Follow || mongoose.model('Follow', FollowSchema)

export default Follow