import { Post } from '../types';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  onReply: (postId: string) => void;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onThread: (postId: string) => void;
}

export default function Feed({ posts, onReply, onLike, onRepost, onThread }: FeedProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <span className="text-5xl mb-4">🌱</span>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No conversations yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
          Be the first to start a discussion about a community event!
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onReply={onReply}
          onLike={onLike}
          onRepost={onRepost}
          onThread={onThread}
        />
      ))}
    </div>
  );
}
