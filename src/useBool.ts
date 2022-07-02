import { useCallback, useState } from 'react';

export const useBool = (initial: boolean) => {
  const [bool, setBool] = useState(initial);
  const onEnable = useCallback(() => setBool(true), []);
  const onDisable = useCallback(() => setBool(false), []);
  const onToggle = useCallback(() => setBool(last => !last), []);

  return { bool, onEnable, onDisable, onToggle };
};
