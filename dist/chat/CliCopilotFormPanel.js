import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { resolveCliTheme } from '../cli-theme.js';
/** Bottom-of-thread summary when `/api/chat` returns `copilotForm` (schema from `copilot_open_form`). */
export function CliCopilotFormPanel(props) {
    const theme = resolveCliTheme();
    const { form, cols } = props;
    const head = `${form.collection} · ${form.intent}${form.id ? ` · ${form.id}` : ''}`;
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "single", borderColor: theme.border, paddingX: 1, marginTop: 1, width: cols, children: [_jsx(Text, { bold: true, color: theme.openai, children: form.title }), _jsx(Text, { color: theme.muted, children: head }), form.fields.slice(0, 28).map((f) => (_jsxs(Text, { color: theme.description, children: ["\u2022 ", f.name, " (", f.kind, ")", f.required ? ' *' : ''] }, f.name))), form.fields.length > 28 ? (_jsxs(Text, { color: theme.muted, children: ["\u2026 +", form.fields.length - 28, " more"] })) : null, _jsx(Text, { color: theme.muted, dimColor: true, children: "Create: POST /api/copilot/create with confirm:true (same copilot auth as chat tools)." })] }));
}
