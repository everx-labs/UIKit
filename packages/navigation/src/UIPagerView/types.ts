/** type of UIPagerViewContainer */
export type UIPagerViewContainerType = 'Scrollable' | 'Fixed' | 'FixedPadded';

/**
 * Container properties.
 */
export type UIPagerViewContainerProps = {
    /** type of UIPagerViewContainer */
    type: UIPagerViewContainerType;
    /** index of first shown page */
    initialPageIndex?: number;
    /** callback that is called when the page changes */
    onPageIndexChange?: (newPageIndex: number) => void;
    /** only UIPagerViewPage can be passed to children */
    children: React.ReactElement<UIPagerViewPageProps> | React.ReactElement<UIPagerViewPageProps>[];
    /** used for autotests */
    testID?: string;
};

/**
 * Page properties.
 */
export type UIPagerViewPageProps = {
    /** Unique string for the page */
    id: string;
    /** title of page */
    title: string;
    /** main content component for the page */
    component: () => React.ReactElement;
    /** Set if page is destructive ("Danger zone") */
    isDestructive?: boolean;
    /** used for autotests */
    testID?: string;
};

/**
 * UIPagerView components
 */
export type UIPagerViewComponents = {
    /** Parent component that contains the pages */
    Container: React.FC<UIPagerViewContainerProps>;
    /** Page component */
    Page: React.FC<UIPagerViewPageProps>;
};
