import React, { Suspense } from "react";

function withLoading<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: React.ReactNode
) {
  const LazyComponent = React.lazy(importFunc);

  return (props: T) => 
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  
}

export default withLoading;
