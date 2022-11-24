export type UIHighlightsContentInset = { left?: number; right?: number };

export type UIHighlightsProps = {
    /**
     * Items of underlying ScrollView.
     * Be aware that though it was built for any children,
     * we still recommend to use pre-defined one,
     * see UIHighlightCard // TODO
     */
    children: React.ReactNode;
    /**
     * Space between children, doesn't apply for a first item.
     */
    spaceBetween?: number;
    /**
     * Space from edges to be applied from either left or right side.
     *
     * It's recommended to set `left` edge to more than 0, since it applies
     * visual feedback for items that are on the left side,
     * they will be visible for the size of the `left` property,
     * that make it clear for a user that there's a content to the left
     */
    contentInset?: UIHighlightsContentInset;
    /**
     * Mobile only
     *
     * Whether items should stick to the left edge
     * after drag was end.
     *
     * Default - false
     *
     * Doesn't work on the web due to macos scroll inertia problem
     */
    pagingEnabled?: boolean;
    /**
     * Whether debug view is visible
     */
    debug?: boolean;
    /**
     * Whether controls panel is visible
     *
     * Default - false
     */
    controlsHidden?: boolean;
};
