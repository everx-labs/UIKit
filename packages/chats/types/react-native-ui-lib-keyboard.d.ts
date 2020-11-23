declare module 'react-native-ui-lib/keyboard' {
    import * as React from 'react';
    import { TextInput } from 'react-native';
    import type { ViewProps } from 'react-native';

    interface KeyboardTrackingViewProps extends ViewProps {
        trackInteractive?: boolean;
    }
    export class KeyboardTrackingView extends React.PureComponent<
        KeyboardTrackingViewProps
    > {}
    export class KeyboardAwareInsetsView extends React.PureComponent<
        KeyboardTrackingViewProps
    > {}

    export class KeyboardRegistry {
        static registerKeyboard: (
            id: string,
            generator: () => React.ReactNode,
            params: { [key: string]: any }
        ) => void;
        static getKeyboard: (id: string) => React.ReactNode;
        static getKeyboards: (ids: string[]) => React.ReactNode[];
        static getAllKeyboards: () => React.ReactNode[];
        static addListener: <T>(id: string, cb: T) => void;
        static notifyListeners: <T>(id: string, args: T) => void;
        static removeListeners: <T>(id: string) => void;
        static onItemSelected: <T>(id: string, args: T) => void;
        static requestShowKeyboard: (id: string) => void;
        static toggleExpandedKeyboard: (id: string) => void;
    }

    enum iosScrollBehaviors {
        NONE,
        SCROLL_TO_BOTTOM_INVERTED_ONLY,
        FIXED_OFFSET,
    }

    export type KeyboardAccessoryViewProps = {
        /**
         * Content to be rendered above the keyboard
         */
        renderContent: () => React.ReactNode;
        /**
         * A callback for when the height is changed
         */
        onHeightChanged?: (height: number) => void;
        /**
         * iOS only.
         * The reference to the actual text input (or the keyboard may not reset when instructed to, etc.).
         * This is required.
         */
        kbInputRef: React.Ref<TextInput>;
        /**
         * The keyboard ID (the componentID sent to KeyboardRegistry)
         */
        kbComponent?: string;
        /**
         * The props that will be sent to the KeyboardComponent
         */
        kbInitialProps?: { [key: string]: any };
        /**
         * Callback that will be called when an item on the keyboard has been pressed.
         */
        onItemSelected?: (kbId: string | undefined, args: any) => void;
        /**
         * Callback that will be called if KeyboardRegistry.requestShowKeyboard is called.
         */
        onRequestShowKeyboard?: () => void;
        /**
         * Callback that will be called once the keyboard has been closed
         */
        onKeyboardResigned?: () => void;
        /**
         * iOS only.
         * The scrolling behavior, use KeyboardAccessoryView.iosScrollBehaviors.X where X is:
         * NONE, SCROLL_TO_BOTTOM_INVERTED_ONLY or FIXED_OFFSET
         *
         * default: FIXED_OFFSET
         */
        iOSScrollBehavior?: number;
        /**
         * iOS only.
         * Show the keyboard on a negative scroll
         *
         * default: false
         */
        revealKeyboardInteractive?: boolean;
        /**
         * iOS only.
         * Set to false to turn off inset management and manage it yourself
         *
         * default: true
         */
        manageScrollView?: boolean;
        /**
         * iOS only.
         * Set to true manageScrollView is set to true and still does not work,
         * it means that the ScrollView found is the wrong one and you'll have
         * to have the KeyboardAccessoryView and the ScrollView as siblings
         * and set this to true
         *
         * default: false
         */
        requiresSameParentToManageScrollView?: boolean;
        /**
         * iOS only.
         * Add a (white) SafeArea view beneath the KeyboardAccessoryView
         *
         * default: false
         */
        addBottomView?: boolean;
        /**
         * iOS only.
         * Allow hitting sub-views that are placed beyond the view bounds
         *
         * default: false
         */
        allowHitsOutsideBounds?: boolean;

        /**
         * iOS only.
         * Whether or not to handle SafeArea
         * default: true
         */
        useSafeArea?: boolean;
    };

    export class KeyboardAccessoryView extends React.Component<
        KeyboardAccessoryViewProps
    > {
        static iosScrollBehaviors = iosScrollBehaviors;
    }

    export class KeyboardUtils {
        static dismiss: () => void;
    }
}
