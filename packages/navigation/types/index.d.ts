declare module 'react-qr-reader';

declare module '@tonlabs/uikit.core';
declare module '@tonlabs/uikit.components';
declare module '@tonlabs/uikit.assets';

declare class WorkletEventHandler<Event> {
    worklet: (event: Event) => void;
}
