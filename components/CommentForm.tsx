"use client"

import { useUser } from "@clerk/nextjs"
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

export default function CommentForm({ postId }: { postId: string }) {
    const { user } = useUser();
    const ref = useRef<HTMLFormElement>(null);
    const createCommentActionID = createCommentAction.bind(null, postId);

    const handleCommentAction = async (formData: FormData): Promise<void> => {
        if (!user?.id) {
            throw new Error("user not authenticated")
        }
        const formDataCopy = formData;
        ref.current?.reset();

        try {
            await createCommentActionID(formDataCopy)
        } catch (error) {
            console.error(`Error creating comment: ${error}`)
        }
    }

    return <form ref={ref} action={(formData) => {
         const promise = handleCommentAction(formData) 
          toast.promise(promise, {
                    loading: "Creating comment...",
                    success: "Comment created",
                    error: "failed to create comment",
                })
         }} className="flex items-center space-x-1">
        <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
            <input
                type="text"
                name="commentInput"
                placeholder="Add a comment..."
                className="outline-none flex-1 text-sm bg-transparent"
            />
            <button type="submit" className="bg-[#c5bfbf] w-15 rounded">
                Post
            </button>
        </div>

    </form>
}