import { useEffect, useState, useCallback, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import tradeService from "../services/tradeService";
import { journalService } from "../services/journalService";
export function useWorkspace() {
  const { user } = useContext(AuthContext),
    request = useRef(0);
  const [state, setState] = useState({
    loading: true,
    trades: [],
    accounts: [],
    profile: null,
    error: "",
  });
  const reload = useCallback(async () => {
    if (!user?.id) return;
    const version = ++request.current;
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const [trades, accounts, profile] = await Promise.all([
        tradeService.all(),
        journalService.accounts(),
        journalService.profile(),
      ]);
      if (version === request.current)
        setState({ trades, accounts, profile, loading: false, error: "" });
    } catch (e) {
      if (version === request.current)
        setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, [user?.id]);
  useEffect(() => {
    reload();
    return () => {
      request.current += 1;
    };
  }, [reload]);
  return { ...state, reload };
}
