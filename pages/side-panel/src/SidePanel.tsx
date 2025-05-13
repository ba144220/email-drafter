import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import UseStreamTest from './pages/use-stream-test';

const SidePanel = () => {
  return <UseStreamTest />;
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
