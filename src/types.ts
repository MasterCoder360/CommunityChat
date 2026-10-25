export interface User {
  id: string;
  displayName: string;
  handle: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  eventTag?: string;
  eventDate?: string;
  eventLocation?: string;
  eventLink?: string;
  source?: string;       // e.g. "community1stjc.com"
  sourceHandle?: string; // e.g. "@Community1st JC"
  sourceAvatar?: string; // emoji for source
  isAutoImported?: boolean;
  replies: Post[];
  likes: number;
  reposts: number;
  liked: boolean;
  reposted: boolean;
}

export type ViewType = 'feed' | 'thread' | 'compose' | 'events' | 'profile';
