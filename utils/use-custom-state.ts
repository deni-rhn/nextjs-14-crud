"use-client";

import { layoutColumns } from "@/common/constant";
import { useCallback, useMemo, useState } from "react";

export function useCustomState(initial = layoutColumns) {
  const column = useMemo(() => initial, []);
  const [_refresh, setRefresh] = useState(0);
  const cb = useCallback((func: any) => {
    func(column);
    setRefresh((it: any) => ++it);
  }, []);

  return [column, cb]
}