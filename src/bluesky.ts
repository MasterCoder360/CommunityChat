import { BskyAgent, RichText } from '@atproto/api';

// Bluesky public API service
const BSKY_SERVICE = 'https://bsky.social';

// Community hashtag for filtering posts
export const COMMUNITY_TAG = 'CosmosParkCommunity';

export interface BlueskySession {
  did: string;
  handle: string;
  displayName: string;
  avatar?: string;
  accessJwt: string;
  refreshJwt: string;
}

export interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName: string;
    avatar?: string;
  };
  record: {
    text: string;
    createdAt: string;
    tags?: string[];
  };
  replyCount: number;
  repostCount: number;
  likeCount: number;
  indexedAt: string;
  viewer?: {
    like?: string;
    repost?: string;
  };
}

let agent: BskyAgent | null = null;

export function getAgent(): BskyAgent | null {
  return agent;
}

export async function login(handle: string, password: string): Promise<BlueskySession> {
  agent = new BskyAgent({ service: BSKY_SERVICE });
  
  const response = await agent.login({
    identifier: handle,
    password: password,
  });

  if (!response.success) {
    throw new Error('Login failed');
  }

  const profile = await agent.getProfile({ actor: response.data.did });
  
  const session: BlueskySession = {
    did: response.data.did,
    handle: response.data.handle,
    displayName: profile.data.displayName || response.data.handle,
    avatar: profile.data.avatar,
    accessJwt: response.data.accessJwt,
    refreshJwt: response.data.refreshJwt,
  };

  localStorage.setItem('bsky_session', JSON.stringify(session));
  
  return session;
}

export async function restoreSession(): Promise<BlueskySession | null> {
  const stored = localStorage.getItem('bsky_session');
  if (!stored) return null;

  try {
    const session: BlueskySession = JSON.parse(stored);
    agent = new BskyAgent({ service: BSKY_SERVICE });
    
    await agent.resumeSession({
      did: session.did,
      handle: session.handle,
      accessJwt: session.accessJwt,
      refreshJwt: session.refreshJwt,
      active: true,
    });

    return session;
  } catch {
    localStorage.removeItem('bsky_session');
    return null;
  }
}

export function logout() {
  agent = null;
  localStorage.removeItem('bsky_session');
}

function mapPost(post: any): BlueskyPost {
  return {
    uri: post.uri,
    cid: post.cid,
    author: {
      did: post.author.did,
      handle: post.author.handle,
      displayName: post.author.displayName || post.author.handle,
      avatar: post.author.avatar,
    },
    record: {
      text: (post.record as any)?.text || '',
      createdAt: (post.record as any)?.createdAt || '',
      tags: (post.record as any)?.tags || [],
    },
    replyCount: post.replyCount || 0,
    repostCount: post.repostCount || 0,
    likeCount: post.likeCount || 0,
    indexedAt: post.indexedAt || '',
    viewer: post.viewer ? {
      like: post.viewer.like,
      repost: post.viewer.repost,
    } : undefined,
  };
}

export async function createPost(text: string, tags?: string[]): Promise<string> {
  if (!agent) throw new Error('Not logged in');

  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  const response = await agent.post({
    text: rt.text,
    facets: rt.facets,
    tags: tags || [COMMUNITY_TAG],
    createdAt: new Date().toISOString(),
  });

  return response.uri;
}

export async function createReply(text: string, parentUri: string, parentCid: string, tags?: string[]): Promise<string> {
  if (!agent) throw new Error('Not logged in');

  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  const response = await agent.post({
    text: rt.text,
    facets: rt.facets,
    reply: {
      root: { uri: parentUri, cid: parentCid },
      parent: { uri: parentUri, cid: parentCid },
    },
    tags: tags || [COMMUNITY_TAG],
    createdAt: new Date().toISOString(),
  });

  return response.uri;
}

export async function likePost(uri: string, cid: string): Promise<string> {
  if (!agent) throw new Error('Not logged in');
  const response = await agent.like(uri, cid);
  return response.uri;
}

export async function unlikePost(likeUri: string): Promise<void> {
  if (!agent) throw new Error('Not logged in');
  await agent.deleteLike(likeUri);
}

export async function repostPost(uri: string, cid: string): Promise<string> {
  if (!agent) throw new Error('Not logged in');
  const response = await agent.repost(uri, cid);
  return response.uri;
}

export async function unrepostPost(repostUri: string): Promise<void> {
  if (!agent) throw new Error('Not logged in');
  await agent.deleteRepost(repostUri);
}

export async function searchCommunityPosts(cursor?: string): Promise<{ posts: BlueskyPost[]; cursor?: string }> {
  if (!agent) throw new Error('Not logged in');

  try {
    const response = await agent.app.bsky.feed.searchPosts({
      q: `#${COMMUNITY_TAG}`,
      limit: 25,
      cursor,
      sort: 'latest',
    });

    const posts: BlueskyPost[] = (response.data.posts || []).map(mapPost);
    return { posts, cursor: response.data.cursor };
  } catch (error) {
    console.error('Failed to search posts:', error);
    return { posts: [] };
  }
}

export async function getTimeline(cursor?: string): Promise<{ posts: BlueskyPost[]; cursor?: string }> {
  if (!agent) throw new Error('Not logged in');

  try {
    const response = await agent.getTimeline({ limit: 25, cursor });
    
    const posts: BlueskyPost[] = (response.data.feed || []).map((item: any) => mapPost(item.post));
    return { posts, cursor: response.data.cursor };
  } catch (error) {
    console.error('Failed to get timeline:', error);
    return { posts: [] };
  }
}
