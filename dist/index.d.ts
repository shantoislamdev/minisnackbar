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
import type { SnackbarAction, SnackbarOptions } from './types';
export type { SnackbarAction, SnackbarOptions };
declare class Snackbar {
    static init(options?: SnackbarOptions): void;
    static destroy(): void;
    static getTransitionDuration(): number;
    static add(message: string, action?: SnackbarAction | null, duration?: number): void;
    static show(message: string, action?: SnackbarAction | null, duration?: number): void;
    static clearQueue(): void;
    static hideCurrent(): void;
    static isInitialized(): boolean;
}
export default Snackbar;
export { Snackbar };
//# sourceMappingURL=index.d.ts.map