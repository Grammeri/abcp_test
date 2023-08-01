/*import { useRef, useEffect, useCallback } from 'react';

export function useThrottle(fn: (...args: any[]) => void, delay: number): () => void {
    const lastRun = useRef(Date.now());

    return useCallback(function(...args: any[]) {
        if (Date.now() - lastRun.current >= delay) {
            fn.apply(null, args);
            lastRun.current = Date.now();
        }
    }, [delay, fn]);
}*/
export {}