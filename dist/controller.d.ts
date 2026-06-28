import type { SnackbarItem, SnackbarOptions } from './types';
export declare class SnackbarController {
    private queue;
    private state;
    private renderer;
    private displayTimer;
    private transitionTimer;
    private queueGapTimer;
    private transitionDuration;
    private initialized;
    init(options?: SnackbarOptions): void;
    destroy(): void;
    add(message: string, action?: SnackbarItem['action'], duration?: number): void;
    show(message: string, action?: SnackbarItem['action'], duration?: number): void;
    clearQueue(): void;
    hideCurrent(): void;
    isInitialized(): boolean;
    getTransitionDuration(): number;
    private showNext;
    private showItem;
    private hideActiveItem;
    private finishCurrentItem;
    private ensureInitialized;
    private clearTimers;
    private clearTimer;
}
//# sourceMappingURL=controller.d.ts.map