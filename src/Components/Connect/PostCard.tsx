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
        <div className="bg-mine-shaft-900 rounded-xl border border-mine-shaft-800 p-4 mb-4">
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
            <div className="text-mine-shaft-200 mb-3 whitespace-pre-wrap">
                {post.content}
            </div>
            
            {post.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-mine-shaft-800">
                    <img src={post.image} alt="Post attachment" className="w-full h-auto" />
                </div>
            )}

            {/* Stats */}
            <div className="flex justify-between text-xs text-mine-shaft-400 mb-2">
                <div>{post.likedBy?.length || 0} Likes</div>
                <div>{post.comments?.length || 0} Comments</div>
            </div>

            <Divider className="border-mine-shaft-800 mb-2" />

            {/* Actions */}
            <div className="flex justify-between">
                <Button 
                    variant="subtle" 
                    color={isLiked ? "brightSun.4" : "gray"} 
                    leftSection={<IconHeart size={20} fill={isLiked ? "currentColor" : "none"} />} 
                    className="flex-1 rounded-lg"
                    onClick={handleLike}
                    loading={isLiking}
                >
                    Like
                </Button>
                <Button 
                    variant="subtle" 
                    color="gray" 
                    leftSection={<IconMessageCircle size={20} />} 
                    className="flex-1 rounded-lg"
                    onClick={() => setShowComments(!showComments)}
                >
                    Comment
                </Button>
                <Button 
                    variant="subtle" 
                    color="gray" 
                    leftSection={<IconShare size={20} />} 
                    className="flex-1 rounded-lg"
                >
                    Share
                </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 flex flex-col gap-3">
                    <div className="flex gap-2 items-start">
                        <Avatar src={""} radius="xl" size="sm" />
                        <div className="flex-1 flex gap-2">
                            <TextInput 
                                placeholder="Add a comment..." 
                                className="flex-1" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                            />
                            <ActionIcon variant="filled" color="brightSun.4" size="lg" onClick={handleComment} loading={isCommenting}>
                                <IconSend size={18} />
                            </ActionIcon>
                        </div>
                    </div>
                    
                    {post.comments?.map((comment: any, index: number) => (
                        <div key={index} className="flex gap-2 items-start mt-2">
                            <Avatar src={comment.profile?.picture ? `data:image/jpeg;base64,${comment.profile.picture}` : ""} radius="xl" size="sm" />
                            <div className="bg-mine-shaft-800 p-3 rounded-lg flex-1">
                                <div className="font-medium text-sm">{comment.profile?.name}</div>
                                <div className="text-xs text-mine-shaft-400 mb-1">{comment.profile?.jobTitle}</div>
                                <div className="text-sm text-mine-shaft-200">{comment.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostCard;
