import { ViewType } from '../types';

interface MobileNavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onCompose: () => void;
}

export default function MobileNav({ currentView, setView, onCompose }: MobileNavProps) {
  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex items-center justify-around z-50 md:hidden">
        <button
          onClick={() => setView('feed')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            currentView === 'feed' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Feed</span>
        </button>
        <button
          onClick={() => setView('events')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            currentView === 'events' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">📅</span>
          <span className="text-[10px]">Events</span>
        </button>
        <button
          onClick={onCompose}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl bg-blue-500 text-white shadow-lg"
        >
          <span className="text-xl">✍️</span>
          <span className="text-[10px]">Post</span>
        </button>
        <button
          onClick={() => setView('profile')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            currentView === 'profile' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">👤</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-2 z-50 md:hidden">
        <span className="text-2xl">💬</span>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">CommunityFriend</h1>
      </header>
    </>
  );
}
