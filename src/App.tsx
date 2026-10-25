import { useState, useCallback, useEffect } from 'react';
import { Post, ViewType } from './types';
import { initialPosts, currentUser } from './data';
import * as bsky from './bluesky';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import ThreadView from './components/ThreadView';
import ComposeModal from './components/ComposeModal';
import EventsView from './components/EventsView';
import ProfileView from './components/ProfileView';
import MobileNav from './components/MobileNav';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<Post | null>(null);
  const [feedTab, setFeedTab] = useState<'all' | 'events' | 'discussions'>('all');
  
  // Auth state
  const [session, setSession] = useState<bsky.BlueskySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string>();
  const [isGuest, setIsGuest] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Try to restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const restored = await bsky.restoreSession();
        if (restored) {
          setSession(restored);
          // Load community posts from Bluesky
          await loadCommunityPosts();
        } else {
          // No session, show initial posts for demo
          setPosts(initialPosts);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        setPosts(initialPosts);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Load community posts from Bluesky
  const loadCommunityPosts = async () => {
    try {
      // Fetch both community posts and user's own posts
      const [communityResult, userResult] = await Promise.all([
        bsky.searchCommunityPosts(),
        session ? bsky.getUserPosts(session.did) : Promise.resolve({ posts: [] })
      ]);

      // Combine and deduplicate posts
      const allPosts = [...communityResult.posts, ...userResult.posts];
      const uniquePosts = new Map();
      allPosts.forEach(p => uniquePosts.set(p.uri, p));

      if (uniquePosts.size > 0) {
        const mappedPosts: Post[] = Array.from(uniquePosts.values()).map((p) => ({
          id: p.uri,
          author: {
            id: p.author.did,
            displayName: p.author.displayName,
            handle: `@${p.author.handle}`,
            avatar: p.author.avatar || '🦋',
          },
          content: p.record.text,
          createdAt: new Date(p.record.createdAt || p.indexedAt),
          replies: [],
          likes: p.likeCount,
          reposts: p.repostCount,
          liked: !!p.viewer?.like,
          reposted: !!p.viewer?.repost,
        }));
        
        // Sort by date (newest first)
        mappedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setPosts((prev) => [...mappedPosts, ...prev.filter(p => !p.id.startsWith('at://'))]);
      }
    } catch (err) {
      console.error('Failed to load community posts:', err);
    }
  };

  const handleLogin = async (handle: string, password: string) => {
    setLoginError(undefined);
    setIsLoading(true);
    try {
      const newSession = await bsky.login(handle, password);
      setSession(newSession);
      setIsGuest(false);
      await loadCommunityPosts();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Check your handle and app password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setIsGuest(true);
    setPosts(initialPosts);
    setIsLoading(false);
  };

  const handleLogout = useCallback(() => {
    bsky.logout();
    setSession(null);
    setIsGuest(false);
    setPosts([]);
  }, []);

  const handleLike = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        const updatedReplies = post.replies.map((reply) => {
          if (reply.id === postId) {
            return {
              ...reply,
              liked: !reply.liked,
              likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
            };
          }
          return reply;
        });
        return { ...post, replies: updatedReplies };
      })
    );

    // If logged in with Bluesky, sync the like
    if (session && postId.startsWith('at://')) {
      try {
        const post = posts.find((p) => p.id === postId);
        if (post) {
          if (post.liked) {
            // Already liked, need to unlike - but we need the like URI
            // For now, just do a new like (simplified)
          } else {
            await bsky.likePost(postId, postId); // simplified
          }
        }
      } catch (err) {
        console.error('Failed to like post:', err);
      }
    }
  }, [session, posts]);

  const handleRepost = useCallback(async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reposted: !post.reposted,
            reposts: post.reposted ? post.reposts - 1 : post.reposts + 1,
          };
        }
        const updatedReplies = post.replies.map((reply) => {
          if (reply.id === postId) {
            return {
              ...reply,
              reposted: !reply.reposted,
              reposts: reply.reposted ? reply.reposts - 1 : reply.reposts + 1,
            };
          }
          return reply;
        });
        return { ...post, replies: updatedReplies };
      })
    );

    if (session && postId.startsWith('at://')) {
      try {
        await bsky.repostPost(postId, postId);
      } catch (err) {
        console.error('Failed to repost:', err);
      }
    }
  }, [session]);

  const handleReply = useCallback((postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setReplyTo(post);
      setComposeOpen(true);
      return;
    }
    for (const p of posts) {
      const reply = p.replies.find((r) => r.id === postId);
      if (reply) {
        setReplyTo(reply);
        setComposeOpen(true);
        return;
      }
    }
  }, [posts]);

  const handleCompose = useCallback(
    async (content: string, eventTag?: string, eventDate?: string, eventLocation?: string, eventLink?: string) => {
      let fullContent = content;
      
      // Add event info to content if provided
      if (eventTag) {
        fullContent += `\n\n📌 Event: ${eventTag}`;
        if (eventDate) fullContent += `\n📅 ${eventDate}`;
        if (eventLocation) fullContent += `\n📍 ${eventLocation}`;
        if (eventLink) fullContent += `\n🔗 ${eventLink}`;
      }

      // If logged in with Bluesky, post to the network
      if (session) {
        setIsPosting(true);
        let postUri = '';
        
        try {
          if (replyTo && replyTo.id.startsWith('at://')) {
            postUri = await bsky.createReply(fullContent, replyTo.id, replyTo.id, [bsky.COMMUNITY_TAG]);
          } else {
            postUri = await bsky.createPost(fullContent, [bsky.COMMUNITY_TAG]);
          }
          
          // Immediately add the post to local state with the real URI
          const authorInfo = {
            id: session.did,
            displayName: session.displayName,
            handle: `@${session.handle}`,
            avatar: session.avatar || '🦋'
          };

          if (replyTo) {
            const newReply: Post = {
              id: postUri,
              author: authorInfo,
              content,
              createdAt: new Date(),
              eventTag,
              eventDate,
              eventLocation,
              eventLink,
              replies: [],
              likes: 0,
              reposts: 0,
              liked: false,
              reposted: false,
            };
            setPosts((prev) =>
              prev.map((post) =>
                post.id === replyTo.id
                  ? { ...post, replies: [...post.replies, newReply] }
                  : post
              )
            );
            setReplyTo(null);
          } else {
            const newPost: Post = {
              id: postUri,
              author: authorInfo,
              content,
              createdAt: new Date(),
              eventTag,
              eventDate,
              eventLocation,
              eventLink,
              replies: [],
              likes: 0,
              reposts: 0,
              liked: false,
              reposted: false,
            };
            setPosts((prev) => [newPost, ...prev]);
          }
          
          // Reload to get full data (likes, replies, etc.)
          setTimeout(() => loadCommunityPosts(), 1000);
        } catch (err) {
          console.error('Failed to post:', err);
          alert('Failed to post. Please try again.');
        } finally {
          setIsPosting(false);
        }
      } else {
        // Guest mode - just add locally
        if (replyTo) {
          const newReply: Post = {
            id: `reply-${Date.now()}`,
            author: currentUser,
            content,
            createdAt: new Date(),
            eventTag,
            eventDate,
            eventLocation,
            eventLink,
            replies: [],
            likes: 0,
            reposts: 0,
            liked: false,
            reposted: false,
          };
          setPosts((prev) =>
            prev.map((post) =>
              post.id === replyTo.id
                ? { ...post, replies: [...post.replies, newReply] }
                : post
            )
          );
          setReplyTo(null);
        } else {
          const newPost: Post = {
            id: `post-${Date.now()}`,
            author: currentUser,
            content,
            createdAt: new Date(),
            eventTag,
            eventDate,
            eventLocation,
            eventLink,
            replies: [],
            likes: 0,
            reposts: 0,
            liked: false,
            reposted: false,
          };
          setPosts((prev) => [newPost, ...prev]);
        }
      }
    },
    [replyTo, session]
  );

  const handleThread = useCallback((postId: string) => {
    setActiveThread(postId);
    setCurrentView('thread');
  }, []);

  const handleBack = useCallback(() => {
    setActiveThread(null);
    setCurrentView('feed');
  }, []);

  const handleOpenCompose = useCallback(() => {
    if (!session && !isGuest) {
      // Require login to post
      return;
    }
    setReplyTo(null);
    setComposeOpen(true);
  }, [session, isGuest]);

  // Filter posts for feed tabs
  const filteredPosts = posts.filter((post) => {
    if (feedTab === 'events') return !!post.eventTag;
    if (feedTab === 'discussions') return !post.eventTag;
    return true;
  });

  const activePost = activeThread ? posts.find((p) => p.id === activeThread) : null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <span className="text-5xl animate-pulse">💬</span>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading CommunityFriend...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!session && !isGuest) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onDemo={handleDemo}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentView={currentView}
          setView={setCurrentView}
          onCompose={handleOpenCompose}
          session={session}
          isGuest={isGuest}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} setView={setCurrentView} onCompose={handleOpenCompose} />

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 min-h-screen border-x border-gray-200 dark:border-gray-700 shadow-sm">
          {currentView === 'feed' && (
            <>
              {/* Feed Header */}
              <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">Home</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {session ? (
                        <>
                          📡 Connected as <span className="text-blue-500">@{session.handle}</span> • Posts tagged with #{bsky.COMMUNITY_TAG}
                        </>
                      ) : (
                        <>
                          👀 Browsing as guest • <button onClick={() => { setIsGuest(false); }} className="text-blue-500 hover:underline">Sign in to post</button>
                        </>
                      )}
                    </p>
                  </div>
                  {session && (
                    <button
                      onClick={loadCommunityPosts}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Refresh feed"
                    >
                      🔄
                    </button>
                  )}
                </div>
                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                  {[
                    { key: 'all' as const, label: 'All' },
                    { key: 'events' as const, label: '📅 Events' },
                    { key: 'discussions' as const, label: '💬 Discussions' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFeedTab(tab.key)}
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
                        feedTab === tab.key
                          ? 'text-blue-500'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                      {feedTab === tab.key && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed */}
              {filteredPosts.length === 0 && session ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <span className="text-5xl mb-4">🌱</span>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No community posts yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                    Be the first to post! Your post will be tagged with <span className="text-blue-500">#{bsky.COMMUNITY_TAG}</span> and visible to everyone on Bluesky.
                  </p>
                  <button
                    onClick={handleOpenCompose}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-all"
                  >
                    ✍️ Make the first post
                  </button>
                </div>
              ) : (
                <Feed
                  posts={filteredPosts}
                  onReply={handleReply}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onThread={handleThread}
                />
              )}
            </>
          )}

          {currentView === 'thread' && activePost && (
            <ThreadView
              post={activePost}
              onBack={handleBack}
              onReply={handleReply}
              onLike={handleLike}
              onRepost={handleRepost}
              onComposeReply={() => {
                setReplyTo(activePost);
                setComposeOpen(true);
              }}
            />
          )}

          {currentView === 'events' && (
            <EventsView posts={posts} onThread={handleThread} />
          )}

          {currentView === 'profile' && <ProfileView posts={posts} session={session} />}
        </div>
      </main>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={composeOpen}
        onClose={() => {
          setComposeOpen(false);
          setReplyTo(null);
        }}
        onSubmit={handleCompose}
        replyTo={replyTo}
        isPosting={isPosting}
      />
    </div>
  );
}
