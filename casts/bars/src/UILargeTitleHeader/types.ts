import type * as React from 'react';
import type { UINavigationBarProps } from '../UINavigationBar';
import type { OnRefresh } from './RefreshControl';

export type ScrollHandlerContext = {
    scrollTouchGuard: boolean;
    continueResetOnMomentumEnd: boolean;
    lastApproximateVelocity: number;
    lastEndTimestamp: number;
    lastMomentumTimestamp: number;
    yWithoutRubberBand: number;
};

export type UILargeTitleHeaderProps = UINavigationBarProps & {
    /**
     * Use it to override the default header with custom element
     */
    headerNavigationBar?: () => React.ReactNode;
    /**
     * A title to use only for collapsible title
     */
    headerLargeTitle?: UINavigationBarProps['title'];
    /**
     * A testID for headerLargeTitle
     */
    headerLargeTitleTestID?: UINavigationBarProps['titleTestID'];
    /**
     * A callback that fires when user press on large title header content
     */
    onHeaderLargeTitlePress?: () => void;
    /**
     * A callback that fires when the user presses on large title header content longer than 500 milliseconds
     */
    onHeaderLargeTitleLongPress?: () => void;
    /**
     * A callback that will be called when resfresh control is activated
     * during pull to refresh.
     *
     * A callback also turn on "pull to refresh" mechanics if it's provided.
     */
    onRefresh?: OnRefresh;
    /**
     * A label string
     */
    label?: string;
    /**
     * testID for label string
     */
    labelTestID?: string;
    /**
     * A note string
     */
    note?: string;
    /**
     * testID for note string
     */
    noteTestID?: string;
    /**
     * What content to render above large title, if any
     */
    renderAboveContent?: () => React.ReactNode;
    /**
     * What content to render below large title, if any
     */
    renderBelowContent?: () => React.ReactNode;
    /**
     * Header has a context provider for children to use in scrollables
     */
    children: React.ReactNode;
};
