import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
    await connectDB();
    const { post_id } = await params;
    try {
        const post = await Post.findById(post_id);
        if(!post){
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )            
        }
        const likes = post.likes;
        return NextResponse.json(likes);

    } catch (error) {
        return NextResponse.json(
            { error: "Error liking the post" },
            { status: 500 }
        )
    }
}

export interface LikePostRequestBody {
    userId: string;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ post_id: string }> }) {
    const user = await currentUser();
    if(!user){
        throw new Error("User not authenticated");
    }
    await connectDB();

        const {userId}: LikePostRequestBody = await request.json();
        const { post_id } = await params;

        try {
            const post = await Post.findById(post_id);
            if(!post){
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 }
                )            
            }
            await post.likePost(userId);
            return NextResponse.json({ message: "Post liked successfully" });
        } catch (error) {
            return NextResponse.json(
                { error: "Error liking the post" },
                { status: 500 }
            )
        }
}