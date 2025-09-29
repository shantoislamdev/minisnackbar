interface SnackbarAction {
    text: string;
    handler: () => void;
}

interface SnackbarOptions {
    transitionDuration?: number;
}

interface Snackbar {
    add(message: string, action?: SnackbarAction | null, duration?: number): void;
    show(message: string, action?: SnackbarAction | null, duration?: number): void;
    showNext(): void;
    clearQueue(): void;
    hideCurrent(): void;
    init(options?: SnackbarOptions): void;
    destroy(): void;
    getTransitionDuration(): number;
    isInitialized(): boolean;
    readonly queue: SnackbarItem[];
    readonly isShowing: boolean;
    readonly currentTimeout: number | null;
    readonly state: string;
}

interface SnackbarItem {
    message: string;
    action?: SnackbarAction | null;
    duration: number;
}

declare const Snackbar: Snackbar;

export default Snackbar;
export { Snackbar, SnackbarAction, SnackbarItem, SnackbarOptions };
