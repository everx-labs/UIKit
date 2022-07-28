declare module '@tonlabs/uikit.core';

type InputController = {
    setText: (text: string, caretPosition: number) => void;
};
type UIKitInputBinder = {
    bind: (viewTag: number) => InputController;
};
// eslint-disable-next-line no-underscore-dangle
declare const _uiKitInputBinder: UIKitInputBinder | undefined;
