import { useState } from 'react';
import { Post } from '../types';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, eventTag?: string, eventDate?: string, eventLocation?: string) => void;
  replyTo?: Post | null;
}

export default function ComposeModal({ isOpen, onClose, onSubmit, replyTo }: ComposeModalProps) {
  const [content, setContent] = useState('');
  const [showEventFields, setShowEventFields] = useState(false);
  const [eventTag, setEventTag] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content, eventTag || undefined, eventDate || undefined, eventLocation || undefined);
    setContent('');
    setEventTag('');
    setEventDate('');
    setEventLocation('');
    setShowEventFields(false);
    onClose();
  };

  const charCount = content.length;
  const maxChars = 500;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
          >
            ✕
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || charCount > maxChars}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-1.5 rounded-full transition-all"
          >
            {replyTo ? 'Reply' : 'Post'}
          </button>
        </div>

        {/* Reply Context */}
        {replyTo && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Replying to <span className="text-blue-500">{replyTo.author.handle}</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {replyTo.content}
            </p>
          </div>
        )}

        {/* Compose Area */}
        <div className="p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-xl">
              🧑‍💻
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyTo ? 'Write your reply...' : 'What\'s happening in the community?'}
              className="flex-1 resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm leading-relaxed outline-none min-h-[100px]"
              autoFocus
            />
          </div>

          {/* Event Fields */}
          {showEventFields && (
            <div className="mt-3 ml-13 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-2">
              <input
                type="text"
                value={eventTag}
                onChange={(e) => setEventTag(e.target.value)}
                placeholder="Event name"
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-blue-400"
              />
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="Date (e.g., October 9, 2025)"
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-blue-400"
              />
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-blue-400"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEventFields(!showEventFields)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                showEventFields
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
              }`}
              title="Tag an event"
            >
              📅
            </button>
          </div>
          <div className={`text-xs ${charCount > maxChars ? 'text-red-500' : 'text-gray-400'}`}>
            {charCount}/{maxChars}
          </div>
        </div>
      </div>
    </div>
  );
}
