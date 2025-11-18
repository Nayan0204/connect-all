'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
     const user = await currentUser();
    if(!user){
        throw new Error("User not authenticated");
    }
    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imageUrl: string | undefined;

    if(!postInput){
        throw new Error("Post cannot be empty");
    }

    const userDB: IUser = {
        userid: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userImage: user.imageUrl ,
    }

    try {
          if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());

            imageUrl = await new Promise<string>((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream(
                    { folder: "posts" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result!.secure_url);
                    }
                );
                upload.end(buffer); 
            });
            console.log("Image uploaded to Cloudinary: ", imageUrl);
        }
          
    
        const body: AddPostRequestBody = {
            user: userDB,
            text: postInput,
            ...(imageUrl ? { imageUrl } : {}),
        };
            await Post.create(body);
       
    } catch (error) {
        console.log("Error creating a post: ", error);
    }

    revalidatePath('/')
}