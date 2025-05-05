import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ToggleButton } from '@extension/ui';
import { useState } from 'react';

const SidePanel = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="font-bold text-2xl">Side Panel</h1>
      <p className="text-lg text-blue-500">Count: {count}</p>
      <ToggleButton onClick={() => setCount(count + 1)}>Increment</ToggleButton>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
