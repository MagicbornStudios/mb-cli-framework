/** Subset of `apps/portfolio/lib/site-chat` + `/api/chat` response (no monorepo import). */

/** Per-request RAG scope for `POST /api/chat` (portfolio + CLI session). */
export type SiteChatRagMode = 'off' | 'books' | 'books_planning' | 'books_planning_repo';

export type SiteChatConversationMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type SiteChatClientMetadata = {
  acceptEditsAuto?: boolean;
  source?: string;
};

export type SiteChatApiHit = {
  title?: string;
  heading?: string;
  publicUrl?: string;
};

/** Mirrors `apps/portfolio/lib/copilot/form-descriptor` JSON (no monorepo import). */
export type CopilotFormFieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'select'
  | 'unsupported';

export type CopilotFormFieldDescriptor = {
  name: string;
  kind: CopilotFormFieldKind;
  label: string;
  required: boolean;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
};

export type CopilotFormDescriptor = {
  collection: string;
  intent: 'create' | 'update';
  id?: string;
  title: string;
  fields: CopilotFormFieldDescriptor[];
};

export type SiteChatApiResponse = {
  text?: string;
  hits?: SiteChatApiHit[];
  query?: string;
  model?: string;
  message?: string;
  error?: string;
  copilotToolRounds?: number;
  copilotToolCalls?: number;
  copilotForm?: CopilotFormDescriptor;
};
