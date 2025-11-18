'use client';

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";

export default function PostForm() {
    const ref = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {user} = useUser();
    const [preview, setPreview] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePostAction = async (formData: FormData) => {
        const formDataCopy = formData;
        ref.current?.reset();

        const text = formDataCopy.get("postInput") as string;
        setPreview(null);
        if (!text.trim()){
            throw new Error("Post cannot be empty");
        }

        try {
            await createPostAction(formDataCopy);
        } catch (error){
            console.log("Error creating a post :" , error)
        }
    }   

    return (
        <div className="mb-2">
            <form ref={ref} action={(formData) => {
                
                const promise = handlePostAction(formData);
                toast.promise(promise, {
                    loading: "Creating post...",
                    success: "Post created",
                    error: "failed to create post",
                })
                
                }} className="bg-white p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={user?.imageUrl}/>
                        <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <input
                    
                     type="text"
                     name="postInput"
                     placeholder="Start writing a post..."
                     className="flex-1 outline-none rounded-full py-3 px-4 border"
                    />

                    <input ref={fileInputRef}
                     type="file" name="image" accept="image/*" hidden
                     onChange={handleImageChange}
                    />
                    <button type="submit" className="bg-[#d9d5d5] rounded w-13 h-8 ">
                        Post
                    </button>
                </div>

                {preview && (
                    <div className="mt-3">
                        <img src={preview} alt="Preview" className="w-full object-cover" />
                    </div>
                )}
                
                <div className="flex justify-end mt-2 space-x-2">
                    <Button type="button" variant={preview ? "secondary" : "outline"} onClick={()=> fileInputRef.current?.click()}>
                        <ImageIcon className="mr-2" size={16} color="currentColor"/>
                        {preview ? "Change Image" : "Add Image"}
                    </Button>

                    {preview && (
                        <Button variant="outline" type="button" onClick={() => setPreview(null)}>
                            <XIcon className="mr-2" size={16} color="currentColor" />
                            Remove Image
                        </Button>
                    )}  

                </div>
            </form>
            <hr className="mt-2 border-gray-300"/>
        </div>
    );
}