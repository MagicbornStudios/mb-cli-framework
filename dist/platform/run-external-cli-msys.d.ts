import { type SpawnSyncReturns } from 'node:child_process';
/**
 * Git Bash / MSYS on Windows: spawning `claude` / `codex` as a **child of `node.exe`**
 * breaks their TTY/stdin detection (Claude mis-resolves to `--print` with the “no stdin” error).
 */
export declare function shouldUseMsysBashExecWrapper(): boolean;
/** `cd <posixCwd> && exec <command> <argv…>` for `bash -c`. */
export declare function buildMsysBashCdExecScript(posixCwd: string, command: string, argv: string[]): string;
export declare function runExternalCliViaMsysBashCdExec(command: string, argv: string[], cwdNative: string): SpawnSyncReturns<Buffer>;
/**
 * **cmd.exe** `cd /d` + command — often works when `bash -c` under Node still leaves Claude in “print” mode
 * (different console attach / ConPTY path than mintty → bash → user `claude`).
 */
export declare function buildCmdCdExecLine(absWinCwd: string, command: string, argv: string[]): string;
export declare function runExternalCliViaCmdCdExec(command: string, argv: string[], cwdNative: string): SpawnSyncReturns<Buffer>;
