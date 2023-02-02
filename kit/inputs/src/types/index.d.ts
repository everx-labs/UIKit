/* eslint-disable no-underscore-dangle */

declare const _injectInputValue: (viewTag: number, value: string) => void;
declare const _moveInputCaret: (viewTag: number, carretPosition: number) => void;
interface InputManager {
    injectValue: (value: string) => void;
}
declare const _getInputManager: (viewTag: number) => InputManager;
declare const _WORKLET: boolean;
