import { useCallback, useRef } from "react";

const useInfiniteScroll = (callback: () => void) => {
  const observer = useRef<IntersectionObserver>(null);
  const objectRef = useCallback((node: HTMLDivElement) => {
    if(observer.current){
        observer.current?.disconnect();
    }
    observer.current = new IntersectionObserver((enteries) => {
        if(enteries[0].isIntersecting){
            callback()
        }
    }, {
        threshold: [0.5, 0.25]
    })

    if(node){
        observer.current.observe(node)
    }
  }, [])

  return objectRef
};

export default useInfiniteScroll;
