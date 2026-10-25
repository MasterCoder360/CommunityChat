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
  replies: Post[];
  likes: number;
  reposts: number;
  liked: boolean;
  reposted: boolean;
}

export type ViewType = 'feed' | 'thread' | 'compose' | 'events' | 'profile';
