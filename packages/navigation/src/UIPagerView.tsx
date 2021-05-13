import { UIPagerViewContainer } from './UIPagerViewContainer';
import { UIPagerViewPage } from './UIPagerViewPage';

export type UIPagerViewType = 'Left' | 'Center';

export type IUIPagerViewContainerProps = {
    type: UIPagerViewType;
    initialPageIndex: number;
    onPageIndexChange: (newPageIndex: number) => void;
    children:
        | React.ReactElement<IUIPagerViewPageProps>
        | React.ReactElement<IUIPagerViewPageProps>[];
    testID?: string;
};

export type IUIPagerViewPageProps = {
    title: string;
    component: React.ReactNode;
    testID?: string;
};

export type UIPagerView = {
    Container: React.FC<IUIPagerViewContainerProps>;
    Page: React.FC<IUIPagerViewPageProps>;
};

export const UIPagerView: UIPagerView = {
    Container: UIPagerViewContainer,
    Page: UIPagerViewPage,
};
