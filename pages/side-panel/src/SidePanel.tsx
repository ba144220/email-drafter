import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import Thread from './components/chat/thread';

const SidePanel = () => {
  return <Thread />;
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
