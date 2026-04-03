import type { CliSessionV1 } from './cli-session.js';
import type { SiteChatRagMode } from './portfolio-site-chat-types.js';
export type ParsedSlashChat = {
    kind: 'model';
    args: string[];
} | {
    kind: 'rag';
    sub: 'off' | 'cycle';
};
export declare function parseSlashChatLine(line: string): ParsedSlashChat | null;
export declare function formatRagModeLabel(mode: SiteChatRagMode | undefined): string;
export declare function cycleRagMode(stored: SiteChatRagMode | undefined): SiteChatRagMode | undefined;
export declare function isValidChatModelId(id: string): boolean;
export declare function fetchOpenAiChatModelIds(): Promise<string[]>;
/**
 * Handles `/model`, `/rag`, `/index` in the chat composer (local session + assistant reply).
 * Returns `null` when the line is not a recognized slash command.
 */
export declare function handleSlashChatLine(input: {
    userLine: string;
    getSession: () => CliSessionV1;
    persistSession: (patch: Partial<CliSessionV1>) => void;
    fetchModels?: () => Promise<string[]>;
}): Promise<{
    assistantText: string;
} | null>;
