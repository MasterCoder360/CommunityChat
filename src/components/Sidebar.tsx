import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onCompose: () => void;
}

export default function Sidebar({ currentView, setView, onCompose }: SidebarProps) {
  const navItems: { view: ViewType; icon: string; label: string }[] = [
    { view: 'feed', icon: '🏠', label: 'Home Feed' },
    { view: 'events', icon: '📅', label: 'Events' },
    { view: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <span className="text-3xl">💬</span>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">CommunityFriend</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Conversations</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left transition-all ${
              currentView === item.view
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Compose Button */}
      <button
        onClick={onCompose}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-full transition-all shadow-lg hover:shadow-xl mb-4"
      >
        ✍️ New Post
      </button>

      {/* User Info */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
        <span className="text-2xl">🧑‍💻</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">You</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@you.cosmospark</p>
        </div>
      </div>
    </aside>
  );
}
