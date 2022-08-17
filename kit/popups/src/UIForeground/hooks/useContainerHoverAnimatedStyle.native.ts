/**
 * We don't need 'hover' features on all platforms except the web.
 */
export function useContainerHoverAnimatedStyle() {
    return { animatedStyle: undefined, onMouseEnter: undefined, onMouseLeave: undefined };
}
