import { type useStream } from '@langchain/langgraph-sdk/react';
import { useEffect } from 'react';
import { type InterruptValue } from '@extension/agents/src/react-agent/browser_tools';
import { getAllTabsInfo } from '../tools/get-all-tabs-info';

export function useChromeTools(thread: ReturnType<typeof useStream>) {
  const { interrupt, submit } = thread;

  useEffect(() => {
    const handleInterrupt = async () => {
      console.log('==== thread ====');
      if (!interrupt) return;
      const interruptValue = interrupt.value as unknown as InterruptValue;
      let result: string;
      switch (interruptValue.name) {
        case 'getAllTabsInfo':
          result = await getAllTabsInfo();
          submit(undefined, { command: { resume: result } });
          break;
        case 'getTabById':
          submit(undefined, { command: { resume: 'getTabById' } });
          break;
        case 'getCurrentTabView':
          submit(undefined, { command: { resume: 'getCurrentTabView' } });
          break;
        default:
          console.log('no interrupt');
          break;
      }
      console.log('==============');
    };
    handleInterrupt();
  }, [interrupt, submit]);

  return;
}
