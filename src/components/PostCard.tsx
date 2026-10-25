import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onReply: (postId: string) => void;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onThread: (postId: string) => void;
  isThread?: boolean;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post, onReply, onLike, onRepost, onThread, isThread = false }: PostCardProps) {
  return (
    <article
      className={`border-b border-gray-200 dark:border-gray-700 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
        isThread ? '' : ''
      }`}
      onClick={() => !isThread && onThread(post.id)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-xl">
          {post.author.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {post.author.displayName}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.author.handle}
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500">·</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {formatTime(post.createdAt)}
            </span>
          </div>

          {/* Post Content */}
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Event Tag */}
          {post.eventTag && (
            <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  📌 Event
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{post.eventTag}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {post.eventDate && <span>📅 {post.eventDate}</span>}
                {post.eventLocation && <span>📍 {post.eventLocation}</span>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 mt-3 -ml-2">
            {/* Reply */}
            <button
              onClick={(e) => { e.stopPropagation(); onReply(post.id); }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors group"
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                💬
              </span>
              <span className="text-xs">{post.replies.length > 0 ? post.replies.length : ''}</span>
            </button>

            {/* Repost */}
            <button
              onClick={(e) => { e.stopPropagation(); onRepost(post.id); }}
              className={`flex items-center gap-1.5 transition-colors group ${
                post.reposted ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
              }`}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors">
                🔄
              </span>
              <span className="text-xs">{post.reposts > 0 ? post.reposts : ''}</span>
            </button>

            {/* Like */}
            <button
              onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
              className={`flex items-center gap-1.5 transition-colors group ${
                post.liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
              }`}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30 transition-colors">
                {post.liked ? '❤️' : '🤍'}
              </span>
              <span className="text-xs">{post.likes > 0 ? post.likes : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
