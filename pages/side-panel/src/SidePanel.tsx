import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ToggleButton } from '@extension/ui';
import { useState } from 'react';

const SidePanel = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h1>Side Panel</h1>
      <p>Count: {count}</p>
      <ToggleButton onClick={() => setCount(count + 1)}>Increment</ToggleButton>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
