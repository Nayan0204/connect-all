import { IUser } from "@/types/user";
import mongoose, { Schema, Document, Model, models} from "mongoose";
import { IComment, Comment , ICommentBase } from "./comments";

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}

export interface IPost extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}   

interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {} // for single post
export interface IPostModel extends Model<IPostDocument>, IPostStatics {} // for all posts

const PostSchema = new Schema<IPostDocument>({
    user: {
        userid: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String },
        userImage: { type: String, required: true },
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
    likes: [{ type: String }],
}, { timestamps: true
})

PostSchema.methods.likePost = async function(userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId } });
    } catch (error) {
        console.log("Error liking the post: " , error);
    }
}

PostSchema.methods.unlikePost = async function(userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } });
    } catch (error) {
        console.log("Error unliking the post: " , error);
    }
}

PostSchema.methods.removePost = async function() {
    try {
        await this.model("Post").deleteOne({ _id: this._id });
    }   
    catch (error) {
        console.log("Error deleting the post: " , error);
    }
}

PostSchema.methods.commentOnPost = async function(commentToAdd: IComment) {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comments?.push(comment._id);
        await this.save();
    } catch (error) {
        console.log("Error commenting on the post: " , error);
    }
}

PostSchema.methods.getAllComments = async function() {
    try {
        await this.populate({path: "comments" , options: { sort: { createdAt: -1 } }}); // populate comments and sort by createdAt descending
        return this.comments as IComment[];
    } catch (error) {
        console.log("Error fetching comments: " , error);
    }
}

PostSchema.statics.getAllPosts = async function() {
    try {
        const posts = await this.find()
        .sort({ createdAt: -1 })
        .populate({ path: "comments", options: { sort: { createdAt: -1 } } })
        .lean(); 
        return posts.map((post: IPostDocument) => ({ // if error in web then change the IPostDocument to any
            ...post,
            _id: post._id?.toString(),
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                _id: comment._id?.toString(),
            }))
        }))
    } catch (error) {
        console.log("Error fetching posts: " , error);
    }
}

export const Post = models.Post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);


