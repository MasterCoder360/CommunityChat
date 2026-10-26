import { Post } from '../types';

interface EventsViewProps {
  posts: Post[];
  onThread: (postId: string) => void;
}

export default function EventsView({ posts, onThread }: EventsViewProps) {
  const eventPosts = posts.filter((p) => p.eventTag && p.author);

  if (eventPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <span className="text-5xl mb-4">📅</span>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No events posted yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
          Post about a community event to see it here!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
        <h2 className="font-bold text-gray-900 dark:text-white text-lg">📅 Community Events</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Auto-imported from community sources + community posts</p>
      </div>

      {/* Sources Info */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Event Sources</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs">
            <span>🏘️</span>
            <span className="text-gray-700 dark:text-gray-300">@Community1stJC</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs">
            <span>🎭</span>
            <span className="text-gray-700 dark:text-gray-300">@JerseyCityCulture</span>
          </span>
        </div>
      </div>

      {/* Events List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {eventPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onThread(post.id)}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                {post.eventDate ? new Date(post.eventDate).getDate() || '?' : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{post.eventTag}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {post.eventDate && <span>📅 {post.eventDate}</span>}
                  {post.eventLocation && <span>· 📍 {post.eventLocation}</span>}
                </div>
                {/* Source badge */}
                {post.sourceHandle && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-xs">{post.sourceAvatar}</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{post.sourceHandle}</span>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>💬 {post.replies.length} replies</span>
                  <span>❤️ {post.likes} likes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
