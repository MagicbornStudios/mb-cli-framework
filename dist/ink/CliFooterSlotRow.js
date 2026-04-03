import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
/**
 * Claude Code–style single footer line: `slot0 | slot1 | slot2` with muted separators.
 */
export function CliFooterSlotRow(props) {
    const pipe = _jsx(Text, { color: props.theme.muted, children: " | " });
    return (_jsx(Box, { flexDirection: "row", width: props.width, marginTop: 1, children: _jsxs(Box, { flexDirection: "row", flexWrap: "wrap", children: [props.slots[0], pipe, props.slots[1], pipe, props.slots[2]] }) }));
}
