import { IUser } from "@/types/user";
import mongoose, { Schema, Document, Model, models} from "mongoose";

export interface ICommentBase {
    user: IUser;
    text: string;
}

export interface IComment extends ICommentBase, Document {
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    user: {
        userid: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String },
        userImage: { type: String, required: true },
    },
    text: { type: String, required: true },
}, { timestamps: true
})

export const Comment = models.Comment || mongoose.model<IComment>("Comment", commentSchema);
