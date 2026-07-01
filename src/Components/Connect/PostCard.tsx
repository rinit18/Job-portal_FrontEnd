import { Avatar, ActionIcon, Divider, TextInput, Button } from "@mantine/core";
import { IconHeart, IconMessageCircle, IconShare, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { likePost, addComment } from "../../Services/PostService";
// Removed date-fns import

const PostCard = ({ post, onPostUpdate }: any) => {
    const user = useSelector((state: any) => state.user);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);

    const isLiked = post.likedBy?.includes(user.profileId);

    const handleLike = async () => {
        setIsLiking(true);
        try {
            const updatedPost = await likePost(post.id, user.profileId);
            onPostUpdate(updatedPost);
        } catch (error) {
            console.error("Failed to like post", error);
        }
        setIsLiking(false);
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        setIsCommenting(true);
        try {
            const updatedPost = await addComment(post.id, { profileId: user.profileId, content: commentText });
            onPostUpdate(updatedPost);
            setCommentText("");
        } catch (error) {
            console.error("Failed to add comment", error);
        }
        setIsCommenting(false);
    };

    return (
        <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl border border-mine-shaft-800/50 p-5 mb-5 shadow-md hover:border-mine-shaft-700/50 transition-colors">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <Avatar src={post.profile?.picture ? `data:image/jpeg;base64,${post.profile.picture}` : ""} radius="xl" />
                <div>
                    <div className="font-semibold text-mine-shaft-100">{post.profile?.name}</div>
                    <div className="text-xs text-mine-shaft-400">
                        {post.profile?.jobTitle} • {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="text-mine-shaft-200 mb-4 whitespace-pre-wrap leading-relaxed">
                {post.content}
            </div>
            
            {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-mine-shaft-800/60 shadow-sm">
                    <img src={post.image} alt="Post attachment" className="w-full h-auto object-cover" />
                </div>
            )}

            {/* Stats */}
            <div className="flex justify-between text-xs font-medium text-mine-shaft-400 mb-3 px-1">
                <div className="flex items-center gap-1.5"><IconHeart size={14} className="text-bright-sun-400/80" /> {post.likedBy?.length || 0} Likes</div>
                <div className="flex items-center gap-1.5">{post.comments?.length || 0} Comments</div>
            </div>

            <Divider className="border-mine-shaft-800/60 mb-3" />

            {/* Actions */}
            <div className="flex justify-between gap-2">
                <Button 
                    variant="subtle" 
                    color={isLiked ? "brightSun.4" : "gray"} 
                    leftSection={<IconHeart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : ""} />} 
                    className={`flex-1 rounded-xl transition-all ${isLiked ? 'bg-bright-sun-400/10 hover:bg-bright-sun-400/20' : 'hover:bg-mine-shaft-800/60'}`}
                    onClick={handleLike}
                    loading={isLiking}
                >
                    Like
                </Button>
                <Button 
                    variant="subtle" 
                    color={showComments ? "brightSun.4" : "gray"} 
                    leftSection={<IconMessageCircle size={20} />} 
                    className={`flex-1 rounded-xl transition-all ${showComments ? 'bg-bright-sun-400/10 hover:bg-bright-sun-400/20' : 'hover:bg-mine-shaft-800/60'}`}
                    onClick={() => setShowComments(!showComments)}
                >
                    Comment
                </Button>
                <Button 
                    variant="subtle" 
                    color="gray" 
                    leftSection={<IconShare size={20} />} 
                    className="flex-1 rounded-xl hover:bg-mine-shaft-800/60 transition-all"
                >
                    Share
                </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-5 flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex gap-3 items-start">
                        <Avatar src={user?.picture ? `data:image/jpeg;base64,${user.picture}` : ""} radius="xl" size="md" className="border border-mine-shaft-800 shadow-sm" />
                        <div className="flex-1 flex gap-2">
                            <TextInput 
                                placeholder="Write a comment..." 
                                className="flex-1" 
                                classNames={{ input: "bg-mine-shaft-950/50 border-mine-shaft-800/80 focus:border-bright-sun-400/50 rounded-xl" }}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                            />
                            <ActionIcon variant="light" color="brightSun.4" size="lg" radius="xl" onClick={handleComment} loading={isCommenting} className="shadow-sm">
                                <IconSend size={18} />
                            </ActionIcon>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-2 pl-2 border-l-2 border-mine-shaft-800/40 ml-5">
                        {post.comments?.map((comment: any, index: number) => (
                            <div key={index} className="flex gap-3 items-start relative before:absolute before:w-4 before:h-[2px] before:bg-mine-shaft-800/40 before:top-4 before:-left-2">
                                <Avatar src={comment.profile?.picture ? `data:image/jpeg;base64,${comment.profile.picture}` : ""} radius="xl" size="sm" className="border border-mine-shaft-800 shrink-0 z-10" />
                                <div className="bg-mine-shaft-950/40 border border-mine-shaft-800/50 p-3.5 rounded-2xl rounded-tl-sm flex-1">
                                    <div className="font-semibold text-sm text-mine-shaft-100">{comment.profile?.name}</div>
                                    <div className="text-xs text-mine-shaft-400 mb-2 font-medium">{comment.profile?.jobTitle}</div>
                                    <div className="text-sm text-mine-shaft-200 leading-relaxed">{comment.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostCard;
