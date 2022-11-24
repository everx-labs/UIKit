import { useDimensions } from '@tonlabs/uicast.keyboard';

export function useWindowDimensions() {
    /**
     * On different platforms it behave differently.
     *
     * On web `screenHeight` is equal to a device screen height
     * a browser window is usually smaller (and can be resized).
     */
    return useDimensions().window;
}
