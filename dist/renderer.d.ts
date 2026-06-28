import type { SnackbarAction } from './types';
export declare class SnackbarRenderer {
    private readonly document;
    private actionButton;
    private actionHandler;
    constructor(document: Document);
    ensureRoot(transitionDuration: number): boolean;
    destroy(): void;
    setMessage(message: string): void;
    setAction(action: SnackbarAction | null, onClick: () => void): void;
    show(): void;
    hide(): void;
    cleanupAction(): void;
    getTransitionDuration(fallback: number): number;
    private getRoot;
    private createActionButton;
}
//# sourceMappingURL=renderer.d.ts.map