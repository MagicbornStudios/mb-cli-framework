import type { CopilotFormDescriptor } from './portfolio-site-chat-types.js';
/** Bottom-of-thread summary when `/api/chat` returns `copilotForm` (schema from `copilot_open_form`). */
export declare function CliCopilotFormPanel(props: {
    form: CopilotFormDescriptor;
    cols: number;
}): import("react/jsx-runtime").JSX.Element;
