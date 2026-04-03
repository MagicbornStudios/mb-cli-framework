import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
/**
 * Rounded bordered header card — Claude-style top region. Keeps layout consistent across
 * `magicborn`, `grimetime`, and other hosts.
 */
export function CliScreenBanner(props) {
    return (_jsx(Box, { borderStyle: "round", borderColor: props.theme.border, flexDirection: "column", paddingX: 1, paddingY: 0, marginBottom: 1, width: props.width, children: _jsxs(Box, { flexDirection: "column", children: [typeof props.headline === 'string' ? (_jsx(Text, { bold: true, color: props.theme.primary, children: props.headline })) : (props.headline), props.children] }) }));
}
