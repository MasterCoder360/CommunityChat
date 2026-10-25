import { Post } from '../types';

interface EventsViewProps {
  posts: Post[];
  onThread: (postId: string) => void;
}

export default function EventsView({ posts, onThread }: EventsViewProps) {
  const eventPosts = posts.filter((p) => p.eventTag);

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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Events shared by the community</p>
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
                <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>💬 {post.replies.length} replies</span>
                  <span>❤️ {post.likes} likes</span>
                  <span>by {post.author.displayName}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
