import type { ColorValue } from 'react-native';

export type OnEvent = (...args: any[]) => boolean | Promise<boolean>;

export type UICustomKeyboardView = {
    moduleName: string;
    button: React.ComponentType<any>;
    component: React.ComponentType<any>;
    initialProps?: Record<string, unknown>;
    backgroundColor?: ColorValue;
    onEvent?: OnEvent;
};
