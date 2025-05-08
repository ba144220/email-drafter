import { useStream } from '@langchain/langgraph-sdk/react';
import type { Message } from '@langchain/langgraph-sdk';
import React from 'react';
import { cn } from '@src/lib/utils';
export default function UseStreamTest() {
  const thread = useStream<{ messages: Message[] }>({
    apiUrl: 'http://localhost:5678',
    assistantId: 'agent',
    messagesKey: 'messages',
  });

  return (
    <div className="h-full flex flex-col">
      <div className="pb-40 p-4 flex flex-col gap-2">
        {thread.messages.map(message => (
          <div
            key={message.id}
            className={cn('flex flex-row gap-2', message.type === 'human' ? 'justify-end' : 'justify-start')}>
            <div className={cn(message.type === 'tool' ? 'text-xs text-muted-foreground' : '')}>
              {(message.content as string).split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {' '}
                  {line} {index < (message.content as string).split('\n').length - 1 && <br />}{' '}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        className="fixed bottom-0 left-0 right-0 p-4 flex flex-row gap-2"
        onSubmit={e => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const message = new FormData(form).get('message') as string;

          form.reset();
          thread.submit({ messages: [{ type: 'human', content: message }] });
        }}>
        <input type="text" name="message" className="flex-1 bg-muted" />

        {thread.isLoading ? (
          <button key="stop" type="button" onClick={() => thread.stop()}>
            Stop
          </button>
        ) : (
          <button key="submit" type="submit">
            Send
          </button>
        )}
      </form>
    </div>
  );
}
