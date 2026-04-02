/** Under monorepo root; gitignored via `.magicborn/` in portfolio. */
export declare const CHAT_DEV_RUNTIME_DIR = ".magicborn";
export declare const CHAT_DEV_RUNTIME_FILE = "chat-dev.json";
export type PortfolioChatDevRuntimeV1 = {
    version: 1;
    baseUrl: string;
    port: number;
    chatApiUrl: string;
    /** PID of the `pnpm` process started by magicborn chat --dev (if any). */
    pnpmPid?: number;
    updatedAt: string;
};
export declare function monorepoRootFromCwd(start?: string): string | undefined;
export declare function chatDevRuntimePath(repoRoot: string): string;
export declare function readPortfolioChatDevRuntime(start?: string): PortfolioChatDevRuntimeV1 | null;
export declare function writePortfolioChatDevRuntime(repoRoot: string, params: {
    port: number;
    baseUrl: string;
    chatApiUrl: string;
    pnpmPid?: number;
}): void;
export declare function clearPortfolioChatDevRuntime(repoRoot: string): void;
