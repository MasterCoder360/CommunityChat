import { Post } from '../types';
import PostCard from './PostCard';

interface ThreadViewProps {
  post: Post;
  onBack: () => void;
  onReply: (postId: string) => void;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onComposeReply: () => void;
}

export default function ThreadView({ post, onBack, onReply, onLike, onRepost, onComposeReply }: ThreadViewProps) {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ←
        </button>
        <h2 className="font-bold text-gray-900 dark:text-white">Thread</h2>
      </div>

      {/* Original Post */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-2xl">
            {post.author.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{post.author.displayName}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{post.author.handle}</span>
            </div>
            <p className="mt-2 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Event Tag */}
            {post.eventTag && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  📌 Event
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{post.eventTag}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {post.eventDate && <span>📅 {post.eventDate}</span>}
                  {post.eventLocation && <span>📍 {post.eventLocation}</span>}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {post.createdAt.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              {post.reposts > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">{post.reposts}</span> reposts
                </span>
              )}
              {post.likes > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">{post.likes}</span> likes
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-3 -ml-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => onComposeReply()}
                className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors group"
              >
                <span className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  💬
                </span>
              </button>
              <button
                onClick={() => onRepost(post.id)}
                className={`flex items-center gap-1.5 transition-colors group ${
                  post.reposted ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                }`}
              >
                <span className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors">
                  🔄
                </span>
              </button>
              <button
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors group ${
                  post.liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                }`}
              >
                <span className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30 transition-colors">
                  {post.liked ? '❤️' : '🤍'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div>
        {post.replies.length > 0 ? (
          post.replies.map((reply) => (
            <PostCard
              key={reply.id}
              post={reply}
              onReply={onReply}
              onLike={onLike}
              onRepost={onRepost}
              onThread={() => {}}
              isThread
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <span className="text-3xl mb-2">💭</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">No replies yet. Be the first to respond!</p>
          </div>
        )}
      </div>
    </div>
  );
}
