/**
 * MiniSnackbar - A simple vanilla JavaScript snackbar/toast library
 *
 * @version 2.0.0
 * @author Shanto Islam <shantoislamdev@gmail.com>
 * @license MIT
 * @description A lightweight, zero-dependency snackbar library with Material Design integration
 * @repository https://github.com/shantoislamdev/minisnackbar
 * @homepage https://github.com/shantoislamdev/minisnackbar#readme
 */
export interface SnackbarAction {
    text: string;
    handler: () => void;
}
export interface SnackbarOptions {
    transitionDuration?: number;
}
export interface SnackbarItem {
    message: string;
    action: SnackbarAction | null;
    duration: number;
}
type SnackbarState = 'idle' | 'showing' | 'transitioning';
declare class Snackbar {
    private static _queue;
    private static _isShowing;
    private static _currentTimeout;
    private static _state;
    private static _currentActionHandler;
    private static _transitionDuration;
    private static _initialized;
    static init(options?: SnackbarOptions): void;
    static destroy(): void;
    static getTransitionDuration(): number;
    static add(message: string, action?: SnackbarAction | null, duration?: number): void;
    private static _cleanupAction;
    private static _showSnackbar;
    private static _hideSnackbar;
    static show(message: string, action?: SnackbarAction | null, duration?: number): void;
    static showNext(): void;
    static clearQueue(): void;
    static hideCurrent(): void;
    static isInitialized(): boolean;
    static get queue(): SnackbarItem[];
    static set queue(value: SnackbarItem[]);
    static get isShowing(): boolean;
    static set isShowing(value: boolean);
    static get currentTimeout(): ReturnType<typeof setTimeout> | null;
    static set currentTimeout(value: ReturnType<typeof setTimeout> | null);
    static get state(): SnackbarState;
    static set state(value: SnackbarState);
}
export default Snackbar;
export { Snackbar };
//# sourceMappingURL=index.d.ts.map