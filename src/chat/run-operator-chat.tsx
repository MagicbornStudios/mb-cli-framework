import React from 'react';
import { render } from 'ink';
import { OperatorChatApp } from './OperatorChatApp.js';

export async function renderOperatorChat(params: { chatApiUrl: string }): Promise<void> {
  const { waitUntilExit } = render(<OperatorChatApp chatApiUrl={params.chatApiUrl} />);
  await waitUntilExit();
}
