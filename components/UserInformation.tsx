import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IPostDocument } from "@/mongodb/models/post";

export default async function UserInformation({posts}: {posts: IPostDocument[]}) {
    const user = await currentUser();

    const userPosts = posts.filter((post) => post.user.userid === user?.id);

    const userComments = posts.flatMap((post) => post?.comments?.filter((comment) => comment.user.userid === user?.id))

    return ( <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4 ">
        <Avatar>
            {user?.id ? (<AvatarImage src={user?.imageUrl} />)
              
              : (<AvatarImage src="https://github.com/shadcn.png"/>)
        }
            
            <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
        </Avatar>

        <SignedIn>
            <div className="text-center">
                <p className="font-semibold">
                    {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs">
                    @{user?.firstName}{user?.lastName}-{user?.id?.slice(-4)}
                </p>
            </div>
        </SignedIn>

        <SignedOut>
            <div className="text-center space-y-2">
                <p className="font-semibold">You are not signed in</p>
                <Button asChild className="bg-[#0B63C4] text-white">
                    <SignInButton />
                </Button>
            </div>
        </SignedOut>

        <SignedIn>
        <hr className="w-full border-gray-200 my-5"/>
        <div className="flex justify-between w-full px-4 text-sm">
            <p className="font-semibold text-gray-400">Posts</p>
            <p className="text-blue-400">{userPosts.length}</p>
        </div>
        <div className="flex justify-between w-full px-4 text-sm">
            <p className="font-semibold text-gray-400">Comments</p>
            <p className="text-blue-400">{userComments.length}</p>
        </div>
        </SignedIn>
    </div>);
}