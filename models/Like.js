import mongoose, { models, model, Schema } from 'mongoose';

const LikeSchema = new Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
}, { timestamps: true });

const Like = models?.Like || model('Like', LikeSchema);
export default Like;