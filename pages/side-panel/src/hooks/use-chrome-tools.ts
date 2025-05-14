import { type useStream } from '@langchain/langgraph-sdk/react';
import { useEffect } from 'react';
import { type InterruptValue } from '@extension/agents/src/react-agent/browser_tools';
import { getAllTabsInfo } from '../tools/get-all-tabs-info';
import { getActiveTabView } from '@src/tools/get-active-tab-view';

export function useChromeTools(thread: ReturnType<typeof useStream>) {
  const { interrupt, submit } = thread;

  useEffect(() => {
    const handleInterrupt = async () => {
      if (!interrupt) return;
      const interruptValue = interrupt.value as unknown as InterruptValue;
      if (interruptValue.name === 'getAllTabsInfo') {
        const result = await getAllTabsInfo();
        submit(undefined, { command: { resume: result } });
      } else if (interruptValue.name === 'getActiveTabView') {
        const res = await getActiveTabView();
        if (!res) {
          submit(undefined, { command: { resume: 'No active tab found' } });
          return;
        }
        const resultString = `
Title: ${res.title}
URL: ${res.url}
HTML Content (converted to Markdown): 
${res.htmlContent}
`;
        submit(undefined, { command: { resume: resultString } });
      } else {
        throw new Error(`Unknown interrupt: ${JSON.stringify(interruptValue)}`);
      }
    };
    handleInterrupt();
  }, [interrupt, submit]);

  return;
}
