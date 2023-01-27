import { useDimensions } from '@tonlabs/uikit.layout';

export function useWindowDimensions() {
    /**
     * On different platforms it behave differently.
     *
     * On iOS it seems `windowHeight` is equal to `screenHeight`.
     *
     * On Android `windowHeight` doesn't include a status bar height and
     * a navigation bar (the one on the bottom). Since we use edge-to-edge
     * right now we want to use `screenHeight` to be fullscreen.
     */
    return useDimensions().screen;
}
