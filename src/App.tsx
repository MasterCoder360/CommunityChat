import { useState, useCallback } from 'react';
import { Post, ViewType } from './types';
import { initialPosts, currentUser } from './data';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import ThreadView from './components/ThreadView';
import ComposeModal from './components/ComposeModal';
import EventsView from './components/EventsView';
import ProfileView from './components/ProfileView';
import MobileNav from './components/MobileNav';

export default function App() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<Post | null>(null);
  const [feedTab, setFeedTab] = useState<'all' | 'events' | 'discussions'>('all');

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        // Check replies
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
  }, []);

  const handleRepost = useCallback((postId: string) => {
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
  }, []);

  const handleReply = useCallback((postId: string) => {
    // Search top-level posts first
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setReplyTo(post);
      setComposeOpen(true);
      return;
    }
    // Search nested replies
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
    (content: string, eventTag?: string, eventDate?: string, eventLocation?: string, eventLink?: string) => {
      if (replyTo) {
        // Add as reply
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
        // New post
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
    },
    [replyTo]
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
    setReplyTo(null);
    setComposeOpen(true);
  }, []);

  // Filter posts for feed tabs
  const filteredPosts = posts.filter((post) => {
    if (feedTab === 'events') return !!post.eventTag;
    if (feedTab === 'discussions') return !post.eventTag;
    return true;
  });

  const activePost = activeThread ? posts.find((p) => p.id === activeThread) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentView={currentView} setView={setCurrentView} onCompose={handleOpenCompose} />
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
                <div className="px-4 py-3">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">Home</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    📡 Events auto-imported from <span className="text-blue-500">@Community1stJC</span> & <span className="text-blue-500">@JerseyCityCulture</span>
                  </p>
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
              <Feed
                posts={filteredPosts}
                onReply={handleReply}
                onLike={handleLike}
                onRepost={handleRepost}
                onThread={handleThread}
              />
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

          {currentView === 'profile' && <ProfileView posts={posts} />}
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
      />
    </div>
  );
}
