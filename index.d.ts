interface SnackbarAction {
    text: string;
    handler: () => void;
}

interface SnackbarItem {
    message: string;
    action?: SnackbarAction | null;
    duration: number;
}

interface Snackbar {
    add(message: string, action?: SnackbarAction | null, duration?: number): void;
    show(message: string, action?: SnackbarAction | null, duration?: number): void;
    showNext(): void;
    clearQueue(): void;
    hideCurrent(): void;
    init(): void;
}

declare const Snackbar: Snackbar;

export default Snackbar;
export { Snackbar, SnackbarAction, SnackbarItem };
