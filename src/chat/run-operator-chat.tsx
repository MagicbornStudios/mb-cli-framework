import React from 'react';
import { render } from 'ink';
import { OperatorChatApp } from './OperatorChatApp.js';

export async function renderOperatorChat(params: { chatApiUrl: string; repoRoot?: string }): Promise<void> {
  if (process.stdout.isTTY) {
    console.clear();
  }
  const { waitUntilExit } = render(
    <OperatorChatApp chatApiUrl={params.chatApiUrl} repoRoot={params.repoRoot} />,
  );
  await waitUntilExit();
}
