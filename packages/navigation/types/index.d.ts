declare module 'react-qr-reader';

declare module '@tonlabs/uikit.core';
declare module '@tonlabs/uikit.components';

declare class WorkletEventHandler<Event> {
    worklet: (event: Event) => void;
}
