import { IPostDocument, IPostModel } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import TimeAgo from "react-timeago";
import { Badge } from "./ui/badge";

export default function CommentFeed({post}: { post: IPostDocument}) {
    const {user} = useUser();
    const isAuthor = user?.id === post.user.userid;

    return (
        <div className="space-y-2 mt-3">
            {post.comments?.map((comment) => (
                <div key={comment._id as string} className="flex space-x-2">
                    <Avatar>
                        <AvatarImage src={comment.user.userImage}/>
                        <AvatarFallback>
                            {comment.user.firstName?.charAt(0)}
                            {comment.user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold">
                                    {comment.user.firstName} {comment.user.lastName}
                                     {isAuthor && (
                            <Badge className="h-4" variant="secondary">
                                *
                            </Badge>
                        )}
                                </p>
                                <p className="text-xs text-gray-400">
                                    @{comment.user.firstName}
                                    {comment.user.lastName}-
                                    {comment.user.userid.toString().slice(-4)}
                                </p>
                            </div>
                            <p className="text-xs text-gray-400">
                                <TimeAgo date ={new Date(comment.createdAt)} />
                            </p>
                        </div>

                        <p className="mt-3 text-sm">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}