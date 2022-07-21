declare module '@tonlabs/uikit.core';

type InputBinder = {
    setText: (text: string) => void;
};
type UIKitInputController = {
    bind: (viewTag: number) => InputBinder;
};
// eslint-disable-next-line no-underscore-dangle
declare const _uiKitInputController: UIKitInputController | undefined;
