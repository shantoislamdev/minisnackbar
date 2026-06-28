import type { SnackbarItem } from './types';
type Warn = (message: string) => void;
export declare function normalizeItem(message: unknown, action?: unknown, duration?: unknown, warn?: Warn): SnackbarItem | null;
export declare function normalizeTransitionDuration(duration: unknown, warn?: Warn): number | null;
export {};
//# sourceMappingURL=validation.d.ts.map