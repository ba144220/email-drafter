import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Textarea } from './components/ui/textarea';

const SidePanel = () => {
  return (
    <div className="bg-background text-xs fixed top-0 left-0 p-1.5 w-full h-screen flex flex-col">
      {/* Messages */}
      <div className="flex-1 ">test</div>
      {/* Textarea */}
      <div className="">
        <Textarea
          className="text-xs text-foreground/65 rounded-lg max-h-96 resize-none focus-visible:border-ring focus-visible:ring-0 transition-all duration-200 placeholder:opacity-75"
          placeholder="Type a message"
        />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
