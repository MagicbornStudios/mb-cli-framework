import { jsx as _jsx } from "react/jsx-runtime";
import { render } from 'ink';
import { OperatorChatApp } from './OperatorChatApp.js';
export async function renderOperatorChat(params) {
    const { waitUntilExit } = render(_jsx(OperatorChatApp, { chatApiUrl: params.chatApiUrl }));
    await waitUntilExit();
}
