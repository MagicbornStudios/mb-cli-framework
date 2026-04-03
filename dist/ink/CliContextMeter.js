import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
/**
 * Horizontal bar (filled / empty blocks) + percentage — Claude Code–style session context hint.
 * Values are **approximate** unless the host passes model-accurate token counts.
 */
export function CliContextMeter(props) {
    const label = props.label ?? 'ctx';
    const pct = Math.max(0, Math.min(100, Math.round(props.usedPct)));
    const barMax = Math.max(8, Math.min(28, Math.floor(props.width * 0.22)));
    const filled = Math.round((barMax * pct) / 100);
    const empty = barMax - filled;
    const bar = `${'▓'.repeat(filled)}${'░'.repeat(empty)}`;
    return (_jsxs(Box, { flexDirection: "row", children: [_jsxs(Text, { color: props.theme.muted, children: [label, " "] }), _jsx(Text, { color: props.theme.asset, children: bar }), _jsxs(Text, { color: props.theme.asset, children: [" ", pct, "%"] })] }));
}
