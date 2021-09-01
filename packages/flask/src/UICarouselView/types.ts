/**
 * Container properties.
 */
export type UICarouselViewContainerProps = {
    /** index of first shown page */
    initialPageIndex?: number;
    /** callback that is called when the page changes */
    onPageIndexChange?: (newPageIndex: number) => void;
    /** only UICarouselViewPage can be passed to children */
    children:
        | React.ReactElement<UICarouselViewPageProps>
        | React.ReactElement<UICarouselViewPageProps>[];
    /** used for autotests */
    testID?: string;
};

/**
 * Page properties.
 */
export type UICarouselViewPageProps = {
    /** main content component for the page */
    component: () => React.ReactElement;
    /** used for autotests */
    testID?: string;
};

/**
 * UICarouselView components
 */
 export type UICarouselViewComponents = {
    /** Parent component that contains the pages */
    Container: React.FC<UICarouselViewContainerProps>;
    /** Page component */
    Page: React.FC<UICarouselViewPageProps>;
};