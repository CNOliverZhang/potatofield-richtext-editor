import { useCallback } from 'react';
import { debounce, DebouncedFunc, DebounceSettings, throttle, ThrottleSettings } from 'lodash';

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: DebounceSettings,
): DebouncedFunc<T> => {
  const debouncedFunction = useCallback(debounce(callback, delay, options), [
    delay,
    callback,
    options,
  ]);
  return debouncedFunction;
};

export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: ThrottleSettings,
): DebouncedFunc<T> => {
  const throttledFunction = useCallback(throttle(callback, delay, options), [
    delay,
    callback,
    options,
  ]);
  return throttledFunction;
};
