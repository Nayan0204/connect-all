import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export interface UnlikePostRequestBody {
    userId: string;
}

export async function POST(request: Request, context: { params: Promise<{ post_id: string }> }) {
    const user = await currentUser();
    if(!user){
        throw new Error("User not authenticated");
    }
    await connectDB();
        const {userId}: UnlikePostRequestBody = await request.json();
        const { post_id } = await context.params;

        try {
            const post = await Post.findById(post_id);
            if(!post){
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 }
                )            
            }
            await post.unlikePost(userId);
            return NextResponse.json({ message: "Post unliked successfully" });
        } catch (error) {
            return NextResponse.json(
                { error: "Error unliking the post" },
                { status: 500 }
            )
        }
}