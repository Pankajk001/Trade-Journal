import { useEffect, useRef, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { chartConfig } from "../lib/markets";

export default function MarketChart({ symbol, interval, theme }) {
  const host = useRef(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const root = host.current;
    let active = true,
      frame;
    setStatus("loading");
    const failed = () => {
      if (active) setStatus("error");
    };
    const loaded = () => {
      clearTimeout(timeout);
      if (active) setStatus("ready");
    };
    const timeout = setTimeout(failed, 25000);
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    container.appendChild(widget);
    const observer = new MutationObserver(() => {
      const next = container.querySelector("iframe");
      if (!next || next === frame) return;
      frame = next;
      frame.title = "Market chart: " + symbol;
      frame.addEventListener("load", loaded, { once: true });
    });
    observer.observe(container, { childList: true, subtree: true });
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify(chartConfig(symbol, interval, theme));
    script.onerror = failed;
    root.replaceChildren(container);
    container.appendChild(script);
    return () => {
      active = false;
      clearTimeout(timeout);
      observer.disconnect();
      frame?.removeEventListener("load", loaded);
      script.onerror = null;
      root.replaceChildren();
    };
  }, [symbol, interval, theme, attempt]);
  return (
    <div className="market-chart-shell">
      <div className="market-chart-host" ref={host} />
      {status !== "ready" && (
        <div
          className="market-chart-state"
          role={status === "error" ? "alert" : "status"}
        >
          {status === "loading" ? (
            <>
              <span className="loading-dot" />
              <p>Opening market chart…</p>
            </>
          ) : (
            <>
              <h2>The chart couldn’t connect.</h2>
              <p className="muted">
                Check your connection or content blocker, then try again.
              </p>
              <div className="actions">
                <button
                  className="button"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <FiRefreshCw /> Retry chart
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <div className="market-chart-credit tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener nofollow"
        >
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
}
