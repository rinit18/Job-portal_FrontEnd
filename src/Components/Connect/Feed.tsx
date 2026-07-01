import { Avatar, Button, Textarea, ActionIcon, Skeleton } from "@mantine/core";
import { IconPhoto, IconSend } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createPost, getAllPosts } from "../../Services/PostService";
import PostCard from "./PostCard";
import { getBase64 } from "../../Services/Utilities";
import { errorNotification, successNotification } from "../../Services/NotificationService";

const Feed = () => {
    const profile = useSelector((state: any) => state.profile);
    
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("Recent"); // "Recent" or "Top"
    
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchPosts = async () => {
            if (!profile?.id) return;
            if (isMounted) setLoading(true);
            try {
                const res = await getAllPosts(profile.id, sort);
                if (isMounted) setPosts(res);
            } catch (error) {
                console.error("Error fetching posts", error);
            }
            if (isMounted) setLoading(false);
        }
        fetchPosts();
        return () => { isMounted = false; };
    }, [sort, profile?.id]);

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await getBase64(file);
            setImage(base64 as string);
        }
    };

    const handleCreatePost = async () => {
        if (!content.trim() && !image) return;
        setIsPosting(true);
        try {
            const newPost = await createPost({
                profileId: profile.id,
                content: content,
                image: image
            });
            setPosts([newPost, ...posts]);
            setContent("");
            setImage(null);
            successNotification("Post Created", "Your post is now live!");
        } catch (error) {
            console.error("Error creating post", error);
            errorNotification("Error", "Could not create post.");
        }
        setIsPosting(false);
    };

    const handlePostUpdate = (updatedPost: any) => {
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Create Post Box */}
            <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl border border-mine-shaft-800/50 p-5 shadow-lg">
                <div className="flex gap-3 items-start">
                    <Avatar src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : ""} radius="xl" />
                    <div className="flex-1 flex flex-col gap-3">
                        <Textarea 
                            placeholder="Share your thoughts..." 
                            minRows={2} 
                            autosize 
                            variant="unstyled"
                            className="w-full bg-mine-shaft-950/30 rounded-xl px-4 py-2 border border-mine-shaft-800/50 focus-within:border-bright-sun-400/30 transition-colors"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        {image && (
                            <div className="relative rounded-lg overflow-hidden border border-mine-shaft-800">
                                <img src={image} alt="Upload preview" className="w-full max-h-64 object-cover" />
                                <ActionIcon 
                                    className="absolute top-2 right-2" 
                                    color="red" 
                                    variant="filled" 
                                    onClick={() => setImage(null)}
                                >
                                    ✕
                                </ActionIcon>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-1">
                            <label className="cursor-pointer text-mine-shaft-300 hover:text-bright-sun-400 hover:bg-bright-sun-400/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                                <IconPhoto size={20} />
                                <span className="text-sm font-medium">Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                            <Button 
                                color="brightSun.4" 
                                radius="xl" 
                                rightSection={<IconSend size={16}/>}
                                onClick={handleCreatePost}
                                loading={isPosting}
                                disabled={!content.trim() && !image}
                                className="shadow-md"
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
                <div className="h-[1px] flex-1 bg-mine-shaft-800/60"></div>
                <div className="text-xs font-medium text-mine-shaft-400 flex items-center gap-2">
                    Sort by: 
                    <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)} 
                        className="bg-mine-shaft-900/60 backdrop-blur-md border border-mine-shaft-800/80 rounded-lg px-3 py-1 text-mine-shaft-100 outline-none focus:border-bright-sun-400 cursor-pointer shadow-sm hover:border-mine-shaft-700 transition-colors"
                    >
                        <option value="Recent">Recent</option>
                        <option value="Top">Top</option>
                    </select>
                </div>
            </div>

            {/* Feed Stream */}
            <div className="flex flex-col gap-0">
                {loading ? (
                    Array(3).fill(0).map((_, i) => <Skeleton key={i} height={200} mb="md" radius="xl" />)
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
                    ))
                ) : (
                    <div className="text-center p-10 text-mine-shaft-400">
                        No posts to display. Be the first to post!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Feed;
