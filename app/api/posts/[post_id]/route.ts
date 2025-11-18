import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { post_id: string }}) {
      await connectDB();

      try {
        const post = await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )            
        }
        return NextResponse.json({ post });

      } catch (error) {
        return NextResponse.json(
            { error: "Error fetching the post" },
            { status: 500 }
        )
      }
}

export interface DeletePostRequestBody {
    userId: string;
}

export async function DELETE(request: Request, { params }: { params: { post_id: string }}) {
    const user = await currentUser();
    if(!user){
        throw new Error("User not authenticated");
    }
    await connectDB();

     const {userId}: DeletePostRequestBody = await request.json();

    try {
        const post = await Post.findById(params.post_id);
        if(!post){
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )            
        }

        if(post.user.userid !== userId){
            throw new Error("You are not authorized to delete this post");
        }

        await post.removePost();
        
    } catch (error) {
        return NextResponse.json(
            { error: "Error deleting the post" },
            { status: 500 }
        )
    }
}