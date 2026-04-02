import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import type { CliTheme } from '../cli-theme.js';

export type CliActivityLineProps = {
  theme: CliTheme;
  /** Static label, e.g. `Thinking` or `Waiting`. */
  label: string;
  /** Append ` · Ns` with N incrementing every second (isolated subtree — safe for frequent ticks). */
  showElapsed?: boolean;
};

/**
 * Status line for long-running work (Claude Code “thinking…” pattern). Keep **outside** the
 * transcript column so only this node re-renders on the timer.
 */
export function CliActivityLine(props: CliActivityLineProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!props.showElapsed) {
      setSeconds(0);
      return;
    }
    setSeconds(0);
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [props.showElapsed, props.label]);

  const suffix = props.showElapsed ? ` · ${seconds}s` : '';
  return (
    <Text color={props.theme.muted} dimColor>
      {props.label}
      {suffix}
    </Text>
  );
}
