import React from 'react';
import type { CliTheme } from '../cli-theme.js';
export type CliScreenBannerProps = {
    theme: CliTheme;
    /** Content width (columns). */
    width: number;
    /** Primary headline (e.g. product name + version). */
    headline: React.ReactNode;
    /** Extra lines below headline (tagline, cwd, …). */
    children?: React.ReactNode;
};
/**
 * Rounded bordered header card — Claude-style top region. Keeps layout consistent across
 * `magicborn`, `grimetime`, and other hosts.
 */
export declare function CliScreenBanner(props: CliScreenBannerProps): import("react/jsx-runtime").JSX.Element;
