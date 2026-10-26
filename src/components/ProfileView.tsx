import { Post } from '../types';
import { BlueskySession } from '../bluesky';

interface ProfileViewProps {
  posts: Post[];
  session?: BlueskySession | null;
}

export default function ProfileView({ posts, session }: ProfileViewProps) {
  const userPosts = session
    ? posts.filter((p) => p.author?.id === session.did)
    : posts.filter((p) => p.author?.id === 'user-1');

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
        <h2 className="font-bold text-gray-900 dark:text-white text-lg">Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {session?.avatar ? (
            <img
              src={session.avatar}
              alt=""
              className="w-16 h-16 rounded-full shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
              {session ? '🦋' : '🧑‍💻'}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {session ? session.displayName : 'You'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {session ? `@${session.handle}` : '@you.cosmospark'}
            </p>
            {session && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1">
                <span>✓</span> Connected via Bluesky
              </p>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          {session
            ? 'Community member posting via the AT Protocol. Your posts are public and visible on Bluesky.'
            : 'Community member in Jersey City. Interested in local events and making connections. 🏙️'}
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">{userPosts.length}</span> posts
          </span>
        </div>
      </div>

      {/* Posts */}
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div key={post.id} className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-800 dark:text-gray-200">{post.content}</p>
            {post.eventTag && (
              <div className="mt-2 text-xs text-blue-500">📌 {post.eventTag}</div>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <span className="text-5xl mb-4">📝</span>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
            {session
              ? 'Start sharing with the community! Your posts will be visible on Bluesky.'
              : 'Sign in with Bluesky to start posting publicly!'}
          </p>
        </div>
      )}
    </div>
  );
}
