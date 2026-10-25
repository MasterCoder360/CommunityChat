# CommunityFriend Conversations

A Bluesky-powered community events conversation app for Jersey City, built on the AT Protocol.

## 🎯 What This Is

CommunityFriend is a side conversation tool for community events. It lets people:
- **Post publicly** about community events (visible on Bluesky)
- **Reply and discuss** events with other community members
- **Share event details** with dates, locations, and links
- **Discover events** from local sources like CommunityFirst JC and Jersey City Culture

All posts are tagged with `#CosmosParkCommunity` and are visible to anyone on Bluesky.

## 🔐 How Posting Works

### Real Bluesky Integration
- Posts go to the **actual Bluesky network** via the AT Protocol
- Your posts are **public and permanent** on Bluesky
- Anyone using Bluesky (or this app) can see posts tagged with `#CosmosParkCommunity`
- Posts persist across devices and refreshes because they're on the decentralized network

### To Post Publicly:
1. **Sign in with Bluesky** - Enter your handle (e.g., `you.bsky.social`)
2. **Generate an App Password** at https://bsky.app/settings/app-passwords
3. **Enter the app password** in the login form
4. **Post!** - Your content will be tagged with `#CosmosParkCommunity` and visible to everyone

### Guest Mode
- You can browse as a guest without signing in
- Guest mode shows sample community data
- You'll need to sign in to post, reply, like, or repost

## 📡 How Posts Are Loaded

The app fetches posts from two sources:
1. **Your own posts** - Using `getUserPosts()` to get your recent activity
2. **Community posts** - Using `searchCommunityPosts()` to find posts tagged with `#CosmosParkCommunity`

Posts are combined, deduplicated, and sorted by date (newest first).

### Why Posts Might Not Appear Immediately
- Bluesky's search API has indexing delays (usually 10-30 seconds)
- New posts are added to your local state immediately after posting
- Use the 🔄 refresh button to reload the feed
- Your own posts will always appear via `getUserPosts()` even if search hasn't indexed them yet

## 🏘️ Event Sources

The app highlights events from:
- **CommunityFirst JC** (@Community1stJC) - community1stjc.com
- **Jersey City Culture** (@JerseyCityCulture) - jerseycityculture.org

These are shown as "auto-imported" with source attribution.

## 🛠️ Technical Details

### Built With
- React + TypeScript
- Vite
- Tailwind CSS
- @atproto/api (Bluesky SDK)

### Key Files
- `src/bluesky.ts` - AT Protocol API wrapper
- `src/App.tsx` - Main app with auth and post management
- `src/data.ts` - Sample community data and event sources
- `src/components/` - UI components (Feed, PostCard, ComposeModal, etc.)

### API Functions
```typescript
// Authentication
login(handle, password) → BlueskySession
restoreSession() → BlueskySession | null
logout()

// Posting
createPost(text, tags) → uri
createReply(text, parentUri, parentCid, tags) → uri

// Interactions
likePost(uri, cid) → likeUri
repostPost(uri, cid) → repostUri

// Fetching
searchCommunityPosts() → { posts, cursor }
getUserPosts(did) → { posts, cursor }
```

## 📝 Posting Best Practices

When posting about events, include:
- **Event name** - Clear and descriptive
- **Date & time** - When is it happening?
- **Location** - Where in Jersey City?
- **Link** - URL to the event page (optional)
- **Context** - Why should people care?

Example:
```
🎪 Fall Carnival @ Pershing Field is back!

Three weekends of fun for the whole family. 
Rides, games, food vendors, and live music.

📅 Sept 10-28, 2025
📍 Pershing Field, Jersey City
🔗 https://community1stjc.com/

Who's going? Let's coordinate a meetup!
```

## 🔄 Refresh Behavior

- **On mount**: Restores session and loads posts
- **After posting**: Immediately adds post to local state, then reloads after 1 second
- **Manual refresh**: Click the 🔄 button in the feed header
- **Logout**: Clears all posts and session data

## 🌐 Decentralization

This app is built on the AT Protocol, which means:
- **No central server** - Posts live on the Bluesky network
- **Portable** - Your posts are yours, not locked to this app
- **Open** - Anyone can build tools that interact with Bluesky posts
- **Resilient** - No single point of failure

## 📱 Mobile Support

The app is fully responsive:
- Desktop: Sidebar navigation
- Mobile: Bottom navigation bar
- Touch-friendly interactions
- Optimized for small screens

## 🔒 Privacy & Security

- **App passwords** are used instead of your main password
- **Sessions** are stored in localStorage (clear on logout)
- **No tracking** - No analytics or third-party services
- **Open source** - All code is visible and auditable

## 🚀 Future Enhancements

Potential features:
- Event calendar view
- Push notifications for event discussions
- Event RSVP tracking
- Location-based post filtering
- Image/media attachments
- Thread view improvements
- Better search and filtering

## 📄 License

This is a community project for Jersey City residents.

---

**Built with ❤️ for the Jersey City community**

Powered by the [AT Protocol](https://atproto.com) • [Bluesky](https://bsky.social)
