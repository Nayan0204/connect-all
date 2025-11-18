"use server"

import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
    const user = await currentUser();

    if(!user?.id){
          throw new Error("User is not Authenticated")
    }
    const post  = await Post.findById(postId);

   if(!post){
    throw new Error("Post not found")
   }
   if(post.user.userid !== user.id){
       throw new Error("Post does not belong to the user")
   }

   try {
      await post.removePost();
      revalidatePath("/")
   } catch (error) {
     throw new Error("error occured")
   }
    
}