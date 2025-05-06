import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { ArrowUp, ImageIcon, Mail, XIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { cn } from '@extension/ui';
import { agent } from './langgraph/agents/search';
import { useState } from 'react';
import type { BaseMessage } from '@langchain/core/messages';

const SidePanel = () => {
  const [messages, setMessages] = useState<BaseMessage[]>([]);

  const [userMessage, setUserMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const invokeAgent = async (userMessage: string) => {
    setIsGenerating(true);
    const result = await agent.invoke({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });
    console.log(result);
    setMessages(result.messages);
    setIsGenerating(false);
  };
  return (
    <div className="dark text-foreground bg-background text-xs fixed top-0 left-0 p-1.5 w-full h-screen flex flex-col">
      {/* Messages */}
      <div className="flex-1 ">
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <div key={message.id || index}>
              <p>{message.content.toString()}</p>
            </div>
          ))}
      </div>
      {/* Textarea */}
      <Card className="rounded-lg py-2 gap-0 bg-input/30">
        <div className="px-2">
          <Badge variant={'outline'} className="rounded-sm relative group cursor-pointer font-normal">
            <div className="">
              <XIcon
                className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-opacity"
                strokeWidth={1.5}
              />
              <Mail className="w-4 h-4 group-hover:opacity-0 transition-opacity" strokeWidth={1.5} />
            </div>
            Outlook
          </Badge>
        </div>
        <div className="py-1">
          <Textarea
            rows={1}
            className={cn(
              'shadow-none px-2 text-sm text-foreground rounded-none max-h-96 resize-none focus-visible:ring-0 placeholder:opacity-40',
              'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent',
              'border-none min-h-10 font-normal dark:bg-transparent',
            )}
            placeholder="Ask, learn, brainstorm..."
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
          />
        </div>
        <footer className="px-2 flex items-center gap-2">
          <div className="flex-1"></div>
          <Button variant="ghost" size="icon" className="w-6 h-6 cursor-pointer">
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              invokeAgent(userMessage);
              setUserMessage('');
            }}
            disabled={isGenerating}
            variant="default"
            size="icon"
            className="w-6 h-6 cursor-pointer">
            <ArrowUp className="w-4 h-4" />
          </Button>
        </footer>
      </Card>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
