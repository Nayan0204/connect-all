import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
    user : IUser;
    text: string;
    imageUrl?: string | null;
}
export async function POST(request: Request) {
          const use = await currentUser();
          if(!use){
            throw new Error("User not authenticated");
          }

          try {
            await connectDB();
            const {user , text, imageUrl} : AddPostRequestBody = await request.json();
           const postData: IPostBase = {
            user,
            text,
            ...(imageUrl && { imageUrl } )
           }
           const post = await Post.create(postData);
           return NextResponse.json({ message: "Post created sucessfully" , post})

          } catch (error) {
            return NextResponse.json(
                {error: `Error creating a post: ${error}` },
                { status: 500 }
            )
          }
}

export async function GET(request: Request) {
    try {
        await connectDB();

         const posts = await Post.getAllPosts();
         return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json(
            {error: "Error fetching posts" },
            { status: 500 }
        )
    }
}