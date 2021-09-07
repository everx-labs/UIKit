/**
 * Type of UICarouselContainer children
 */
export type CarouselChildren = React.ReactElement<UICarouselViewPageProps>[] | React.ReactElement<UICarouselViewPageProps>
| React.ReactElement<UICarouselViewPageProps>[];
/**
 * Container properties.
 */
export type UICarouselViewContainerProps = {
   /** callback that is called when the page changes */
   onPageIndexChange?: (newPageIndex: number) => void;
   /** determines whether pages should move when clicked */
   isPageMovesOnPress?: boolean
   /** determines whether paginaton should be shown  */
   showPagination?: boolean
   /** index of first shown page */
   initialIndex?: number;
   /** used for autotests */
   testID?: string;
   /** only UICarouselViewPage can be passed to children */
   children: CarouselChildren;
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

export enum PaginationState {
    NotActive = 0,
    Active = 1,
}