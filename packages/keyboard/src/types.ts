export type OnHeightChange = (height: number) => void;

export type OnItemSelected<T = any> = (
    id: string | undefined,
    item: T,
) => void | Promise<void>;

export type UICustomKeyboardItem = {
    button: React.ComponentType<any>;
    kbID: string;
    component: React.ComponentType<any>;
    props: { [key: string]: any };
    onItemSelected: OnItemSelected;
};
