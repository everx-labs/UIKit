export function useAmountInputHover() {
    /**
     * We don't need a hover effects on mobile.
     */
    return { onMouseEnter: undefined, onMouseLeave: undefined };
}
