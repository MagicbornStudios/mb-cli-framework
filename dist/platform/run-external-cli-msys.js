import { spawnSync } from 'node:child_process';
import path from 'node:path';
/**
 * Git Bash / MSYS on Windows: spawning `claude` / `codex` as a **child of `node.exe`**
 * breaks their TTY/stdin detection (Claude mis-resolves to `--print` with the “no stdin” error).
 */
export function shouldUseMsysBashExecWrapper() {
    if (process.platform !== 'win32') {
        return false;
    }
    return Boolean(process.env.MSYSTEM || process.env.MINGW_PREFIX);
}
function bashSingleQuoted(arg) {
    return `'${arg.replace(/'/g, `'\\''`)}'`;
}
/** `cd <posixCwd> && exec <command> <argv…>` for `bash -c`. */
export function buildMsysBashCdExecScript(posixCwd, command, argv) {
    const cd = bashSingleQuoted(posixCwd.replace(/\\/g, '/'));
    const tail = argv.map(bashSingleQuoted).join(' ');
    return tail.length > 0 ? `cd ${cd} && exec ${command} ${tail}` : `cd ${cd} && exec ${command}`;
}
export function runExternalCliViaMsysBashCdExec(command, argv, cwdNative) {
    const script = buildMsysBashCdExecScript(cwdNative, command, argv);
    return spawnSync('bash', ['-c', script], {
        stdio: 'inherit',
        shell: false,
        env: process.env,
        windowsHide: true,
    });
}
/**
 * **cmd.exe** `cd /d` + command — often works when `bash -c` under Node still leaves Claude in “print” mode
 * (different console attach / ConPTY path than mintty → bash → user `claude`).
 */
export function buildCmdCdExecLine(absWinCwd, command, argv) {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const cd = q(path.normalize(absWinCwd));
    if (argv.length === 0) {
        return `cd /d ${cd} && ${command}`;
    }
    return `cd /d ${cd} && ${command} ${argv.map(q).join(' ')}`;
}
export function runExternalCliViaCmdCdExec(command, argv, cwdNative) {
    const line = buildCmdCdExecLine(path.resolve(cwdNative), command, argv);
    return spawnSync('cmd.exe', ['/d', '/s', '/c', line], {
        stdio: 'inherit',
        windowsHide: true,
        env: process.env,
    });
}
