import mongoose, {model, models, Schema} from 'mongoose';

const PostSchema = new Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: String,
    likesCount: {type: Number, default:0},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    commentsCount: {type: Number, default:0},
    images: {type: [String], default: []},
}, {
    timestamps: true,
});

const Post = models?.Post || model('Post', PostSchema);
export default Post;