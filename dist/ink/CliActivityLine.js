import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Text } from 'ink';
/**
 * Status line for long-running work (Claude Code “thinking…” pattern). Keep **outside** the
 * transcript column so only this node re-renders on the timer.
 */
export function CliActivityLine(props) {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        if (!props.showElapsed) {
            setSeconds(0);
            return;
        }
        setSeconds(0);
        const id = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);
        return () => clearInterval(id);
    }, [props.showElapsed, props.label]);
    const suffix = props.showElapsed ? ` · ${seconds}s` : '';
    return (_jsxs(Text, { color: props.theme.muted, dimColor: true, children: [props.label, suffix] }));
}
