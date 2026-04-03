import React from 'react';
import { Box, Text } from 'ink';
import { resolveCliTheme } from '../cli-theme.js';
import type { CopilotFormDescriptor } from './portfolio-site-chat-types.js';

/** Bottom-of-thread summary when `/api/chat` returns `copilotForm` (schema from `copilot_open_form`). */
export function CliCopilotFormPanel(props: { form: CopilotFormDescriptor; cols: number }) {
  const theme = resolveCliTheme();
  const { form, cols } = props;
  const head = `${form.collection} · ${form.intent}${form.id ? ` · ${form.id}` : ''}`;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={theme.border}
      paddingX={1}
      marginTop={1}
      width={cols}
    >
      <Text bold color={theme.openai}>
        {form.title}
      </Text>
      <Text color={theme.muted}>{head}</Text>
      {form.fields.slice(0, 28).map((f) => (
        <Text key={f.name} color={theme.description}>
          • {f.name} ({f.kind}){f.required ? ' *' : ''}
        </Text>
      ))}
      {form.fields.length > 28 ? (
        <Text color={theme.muted}>… +{form.fields.length - 28} more</Text>
      ) : null}
      <Text color={theme.muted} dimColor>
        Create: POST /api/copilot/create with confirm:true (same copilot auth as chat tools).
      </Text>
    </Box>
  );
}
