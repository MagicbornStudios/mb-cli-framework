/** Subset of `apps/portfolio/lib/site-chat` + `/api/chat` response (no monorepo import). */

export type SiteChatConversationMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type SiteChatApiHit = {
  title?: string;
  heading?: string;
  publicUrl?: string;
};

export type SiteChatApiResponse = {
  text?: string;
  hits?: SiteChatApiHit[];
  query?: string;
  model?: string;
  message?: string;
  error?: string;
};
