import type { UISendSheetParams } from './UISendSheet';

export type UIEverLinkSheetProps = {
    /**
     * Prop to control Ever Link sheets visibility.
     */
    visible: boolean;
    /**
     * A callback that is called when the sheet closes;
     *
     * Set `visible` prop to `false` within it.
     */
    onClose: () => void;
    /**
     * Params list for the corresponding type of Ever Link sheet.
     */
    params: UISendSheetParams;
};
